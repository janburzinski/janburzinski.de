<script lang="ts">
	import type { ContributionStats } from '$lib/github';
	import { formatDay } from '$lib/format';
	import { DITHER_GREEN, paintCell } from '$lib/dither/paint';
	import ContributionGraph from './ContributionGraph.svelte';
	import { ChevronDown } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	let { stats }: { stats: ContributionStats } = $props();
	let open = $state(false);

	const rows = $derived([
		{ label: 'contributions', value: stats.total.toLocaleString('en-US') },
		{ label: 'active days', value: String(stats.activeDays) },
		{ label: 'longest streak', value: `${stats.longestStreak}d` },
		{ label: 'current streak', value: `${stats.currentStreak}d` },
		...(stats.busiestDay
			? [
					{
						label: 'busiest day',
						value: `${stats.busiestDay.count} · ${formatDay(stats.busiestDay.date)}`
					}
				]
			: [])
	]);

	// The "less → more" legend, painted with the same dither engine as the grid so the tiers match.
	let legendCanvas = $state<HTMLCanvasElement>();
	$effect(() => {
		if (!legendCanvas) return;
		const size = 4;
		const gap = 1;
		const n = 5;
		legendCanvas.width = n * (size + gap) - gap;
		legendCanvas.height = size;
		const ctx = legendCanvas.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, legendCanvas.width, legendCanvas.height);
		for (let i = 0; i < n; i++) {
			paintCell(ctx, i * (size + gap), 0, size, DITHER_GREEN, i / (n - 1), 0);
		}
	});
</script>

<section class="contrib">
	<button class="toggle" onclick={() => (open = !open)} aria-expanded={open} type="button">
		<span>github activity</span>
		<ChevronDown size={14} class="chev {open ? 'open' : ''}" />
	</button>

	{#if open}
		<div class="panel" transition:slide={{ duration: 200 }}>
			<dl class="stats">
				{#each rows as row (row.label)}
					<div class="row">
						<dt>{row.label}</dt>
						<dd>{row.value}</dd>
					</div>
				{/each}
			</dl>

			{#if stats.weeks.length}
				<div class="graph-wrap">
					<ContributionGraph weeks={stats.weeks} />
				</div>
				<div class="legend">
					<span>less</span>
					<canvas bind:this={legendCanvas}></canvas>
					<span>more</span>
				</div>
			{/if}
		</div>
	{/if}
</section>

<style>
	.contrib {
		margin-top: 1.5rem;
	}

	.toggle {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		color: var(--text-muted);
		font-family: inherit;
		font-size: 0.8125rem;
	}

	.toggle :global(.chev) {
		transition: transform 0.2s ease;
	}

	.toggle :global(.chev.open) {
		transform: rotate(180deg);
	}

	@media (hover: hover) and (pointer: fine) {
		.toggle:hover {
			color: var(--text-secondary);
		}
	}

	.stats {
		margin: 1.25rem 0 0 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-width: 260px;
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1.5rem;
		font-size: 0.8125rem;
	}

	dt {
		color: var(--text-muted);
	}

	dd {
		margin: 0;
		color: var(--text-primary);
		font-variant-numeric: tabular-nums;
	}

	.graph-wrap {
		margin-top: 1.5rem;
	}

	.legend {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 0.65rem;
		font-size: 0.6875rem;
		color: var(--text-muted);
	}

	.legend canvas {
		height: 10px;
		width: auto;
		image-rendering: pixelated;
	}

	@media (prefers-reduced-motion: reduce) {
		.toggle :global(.chev) {
			transition: none;
		}
	}
</style>
