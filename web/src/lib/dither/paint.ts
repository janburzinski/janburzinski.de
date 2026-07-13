// Ported from dither-kit's dither-paint.ts to plain canvas.

export type Rgb = [number, number, number];

// 4×4 Bayer matrix normalized to 0–1 thresholds.
export const BAYER = [
	[0, 8, 2, 10],
	[12, 4, 14, 6],
	[3, 11, 1, 9],
	[15, 7, 13, 5]
].map((row) => row.map((v) => (v + 0.5) / 16));

export const CELL = 2;
const BORDER_ALPHA = 0.72;
const OFF_TIER = 0.4;

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const rgba = ([r, g, b]: Rgb, a: number) => `rgba(${r},${g},${b},${a})`;

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
	// Cap the fading fill with a faint feather row.
	ctx.fillStyle = rgba(fill, BORDER_ALPHA);
	ctx.fillRect(x, t, 1, 1);
	if (depth > 1) {
		ctx.fillStyle = rgba(fill, BORDER_ALPHA * 0.5);
		ctx.fillRect(x, t + 1, 1, 1);
	}
}

const SLOT_ALPHA = 0.08;

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

export const DITHER_PURPLE: Rgb = [150, 110, 255];
export const DITHER_GREEN: Rgb = [40, 210, 110];
