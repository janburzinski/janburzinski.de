<script lang="ts">
	import type { ContributionDay } from '$lib/github';
	import { DITHER_GREEN, paintCell, type Rgb } from '$lib/dither/paint';
	import { formatDay } from '$lib/format';

	let { weeks, color = DITHER_GREEN }: { weeks: ContributionDay[][]; color?: Rgb } = $props();

	// Backing-canvas geometry: each day is a CELL_PX square with a GAP_PX gutter, laid out as
	// columns (weeks) × 7 rows (weekdays). The canvas is drawn at this native resolution and CSS-scaled
	// to fill the container, so the dither dots stay chunky (image-rendering: pixelated).
	const CELL_PX = 4;
	const GAP_PX = 1;
	const ROWS = 7;
	const STRIDE = CELL_PX + GAP_PX;
	const gridH = ROWS * STRIDE - GAP_PX;

	const cols = $derived(weeks.length);
	const gridW = $derived(Math.max(1, cols * STRIDE - GAP_PX));

	let canvas: HTMLCanvasElement;
	let wrapper: HTMLDivElement;
	let width = $state(0);
	let hoverWeek = $state<number | null>(null);
	let hoverDay = $state<number | null>(null);
	let pointerX = $state(0);

	// GitHub rows are Sunday-first; getUTCDay() matches (0 = Sunday). Placing by weekday keeps rows
	// aligned even for the partial first/last weeks GitHub returns.
	const weekdayOf = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();

	function render() {
		if (!canvas) return;
		canvas.width = gridW;
		canvas.height = gridH;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, gridW, gridH);

		weeks.forEach((week, wi) => {
			const x0 = wi * STRIDE;
			for (const day of week) {
				const wd = weekdayOf(day.date);
				const y0 = wd * STRIDE;
				const active = wi === hoverWeek && wd === hoverDay ? 1 : 0;
				paintCell(ctx, x0, y0, CELL_PX, color, day.level / 4, active);
			}
		});
	}

	function onMove(e: PointerEvent) {
		const rect = canvas.getBoundingClientRect();
		pointerX = e.clientX - rect.left;
		const relX = pointerX / rect.width;
		const relY = (e.clientY - rect.top) / rect.height;
		hoverWeek = Math.min(cols - 1, Math.max(0, Math.floor((relX * gridW) / STRIDE)));
		hoverDay = Math.min(ROWS - 1, Math.max(0, Math.floor((relY * gridH) / STRIDE)));
	}

	function clearHover() {
		hoverWeek = null;
		hoverDay = null;
	}

	const active = $derived(
		hoverWeek != null && hoverDay != null
			? (weeks[hoverWeek]?.find((d) => weekdayOf(d.date) === hoverDay) ?? null)
			: null
	);
	// Keep the tooltip inside the wrapper.
	const tipLeft = $derived(Math.max(8, Math.min(Math.max(8, width - 8), pointerX)));

	$effect(() => {
		// render() reads weeks, color, gridW, hoverWeek, hoverDay — tracked, so this re-runs on hover.
		render();
	});

	$effect(() => {
		if (!wrapper) return;
		const ro = new ResizeObserver((entries) => {
			width = entries[0].contentRect.width;
		});
		ro.observe(wrapper);
		return () => ro.disconnect();
	});
</script>

<div class="graph" bind:this={wrapper}>
	<canvas bind:this={canvas} onpointermove={onMove} onpointerleave={clearHover}></canvas>

	{#if active}
		<div class="tip" style="left: {tipLeft}px" class:flip={tipLeft > width / 2}>
			<span class="tip-count">
				{active.count === 0 ? 'No' : active.count.toLocaleString('en-US')}
				{active.count === 1 ? 'contribution' : 'contributions'}
			</span>
			<span class="tip-date">{formatDay(active.date)}</span>
		</div>
	{/if}
</div>

<style>
	.graph {
		position: relative;
		width: 100%;
	}

	canvas {
		display: block;
		width: 100%;
		height: auto;
		image-rendering: pixelated;
		cursor: crosshair;
	}

	.tip {
		position: absolute;
		bottom: calc(100% + 8px);
		transform: translateX(-8px);
		min-width: 150px;
		padding: 0.5rem 0.65rem;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		background: #1c1c1f;
		border: 1px solid #2c2c30;
		border-radius: 10px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
		pointer-events: none;
		z-index: 2;
	}

	.tip.flip {
		transform: translateX(calc(-100% + 8px));
	}

	.tip-count {
		color: #f4f4f5;
		font-weight: 600;
		font-size: 0.875rem;
	}

	.tip-date {
		color: #8a8a90;
		font-size: 0.75rem;
	}
</style>
