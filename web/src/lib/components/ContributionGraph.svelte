<script lang="ts">
	import type { ContributionDay } from '$lib/github';
	import { DITHER_GREEN, paintCell, type Rgb } from '$lib/dither/paint';
	import { formatDay } from '$lib/format';

	let { weeks, color = DITHER_GREEN }: { weeks: ContributionDay[][]; color?: Rgb } = $props();

	// Draw at native dither resolution and let CSS scale the canvas.
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
	// On touch there's no hover: a tap sets the active cell and it stays until
	// the next tap lands outside the graph.
	let touchActive = $state(false);

	// GitHub weeks and getUTCDay() are both Sunday-first.
	const weekdayOf = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();

	let ctx: CanvasRenderingContext2D | null = null;
	let lastHover: { wi: number; day: ContributionDay } | null = null;

	function paintDay(wi: number, day: ContributionDay, intensity: number) {
		if (!ctx) return;
		const x0 = wi * STRIDE;
		const y0 = weekdayOf(day.date) * STRIDE;
		// Clear first because paintCell uses partial alpha.
		ctx.clearRect(x0, y0, CELL_PX, CELL_PX);
		paintCell(ctx, x0, y0, CELL_PX, color, day.level / 4, intensity);
	}

	function renderBase() {
		if (!canvas) return;
		canvas.width = gridW;
		canvas.height = gridH;
		ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, gridW, gridH);
		weeks.forEach((week, wi) => {
			for (const day of week) paintDay(wi, day, 0);
		});
		lastHover = null;
	}

	function setCellFromPointer(e: PointerEvent) {
		const rect = canvas.getBoundingClientRect();
		pointerX = e.clientX - rect.left;
		const relX = pointerX / rect.width;
		const relY = (e.clientY - rect.top) / rect.height;
		hoverWeek = Math.min(cols - 1, Math.max(0, Math.floor((relX * gridW) / STRIDE)));
		hoverDay = Math.min(ROWS - 1, Math.max(0, Math.floor((relY * gridH) / STRIDE)));
	}

	function onMove(e: PointerEvent) {
		// Mouse hover, or scrubbing a finger across the cells after a tap.
		if (e.pointerType !== 'touch' || touchActive) setCellFromPointer(e);
	}

	function onDown(e: PointerEvent) {
		if (e.pointerType !== 'touch') return;
		touchActive = true;
		// Keep receiving moves even if the finger drifts off the canvas.
		canvas.setPointerCapture?.(e.pointerId);
		setCellFromPointer(e);
	}

	function onLeave(e: PointerEvent) {
		// On touch the tip stays until the next tap outside; only clear for mouse.
		if (e.pointerType !== 'touch') clearHover();
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
	const tipLeft = $derived(Math.max(8, Math.min(Math.max(8, width - 8), pointerX)));

	$effect(() => {
		renderBase();
	});

	$effect(() => {
		const hw = hoverWeek;
		const hd = hoverDay;
		if (!ctx) return;
		if (lastHover) paintDay(lastHover.wi, lastHover.day, 0);
		lastHover = null;
		if (hw != null && hd != null) {
			const day = weeks[hw]?.find((d) => weekdayOf(d.date) === hd);
			if (day) {
				paintDay(hw, day, 1);
				lastHover = { wi: hw, day };
			}
		}
	});

	$effect(() => {
		if (!wrapper) return;
		const ro = new ResizeObserver((entries) => {
			width = entries[0].contentRect.width;
		});
		ro.observe(wrapper);
		return () => ro.disconnect();
	});

	// Dismiss the touch tooltip when the next tap lands outside the graph.
	$effect(() => {
		if (!touchActive) return;
		const onOutside = (e: PointerEvent) => {
			if (e.pointerType === 'touch' && !wrapper.contains(e.target as Node)) {
				touchActive = false;
				clearHover();
			}
		};
		window.addEventListener('pointerdown', onOutside);
		return () => window.removeEventListener('pointerdown', onOutside);
	});
</script>

<div class="graph" bind:this={wrapper}>
	<canvas bind:this={canvas} onpointerdown={onDown} onpointermove={onMove} onpointerleave={onLeave}
	></canvas>

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
		/* Let vertical page scroll pass through, but keep taps/horizontal scrubs. */
		touch-action: pan-y;
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
		background: var(--surface);
		border: 1px solid var(--surface-border);
		border-radius: 10px;
		box-shadow: var(--surface-shadow);
		pointer-events: none;
		z-index: 2;
	}

	.tip.flip {
		transform: translateX(calc(-100% + 8px));
	}

	.tip-count {
		color: var(--text-primary);
		font-weight: 600;
		font-size: 0.875rem;
	}

	.tip-date {
		color: var(--text-muted);
		font-size: 0.75rem;
	}
</style>
