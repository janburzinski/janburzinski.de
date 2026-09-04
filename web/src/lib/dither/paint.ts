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

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const rgba = ([r, g, b]: Rgb, a: number) => `rgba(${r},${g},${b},${a})`;

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

export const DITHER_GREEN: Rgb = [40, 210, 110];
