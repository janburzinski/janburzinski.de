<script lang="ts">
	import type { UsageStats } from '$lib/usage';
	import { formatTokens, prettyModel } from '$lib/format';
	import CollapsibleStatsSection from './CollapsibleStatsSection.svelte';
	import UsageChart from './UsageChart.svelte';

	let { stats }: { stats: UsageStats } = $props();

	const rows = $derived([
		{ label: 'tokens', value: formatTokens(stats.totals.tokens) },
		{ label: 'contributions', value: stats.totals.contributions.toLocaleString('en-US') },
		{ label: 'active days', value: String(stats.totals.activeDays) },
		{ label: 'longest streak', value: `${stats.totals.longestStreak}d` },
		{ label: 'top model', value: prettyModel(stats.totals.topModel) }
	]);
</script>

<CollapsibleStatsSection title="ai usage" {rows} marginTop="2.5rem">
	{#if stats.daily.length}
		<div class="chart-wrap">
			<UsageChart daily={stats.daily} height={110} />
		</div>
	{/if}
</CollapsibleStatsSection>

<style>
	.chart-wrap {
		margin-top: 1.5rem;
	}
</style>
