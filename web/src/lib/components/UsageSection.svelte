<script lang="ts">
	import type { UsageStats } from '$lib/usage';
	import { formatTokens, prettyModel } from '$lib/format';
	import UsageChart from './UsageChart.svelte';
	import { ChevronDown } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	let { stats }: { stats: UsageStats } = $props();
	let open = $state(false);

	const rows = $derived([
		{ label: 'tokens', value: formatTokens(stats.totals.tokens) },
		{ label: 'contributions', value: stats.totals.contributions.toLocaleString('en-US') },
		{ label: 'active days', value: String(stats.totals.activeDays) },
		{ label: 'longest streak', value: `${stats.totals.longestStreak}d` },
		{ label: 'top model', value: prettyModel(stats.totals.topModel) }
	]);
</script>

<section class="usage">
	<button class="toggle" onclick={() => (open = !open)} aria-expanded={open} type="button">
		<span>ai usage</span>
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

			{#if stats.daily.length}
				<div class="chart-wrap">
					<UsageChart daily={stats.daily} height={110} />
				</div>
			{/if}
		</div>
	{/if}
</section>

<style>
	.usage {
		margin-top: 2.5rem;
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

	.chart-wrap {
		margin-top: 1.5rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.toggle :global(.chev) {
			transition: none;
		}
	}
</style>
