<script lang="ts">
	import { page } from '$app/stores';
	import ThemeSwitcher from './ThemeSwitcher.svelte';
</script>

<nav class="navbar">
	<div class="container">
		<a href="/" class="logo" class:active={$page.url.pathname === '/'}> jan burzinski </a>
		<div class="links">
			<a href="https://github.com/janburzinski" target="_blank" rel="noopener noreferrer">
				github
			</a>
			<ThemeSwitcher />
		</div>
	</div>
</nav>

<style>
	.navbar {
		position: sticky;
		top: 0;
		background: var(--dropdown-bg);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--border-color);
		z-index: 100;
		transition:
			background-color 0.3s ease,
			border-color 0.3s ease;
	}

	.container {
		max-width: 700px;
		margin: 0 auto;
		padding: 0 1rem;
		height: 64px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		font-family: var(--font-geist-pixel-square);
		font-weight: 400;
		text-decoration: none;
		color: var(--text-primary);
		font-size: 0.95rem;
		letter-spacing: 0.02em;
		transition: color 0.2s var(--ease-out);
	}

	.links {
		display: flex;
		gap: 1.5rem;
		align-items: center;
	}

	.links a {
		font-family: var(--font-geist-mono);
		text-decoration: none;
		color: var(--link-color);
		font-size: 0.85rem;
		transition: color 0.2s var(--ease-out);
	}

	@media (hover: hover) and (pointer: fine) {
		.links a:hover,
		.links a.active {
			color: var(--link-hover);
		}
	}

	.links a:active {
		opacity: 0.7;
	}

	@media (max-width: 480px) {
		.container {
			height: 56px;
		}
	}
</style>
