<script lang="ts">
	import { onMount } from 'svelte';
	import { Sun, Moon, Monitor } from 'lucide-svelte';

	type Theme = 'light' | 'dark' | 'system';

	let theme: Theme = 'system';
	let isOpen = false;
	let dropdownEl: HTMLDivElement;

	const themes = [
		{ value: 'light' as const, icon: Sun, label: 'Hell' },
		{ value: 'dark' as const, icon: Moon, label: 'Dunkel' },
		{ value: 'system' as const, icon: Monitor, label: 'System' }
	];

	onMount(() => {
		const saved = localStorage.getItem('theme') as Theme | null;
		if (saved && ['light', 'dark', 'system'].includes(saved)) {
			theme = saved;
		}
		applyTheme(theme);
	});

	function applyTheme(newTheme: Theme) {
		const root = document.documentElement;

		if (newTheme === 'system') {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			root.classList.toggle('dark', prefersDark);
			root.classList.toggle('light', !prefersDark);
		} else {
			root.classList.toggle('dark', newTheme === 'dark');
			root.classList.toggle('light', newTheme === 'light');
		}
	}

	function toggle(e: MouseEvent) {
		e.stopPropagation();
		isOpen = !isOpen;
	}

	function setTheme(newTheme: Theme) {
		theme = newTheme;
		localStorage.setItem('theme', newTheme);
		applyTheme(newTheme);
		isOpen = false;
	}

	function closeDropdown() {
		isOpen = false;
	}

	$: currentIcon = themes.find((t) => t.value === theme)?.icon || Monitor;
</script>

<svelte:window on:click={closeDropdown} />

<div class="theme-switcher">
	<button
		class="theme-button"
		on:click={(e) => toggle(e)}
		aria-label="Theme wechseln"
		type="button"
	>
		<svelte:component this={currentIcon} size={18} />
	</button>

	{#if isOpen}
		<div
			class="theme-dropdown"
			bind:this={dropdownEl}
			on:click|stopPropagation
		>
			{#each themes as t, i (t.value)}
				<button
					class="theme-option"
					class:active={theme === t.value}
					on:click|stopPropagation={() => setTheme(t.value)}
					type="button"
					style="animation-delay: {i * 30}ms"
				>
					<svelte:component this={t.icon} size={16} />
					<span class="option-label">{t.label}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.theme-switcher {
		position: relative;
	}

	.theme-button {
		background: transparent;
		border: none;
		padding: 8px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-secondary);
		transition:
			color 0.2s var(--ease-out),
			background-color 0.2s var(--ease-out),
			transform 160ms var(--ease-out);
		border-radius: 6px;
	}

	@media (hover: hover) and (pointer: fine) {
		.theme-button:hover {
			background: var(--hover-bg);
			color: var(--text-primary);
		}
	}

	/* Press feedback */
	.theme-button:active {
		transform: scale(0.92);
	}

	/* Dropdown — scale from top-right trigger origin */
	.theme-dropdown {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		background: var(--dropdown-bg);
		border: 1px solid var(--border-color);
		border-radius: 12px;
		padding: 6px;
		min-width: 140px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(10px);
		z-index: 1000;
		transform-origin: top right;
		animation: dropdownIn 180ms var(--ease-out) forwards;
	}

	@keyframes dropdownIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	/* Staggered option entry */
	.theme-option {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		padding: 10px 12px;
		border: none;
		background: transparent;
		border-radius: 8px;
		cursor: pointer;
		color: var(--text-secondary);
		font-family: var(--font-geist-mono);
		font-size: 0.85rem;
		text-align: left;
		opacity: 0;
		animation: optionFadeIn 200ms var(--ease-out) forwards;
		transition:
			background-color 0.15s var(--ease-out),
			color 0.15s var(--ease-out),
			transform 120ms var(--ease-out);
	}

	@keyframes optionFadeIn {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (hover: hover) and (pointer: fine) {
		.theme-option:hover {
			background: var(--hover-bg);
			color: var(--text-primary);
		}
	}

	/* Press feedback on options */
	.theme-option:active {
		transform: scale(0.97);
	}

	.theme-option.active {
		background: var(--active-bg);
		color: var(--text-primary);
	}

	.option-label {
		flex: 1;
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.theme-dropdown {
			animation: none;
			opacity: 1;
		}

		.theme-option {
			animation: none;
			opacity: 1;
		}

		.theme-button:active {
			transform: none;
		}

		.theme-option:active {
			transform: none;
		}
	}

	@media (max-width: 480px) {
		.theme-button {
			padding: 6px;
		}

		.theme-dropdown {
			right: -10px;
		}
	}
</style>
