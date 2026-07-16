import { describe, expect, it } from 'vitest';
import { harnessColor, paintDonut, DITHER_GREY, type DonutSegment } from './paint';

/** Minimal 2D-context stub: records the fill colour written at each pixel via fillRect(x,y,1,1). */
function recordingCtx() {
	const pixels = new Map<string, string>();
	let fillStyle = '';
	return {
		ctx: {
			get fillStyle() {
				return fillStyle;
			},
			set fillStyle(v: string) {
				fillStyle = v;
			},
			fillRect(x: number, y: number) {
				pixels.set(`${x},${y}`, fillStyle);
			},
			clearRect() {}
		} as unknown as CanvasRenderingContext2D,
		colorAt: (x: number, y: number) => pixels.get(`${x},${y}`),
		count: () => pixels.size
	};
}

const RED = 'rgba(255,0,0';
const BLUE = 'rgba(0,0,255';

describe('paintDonut', () => {
	const cx = 25;
	const cy = 25;
	const rOuter = 20;
	const rInner = 10;
	// Two half-ring wedges with a 0.2rad gutter on each edge: right half red, left half blue.
	const segments: DonutSegment[] = [
		{ color: [255, 0, 0], start: 0.2, end: Math.PI - 0.2 },
		{ color: [0, 0, 255], start: Math.PI + 0.2, end: 2 * Math.PI - 0.2 }
	];

	const { ctx, colorAt, count } = recordingCtx();
	paintDonut(ctx, cx, cy, rOuter, rInner, segments);

	it('paints something', () => {
		expect(count()).toBeGreaterThan(0);
	});

	it('leaves the donut hole empty', () => {
		expect(colorAt(cx, cy)).toBeUndefined();
	});

	it('does not paint outside the outer radius', () => {
		// (7,7) is inside the bounding box but ~24.7px from centre — beyond rOuter.
		expect(colorAt(7, 7)).toBeUndefined();
	});

	it('maps angle 0 (12 o’clock, in the gutter) to nothing', () => {
		expect(colorAt(cx, 7)).toBeUndefined();
	});

	it('assigns the right-hand wedge to the first segment colour', () => {
		expect(colorAt(cx + 15, cy)?.startsWith(RED)).toBe(true);
	});

	it('assigns the left-hand wedge to the second segment colour', () => {
		expect(colorAt(cx - 15, cy)?.startsWith(BLUE)).toBe(true);
	});
});

describe('harnessColor', () => {
	it('pins unknown to grey regardless of index', () => {
		expect(harnessColor('unknown', 0)).toEqual(DITHER_GREY);
		expect(harnessColor('unknown', 3)).toEqual(DITHER_GREY);
	});

	it('gives distinct palette colours to distinct indices and wraps around', () => {
		const a = harnessColor('claude-code', 0);
		const b = harnessColor('codex', 1);
		expect(a).not.toEqual(b);
		// index 7 wraps back to index 0 of a 7-colour palette.
		expect(harnessColor('x', 7)).toEqual(a);
	});
});
