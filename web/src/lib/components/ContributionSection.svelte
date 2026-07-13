<script lang="ts">
	import type { ContributionStats } from '$lib/github';
	import { formatDay } from '$lib/format';
	import { DITHER_GREEN, paintCell } from '$lib/dither/paint';
	import CollapsibleStatsSection from './CollapsibleStatsSection.svelte';
	import ContributionGraph from './ContributionGraph.svelte';

	let { stats }: { stats: ContributionStats } = $props();

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

<CollapsibleStatsSection title="github activity" {rows} marginTop="1.5rem">
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
</CollapsibleStatsSection>

<style>
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
</style>
