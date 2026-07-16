<script lang="ts">
	import { ChartColumn, ChartPie } from 'lucide-svelte';

	let { value, onSelect }: { value: 'bar' | 'pie'; onSelect: (v: 'bar' | 'pie') => void } =
		$props();
</script>

<!-- Segmented switch (iOS-ish: recessed track, raised pill on the active option). Themed via the
     surface tokens so it holds up in light and dark. -->
<div class="seg" role="group" aria-label="Chart view">
	<button
		type="button"
		class:on={value === 'bar'}
		aria-pressed={value === 'bar'}
		aria-label="Bar chart"
		onclick={() => onSelect('bar')}
	>
		<ChartColumn size={13} />
	</button>
	<button
		type="button"
		class:on={value === 'pie'}
		aria-pressed={value === 'pie'}
		aria-label="Pie chart"
		onclick={() => onSelect('pie')}
	>
		<ChartPie size={13} />
	</button>
</div>

<style>
	.seg {
		display: inline-flex;
		padding: 2px;
		gap: 2px;
		background: color-mix(in srgb, var(--text-primary) 8%, transparent);
		border-radius: 7px;
	}

	.seg button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3px 7px;
		border: none;
		background: none;
		border-radius: 5px;
		color: var(--text-muted);
		cursor: pointer;
		transition:
			color 0.12s ease,
			background 0.12s ease,
			box-shadow 0.12s ease;
	}

	.seg button.on {
		background: var(--surface);
		color: var(--text-primary);
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.14),
			0 0 0 1px var(--surface-border);
	}

	@media (hover: hover) and (pointer: fine) {
		.seg button:not(.on):hover {
			color: var(--text-secondary);
		}
	}
</style>
