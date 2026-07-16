<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { DailyUsage } from '$lib/usage';
	import { CELL, DITHER_PURPLE, paintBar, type Rgb } from '$lib/dither/paint';
	import { formatDay, formatDayShort, formatTokens, prettyModel } from '$lib/format';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	let {
		daily,
		color = DITHER_PURPLE,
		height = 150,
		windowDays = 14,
		trailing
	}: {
		daily: DailyUsage[];
		color?: Rgb;
		height?: number;
		windowDays?: number;
		trailing?: Snippet;
	} = $props();

	let offset = $state(0);

	const total = $derived(daily.length);
	const maxOffset = $derived(Math.max(0, total - windowDays));
	const clampedOffset = $derived(Math.min(offset, maxOffset));
	const end = $derived(total - clampedOffset);
	const start = $derived(Math.max(0, end - windowDays));

	const data = $derived(daily.slice(start, end));
	const max = $derived(Math.max(1, ...data.map((d) => d.tokens)));

	const canOlder = $derived(start > 0);
	const canNewer = $derived(clampedOffset > 0);
	const rangeLabel = $derived(
		data.length
			? `${formatDayShort(data[0].date)} – ${formatDayShort(data[data.length - 1].date)}`
			: ''
	);

	function older() {
		offset = Math.min(maxOffset, clampedOffset + windowDays);
		hover = null;
	}

	function newer() {
		offset = Math.max(0, clampedOffset - windowDays);
		hover = null;
	}

	let canvas: HTMLCanvasElement;
	let bloomCanvas: HTMLCanvasElement;
	let wrapper: HTMLDivElement;
	let width = $state(0);
	let hover = $state<number | null>(null);
	let pointerX = $state(0);

	function layout(cols: number) {
		const n = Math.max(1, data.length);
		const slot = cols / n;
		const barW = Math.max(1, Math.round(slot * 0.68));
		return { slot, barW };
	}

	let ctx: CanvasRenderingContext2D | null = null;
	let curCols = 0;
	let curRows = 0;

	function paintBars() {
		const c = ctx;
		if (!c) return;
		const { slot, barW } = layout(curCols);
		data.forEach((d, i) => {
			const x0 = Math.round(i * slot + (slot - barW) / 2);
			// sqrt keeps quiet days visible next to a spike without lying about the ordering.
			const h = Math.round(Math.sqrt(d.tokens / max) * (curRows - 2));
			const top = curRows - h;
			const intensity = hover === i ? 1 : 0;
			for (let x = x0; x < x0 + barW && x < curCols; x++) {
				paintBar(c, x, top, curRows, color, intensity);
			}
		});
	}

	// CSS blurs and additively blends this copy behind the crisp bars.
	function syncBloom() {
		if (!bloomCanvas) return;
		bloomCanvas.width = curCols;
		bloomCanvas.height = curRows;
		const bctx = bloomCanvas.getContext('2d');
		if (!bctx) return;
		bctx.clearRect(0, 0, curCols, curRows);
		bctx.drawImage(canvas, 0, 0);
	}

	function render() {
		if (!canvas || !width) return;
		const cols = Math.max(8, Math.round(width / CELL));
		const rows = Math.max(8, Math.round(height / CELL));
		if (canvas.width !== cols || canvas.height !== rows) {
			canvas.width = cols;
			canvas.height = rows;
		}
		curCols = cols;
		curRows = rows;
		ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, curCols, curRows);
		paintBars();
		syncBloom();
	}

	function onMove(e: PointerEvent) {
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		pointerX = x;
		const n = Math.max(1, data.length);
		hover = Math.min(n - 1, Math.max(0, Math.floor((x / rect.width) * n)));
	}

	const active = $derived(hover != null ? data[hover] : null);
	const tipLeft = $derived(Math.max(8, Math.min(width - 8, pointerX)));

	// Repaint when the data window, size, or hovered day changes.
	$effect(() => {
		void [data, max, hover, width, height];
		render();
	});

	$effect(() => {
		if (!wrapper) return;
		// Measure immediately so the first paint doesn't depend on the async ResizeObserver callback
		// firing (which can race the mount and leave `width` at 0 → a blank/partial chart).
		const measure = () => (width = wrapper.getBoundingClientRect().width);
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(wrapper);
		return () => ro.disconnect();
	});
</script>

<div class="head">
	{#if rangeLabel}<span class="range">{rangeLabel}</span>{/if}
	<div class="head-right">
		{#if canOlder || canNewer}
			<div class="nav">
				<button type="button" onclick={older} disabled={!canOlder} aria-label="Show earlier days">
					<ChevronLeft size={14} />
				</button>
				<button type="button" onclick={newer} disabled={!canNewer} aria-label="Show later days">
					<ChevronRight size={14} />
				</button>
			</div>
		{/if}
		{#if trailing}{@render trailing()}{/if}
	</div>
</div>

<div class="chart" bind:this={wrapper} style="height: {height}px">
	<canvas
		bind:this={canvas}
		class="crisp"
		style="width: 100%; height: {height}px"
		onpointermove={onMove}
		onpointerleave={() => (hover = null)}
	></canvas>

	<canvas
		bind:this={bloomCanvas}
		class="bloom"
		style="width: 100%; height: {height}px"
		aria-hidden="true"
	></canvas>

	{#if active}
		<div class="tip" style="left: {tipLeft}px" class:flip={tipLeft > width / 2}>
			<div class="tip-head">
				<span class="tip-date">{formatDay(active.date)}</span>
				<span class="tip-total">{formatTokens(active.tokens)}</span>
			</div>
			<ul class="tip-models">
				{#each active.models.slice(0, 4) as m (m.model)}
					<li>
						<span class="tip-model">{prettyModel(m.model)}</span>
						<span class="tip-tokens">{formatTokens(m.tokens)}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.6rem;
		font-size: 0.75rem;
		color: var(--text-muted);
		font-variant-numeric: tabular-nums;
		min-height: 24px;
	}

	.head-right {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.nav {
		display: flex;
		gap: 2px;
	}

	.nav button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2px;
		background: none;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
	}

	.nav button:disabled {
		opacity: 0.3;
		cursor: default;
	}

	@media (hover: hover) and (pointer: fine) {
		.nav button:not(:disabled):hover {
			color: var(--text-secondary);
		}
	}

	.chart {
		position: relative;
		width: 100%;
	}

	canvas {
		display: block;
		image-rendering: pixelated;
		cursor: crosshair;
	}

	.bloom {
		position: absolute;
		inset: 0;
		pointer-events: none;
		image-rendering: auto;
		filter: blur(4px) brightness(1.3) saturate(1.5);
		mix-blend-mode: plus-lighter;
		opacity: 0.6;
		z-index: 1;
	}

	.tip {
		position: absolute;
		top: calc(100% + 8px);
		transform: translateX(-8px);
		min-width: 190px;
		padding: 0.65rem 0.75rem;
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

	.tip-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1.5rem;
		margin-bottom: 0.4rem;
	}

	.tip-date {
		color: var(--text-muted);
		font-size: 0.75rem;
	}

	.tip-total {
		color: var(--text-primary);
		font-weight: 600;
		font-size: 0.9375rem;
	}

	.tip-models {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.tip-models li {
		display: flex;
		justify-content: space-between;
		gap: 1.5rem;
		font-size: 0.8125rem;
	}

	.tip-model {
		color: var(--text-secondary);
	}

	.tip-tokens {
		color: var(--text-muted);
		font-variant-numeric: tabular-nums;
	}
</style>
