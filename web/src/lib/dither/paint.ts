// Ordered-dither painting, ported from dither-kit (github.com/Boring-Software-Inc/dither-kit,
// registry/dither-kit/dither-paint.ts) to plain framework-free canvas so it runs in Svelte.
//
// Guiding rule kept from the original: work in opacities of one colour, not different shades — a
// single fill whose alpha follows the dither density reads correctly on both light and dark themes.

export type Rgb = [number, number, number];

// 4×4 Bayer matrix, normalized to 0–1 thresholds — the exact matrix dither-kit dithers with.
export const BAYER = [
	[0, 8, 2, 10],
	[12, 4, 14, 6],
	[3, 11, 1, 9],
	[15, 7, 13, 5]
].map((row) => row.map((v) => (v + 0.5) / 16));

/** css px per dither cell — chunky enough to read pixelated. */
export const CELL = 3;
/** Opacity of the top edge outline (just under solid, so it reads as a soft edge). */
const BORDER_ALPHA = 0.72;
/** Opacity of a dither "off" cell relative to an "on" cell. */
const OFF_TIER = 0.4;

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const rgba = ([r, g, b]: Rgb, a: number) => `rgba(${r},${g},${b},${a})`;

/**
 * Fill backing-canvas column `x` from `top` down to `floor` with the ordered-dither scatter — solid
 * at the floor, dissolving upward toward the value line — then cap the top with a soft edge outline.
 * `intensity` (0–1) lifts opacity on hover. The single source of the bar's dither texture.
 */
export function paintBar(
	ctx: CanvasRenderingContext2D,
	x: number,
	top: number,
	floor: number,
	fill: Rgb,
	intensity = 0
) {
	const t = Math.round(top);
	const f = Math.round(floor);
	const depth = f - t;
	if (depth <= 0) {
		ctx.fillStyle = rgba(fill, BORDER_ALPHA);
		ctx.fillRect(x, t, 1, 1);
		return;
	}
	for (let y = t; y < f; y++) {
		// Inverted falloff: dense at the floor, thinning as it rises toward the outline.
		const density = (y - t) / depth;
		const lit = density > BAYER[y & 3][x & 3] - 0.1 * intensity;
		const k = (0.3 + density * 0.7) * (1 + 0.22 * intensity);
		const alpha = clamp01(lit ? k : k * OFF_TIER);
		ctx.fillStyle = rgba(fill, alpha);
		ctx.fillRect(x, y, 1, 1);
	}
	// Top edge outline (the fill fades out here) with a faint feather row beneath.
	ctx.fillStyle = rgba(fill, BORDER_ALPHA);
	ctx.fillRect(x, t, 1, 1);
	if (depth > 1) {
		ctx.fillStyle = rgba(fill, BORDER_ALPHA * 0.5);
		ctx.fillRect(x, t + 1, 1, 1);
	}
}

/** Opacity of an unlit cell in a grid — a faint slot so empty days still read as a grid. */
const SLOT_ALPHA = 0.08;

/**
 * Fill a `size`×`size` grid cell at (`x0`,`y0`) with an ordered-dither block whose density follows
 * `level` (0–1): level 0 is a barely-there slot, level 1 a solid square, and the tiers between scatter
 * in the classic Bayer pattern. The Bayer lookup uses absolute backing coords, so the dither field
 * stays coherent across the whole grid instead of restarting per cell. `intensity` (0–1) lifts the
 * whole cell on hover. The single source of the contribution grid's dither texture.
 */
export function paintCell(
	ctx: CanvasRenderingContext2D,
	x0: number,
	y0: number,
	size: number,
	fill: Rgb,
	level: number,
	intensity = 0
) {
	const l = clamp01(level);
	for (let y = y0; y < y0 + size; y++) {
		for (let x = x0; x < x0 + size; x++) {
			const lit = l > BAYER[y & 3][x & 3];
			const alpha = lit
				? clamp01((0.5 + 0.5 * l) * (1 + 0.25 * intensity))
				: clamp01(SLOT_ALPHA * (1 + intensity * 3));
			ctx.fillStyle = rgba(fill, alpha);
			ctx.fillRect(x, y, 1, 1);
		}
	}
}

// Series colours, matching dither-kit's palette seeds.
export const DITHER_PURPLE: Rgb = [150, 110, 255];
export const DITHER_GREEN: Rgb = [40, 210, 110];
