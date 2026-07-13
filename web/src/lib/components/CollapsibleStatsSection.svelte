<script lang="ts">
	import { ChevronDown } from 'lucide-svelte';
	import { cubicOut } from 'svelte/easing';
	import type { Snippet } from 'svelte';

	type StatRow = { label: string; value: string };

	let {
		title,
		rows,
		marginTop,
		children
	}: {
		title: string;
		rows: StatRow[];
		marginTop: string;
		children?: Snippet;
	} = $props();

	let open = $state(false);

	function expand(node: HTMLElement) {
		const height = parseFloat(getComputedStyle(node).height);

		return {
			duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 200,
			easing: cubicOut,
			css: (t: number) => `overflow: hidden; height: ${t * height}px; min-height: 0;`
		};
	}
</script>

<section style:margin-top={marginTop}>
	<button class="toggle" onclick={() => (open = !open)} aria-expanded={open} type="button">
		<span>{title}</span>
		<ChevronDown size={14} class="chev {open ? 'open' : ''}" />
	</button>

	{#if open}
		<div class="content" transition:expand>
			<dl class="stats">
				{#each rows as row (row.label)}
					<div class="row">
						<dt>{row.label}</dt>
						<dd>{row.value}</dd>
					</div>
				{/each}
			</dl>

			{#if children}
				{@render children()}
			{/if}
		</div>
	{/if}
</section>

<style>
	.content {
		display: flow-root;
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

	@media (prefers-reduced-motion: reduce) {
		.toggle :global(.chev) {
			transition: none;
		}
	}
</style>
