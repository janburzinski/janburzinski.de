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

// Categorical dither palette (dither-kit's hue set), assigned by index. `unknown` pins to grey.
export const DITHER_PALETTE: Rgb[] = [
	[150, 110, 255], // purple
	[40, 210, 110], // green
	[80, 165, 255], // blue
	[255, 150, 70], // orange
	[255, 105, 180], // pink
	[95, 220, 220], // cyan
	[235, 95, 95] // red
];
export const DITHER_GREY: Rgb = [150, 150, 168];

const TAU = Math.PI * 2;

export type DonutSegment = { color: Rgb; start: number; end: number; intensity?: number };

/**
 * Paint a dithered donut. Angles run clockwise from 12 o'clock. Each segment's fill is feathered
 * at the inner and outer edges so the ring reads as a glowing corona — pair it with a blurred bloom
 * copy for the "sun" look. Gaps between segments are simply pixels no segment claims.
 */
export function paintDonut(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	rOuter: number,
	rInner: number,
	segments: DonutSegment[]
) {
	const band = rOuter - rInner || 1;
	const x0 = Math.max(0, Math.floor(cx - rOuter));
	const x1 = Math.ceil(cx + rOuter);
	const y0 = Math.max(0, Math.floor(cy - rOuter));
	const y1 = Math.ceil(cy + rOuter);

	for (let y = y0; y < y1; y++) {
		for (let x = x0; x < x1; x++) {
			const dx = x - cx + 0.5;
			const dy = y - cy + 0.5;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist > rOuter || dist < rInner) continue;

			let ang = Math.atan2(dy, dx) + Math.PI / 2; // 0 = top, clockwise
			if (ang < 0) ang += TAU;
			if (ang >= TAU) ang -= TAU;
			const seg = segments.find((s) => ang >= s.start && ang < s.end);
			if (!seg) continue;

			const intensity = seg.intensity ?? 0;
			// Brightness envelope: fullest at the middle of the band, fading toward both radial edges.
			const t = (dist - rInner) / band;
			const envelope = Math.min(t, 1 - t) * 2;
			const base = 0.35 + 0.65 * envelope;
			const lit = base > BAYER[y & 3][x & 3] - 0.12 * intensity;
			const k = base * (1 + 0.25 * intensity);
			const alpha = clamp01(lit ? k : k * OFF_TIER);
			ctx.fillStyle = rgba(seg.color, alpha);
			ctx.fillRect(x, y, 1, 1);
		}
	}
}

export function harnessColor(harness: string, index: number): Rgb {
	if (harness === 'unknown') return DITHER_GREY;
	return DITHER_PALETTE[index % DITHER_PALETTE.length];
}
