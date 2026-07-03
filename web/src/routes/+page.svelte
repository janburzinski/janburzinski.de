<script lang="ts">
	import { Github, Mail, Sun, Moon, ArrowUpRight } from 'lucide-svelte';
	import { onMount } from 'svelte';

	type Theme = 'light' | 'dark';
	let theme: Theme = 'dark';

	onMount(() => {
		const isDark = document.documentElement.classList.contains('dark');
		theme = isDark ? 'dark' : 'light';
	});

	function toggleTheme() {
		const root = document.documentElement;
		const isDark = theme === 'dark';
		const newTheme: Theme = isDark ? 'light' : 'dark';

		const applyTheme = () => {
			theme = newTheme;
			localStorage.setItem('theme', newTheme);
			root.classList.toggle('dark', newTheme === 'dark');
			root.classList.toggle('light', newTheme === 'light');
		};

		if (!document.startViewTransition) {
			applyTheme();
			return;
		}

		document.startViewTransition(() => {
			applyTheme();
		});
	}
</script>

<svelte:head>
	<title>jan burzinski</title>
</svelte:head>

<div class="page">
	<nav class="topbar">
		<a href="/" class="name">Jan Burzinski</a>
		<div class="nav-right">
			<a href="/impressum" class="nav-link">Imprint</a>
			<a href="/datenschutz" class="nav-link">Privacy</a>
			<button class="nav-icon theme-toggle" on:click={toggleTheme} aria-label="Toggle theme" type="button">
				{#if theme === 'light'}
					<Sun size={16} />
				{:else}
					<Moon size={16} />
				{/if}
			</button>
		</div>
	</nav>

	<div class="main">
		<p>
			Computer Science student at <a href="https://tu.berlin" target="_blank" rel="noopener noreferrer">TU Berlin</a>, 21 years old. My passion for software was sparked by Minecraft. I've been building things ever since.
		</p>

		<div class="social-links">
			<a href="https://github.com/janburzinski" target="_blank" rel="noopener noreferrer" class="social-link">
				<Github size={16} />
				<span>GitHub</span>
				<ArrowUpRight size={13} class="outbound" />
			</a>
			<a href="mailto:jan@burzinski.de" class="social-link">
				<Mail size={16} />
				<span>Mail</span>
				<ArrowUpRight size={13} class="outbound" />
			</a>
		</div>
	</div>
</div>

<style>
	.page {
		width: 100%;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}

	.topbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem 1.5rem 1rem 1.5rem;
	}

	.name {
		font-size: 1.125rem;
		font-weight: 500;
		letter-spacing: -0.01em;
		color: var(--text-primary);
		text-decoration: none;
	}

	.nav-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.nav-link {
		color: var(--text-muted);
		text-decoration: none;
		font-size: 0.75rem;
	}

	@media (hover: hover) and (pointer: fine) {
		.nav-link:hover {
			color: var(--text-secondary);
		}
	}

	.nav-icon {
		color: var(--text-muted);
		display: flex;
		align-items: center;
	}

	.theme-toggle {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	@media (hover: hover) and (pointer: fine) {
		.nav-icon:hover {
			color: var(--text-secondary);
		}
	}

	.main {
		max-width: 480px;
		padding: 0 1.5rem;
	}

	p {
		font-size: 0.9375rem;
		line-height: 1.7;
		color: var(--text-secondary);
		margin: 0 0 1rem 0;
		font-weight: 400;
	}

	a {
		color: var(--text-primary);
		text-decoration: none;
	}

	@media (hover: hover) and (pointer: fine) {
		a:hover {
			text-decoration: underline;
		}
	}

	.social-links {
		display: flex;
		gap: 1.25rem;
		margin-top: 0.5rem;
	}

	.social-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: var(--text-secondary);
		text-decoration: none;
		font-size: 0.875rem;
	}

	.social-link :global(.outbound) {
		opacity: 0;
		transform: translate(-2px, 2px);
		margin-left: -4px;
		transition:
			opacity 0.12s ease,
			transform 0.12s ease;
	}

	@media (hover: hover) and (pointer: fine) {
		.social-link:hover {
			color: var(--text-primary);
		}

		.social-link:hover :global(.outbound) {
			opacity: 1;
			transform: translate(0, 0);
		}
	}
</style>
