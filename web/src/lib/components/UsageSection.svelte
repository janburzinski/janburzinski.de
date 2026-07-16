<script lang="ts">
	import type { UsageStats } from '$lib/usage';
	import { formatTokens, prettyHarness, prettyModel } from '$lib/format';
	import CollapsibleStatsSection from './CollapsibleStatsSection.svelte';
	import UsageChart from './UsageChart.svelte';
	import HarnessChart from './HarnessChart.svelte';
	import ChartToggle from './ChartToggle.svelte';

	let { stats }: { stats: UsageStats } = $props();

	// A lone `unknown` slice means the backfill hasn't tagged harnesses yet — hide the donut then.
	const showHarness = $derived(
		stats.harnesses.some((h) => h.harness !== 'unknown') && stats.harnesses.length > 0
	);
	const hasBars = $derived(stats.daily.length > 0);
	const canToggle = $derived(hasBars && showHarness);

	let view = $state<'bar' | 'pie'>('bar');

	const rows = $derived([
		{ label: 'tokens', value: formatTokens(stats.totals.tokens) },
		{ label: 'contributions', value: stats.totals.contributions.toLocaleString('en-US') },
		{ label: 'active days', value: String(stats.totals.activeDays) },
		{ label: 'longest streak', value: `${stats.totals.longestStreak}d` },
		{ label: 'top model', value: prettyModel(stats.totals.topModel) },
		...(showHarness
			? [{ label: 'top harness', value: prettyHarness(stats.totals.topHarness) }]
			: [])
	]);
</script>

{#snippet toggle()}
	<ChartToggle value={view} onSelect={(v) => (view = v)} />
{/snippet}

<CollapsibleStatsSection title="ai usage" {rows} marginTop="2.5rem">
	{#if canToggle && view === 'pie'}
		<div class="chart-wrap">
			<div class="pie-head">
				<span class="chart-label">harness split · by tokens</span>
				{@render toggle()}
			</div>
			<HarnessChart harnesses={stats.harnesses} />
		</div>
	{:else if hasBars}
		<div class="chart-wrap">
			<UsageChart daily={stats.daily} height={168} trailing={canToggle ? toggle : undefined} />
		</div>
	{:else if showHarness}
		<div class="chart-wrap">
			<span class="chart-label standalone">harness split · by tokens</span>
			<HarnessChart harnesses={stats.harnesses} />
		</div>
	{/if}
</CollapsibleStatsSection>

<style>
	.chart-wrap {
		margin-top: 1.5rem;
		/* Reserve the taller view's height (the donut) so toggling bar ↔ pie doesn't reflow the page
		   below it. The donut dominates the pie height regardless of legend rows, so this stays stable. */
		min-height: 208px;
	}

	.pie-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem;
		margin-bottom: 1rem;
	}

	.chart-label {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.chart-label.standalone {
		display: block;
		margin-bottom: 1rem;
	}
</style>
