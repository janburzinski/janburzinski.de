<script lang="ts">
	import type { DailyUsage } from '$lib/usage';
	import { CELL, DITHER_PURPLE, paintBar, type Rgb } from '$lib/dither/paint';
	import { formatDay, formatTokens, prettyModel } from '$lib/format';

	let {
		daily,
		color = DITHER_PURPLE,
		height = 150,
		maxDays = 90
	}: { daily: DailyUsage[]; color?: Rgb; height?: number; maxDays?: number } = $props();

	// Newest `maxDays` days that had usage, oldest → newest so the chart reads left-to-right.
	const data = $derived(daily.slice(-maxDays));
	const max = $derived(Math.max(1, ...data.map((d) => d.tokens)));

	let canvas: HTMLCanvasElement;
	let wrapper: HTMLDivElement;
	let width = $state(0);
	let hover = $state<number | null>(null);
	let pointerX = $state(0);

	// Backing-canvas bar slots, so hover maths and drawing agree on where each bar sits.
	function layout(cols: number) {
		const n = Math.max(1, data.length);
		const slot = cols / n;
		const barW = Math.max(1, Math.round(slot * 0.68));
		return { n, slot, barW };
	}

	function render() {
		if (!canvas || !width) return;
		const cols = Math.max(8, Math.round(width / CELL));
		const rows = Math.max(8, Math.round(height / CELL));
		canvas.width = cols;
		canvas.height = rows;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, cols, rows);

		const { slot, barW } = layout(cols);
		data.forEach((d, i) => {
			const x0 = Math.round(i * slot + (slot - barW) / 2);
			// sqrt keeps quiet days visible next to a spike without lying about the ordering.
			const h = Math.round(Math.sqrt(d.tokens / max) * (rows - 2));
			const top = rows - h;
			const intensity = i === hover ? 1 : 0;
			for (let x = x0; x < x0 + barW && x < cols; x++) {
				paintBar(ctx, x, top, rows, color, intensity);
			}
		});
	}

	function onMove(e: PointerEvent) {
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		pointerX = x;
		const n = Math.max(1, data.length);
		hover = Math.min(n - 1, Math.max(0, Math.floor((x / rect.width) * n)));
	}

	const active = $derived(hover != null ? data[hover] : null);
	// Keep the tooltip inside the wrapper.
	const tipLeft = $derived(Math.max(8, Math.min(width - 8, pointerX)));

	$effect(() => {
		// render() reads data, max, width, hover, height and color — all tracked as effect deps, so
		// this re-runs whenever any of them change.
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

<div class="chart" bind:this={wrapper} style="height: {height}px">
	<canvas
		bind:this={canvas}
		style="width: 100%; height: {height}px"
		onpointermove={onMove}
		onpointerleave={() => (hover = null)}
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
	.chart {
		position: relative;
		width: 100%;
	}

	canvas {
		display: block;
		image-rendering: pixelated;
		cursor: crosshair;
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
