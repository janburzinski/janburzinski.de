<script lang="ts">
	import type { UsageStats } from '$lib/usage';
	import { formatTokens, prettyHarness, prettyModel } from '$lib/format';
	import CollapsibleStatsSection from './CollapsibleStatsSection.svelte';
	import UsageChart from './UsageChart.svelte';
	import HarnessChart from './HarnessChart.svelte';

	let { stats }: { stats: UsageStats } = $props();

	// A lone `unknown` slice means the backfill hasn't tagged harnesses yet — hide the donut then.
	const showHarness = $derived(
		stats.harnesses.some((h) => h.harness !== 'unknown') && stats.harnesses.length > 0
	);

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

<CollapsibleStatsSection title="ai usage" {rows} marginTop="2.5rem">
	{#if stats.daily.length}
		<div class="chart-wrap">
			<UsageChart daily={stats.daily} height={110} />
		</div>
	{/if}

	{#if showHarness}
		<div class="harness-wrap">
			<span class="harness-label">harness split · by tokens</span>
			<HarnessChart harnesses={stats.harnesses} />
		</div>
	{/if}
</CollapsibleStatsSection>

<style>
	.chart-wrap {
		margin-top: 1.5rem;
	}

	.harness-wrap {
		margin-top: 2rem;
	}

	.harness-label {
		display: block;
		margin-bottom: 1rem;
		font-size: 0.75rem;
		color: var(--text-muted);
	}
</style>
