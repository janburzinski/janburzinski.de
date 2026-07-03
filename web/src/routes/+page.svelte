<script lang="ts">
	import { Github, Mail, Sun, Moon } from 'lucide-svelte';
	import { onMount } from 'svelte';

	type Theme = 'light' | 'dark';
	let theme: Theme = 'dark';

	onMount(() => {
		const isDark = document.documentElement.classList.contains('dark');
		theme = isDark ? 'dark' : 'light';
	});

	function toggleTheme() {
		const root = document.documentElement;
		theme = theme === 'dark' ? 'light' : 'dark';
		localStorage.setItem('theme', theme);
		root.classList.toggle('dark', theme === 'dark');
		root.classList.toggle('light', theme === 'light');
	}
</script>

<svelte:head>
	<title>jan burzinski</title>
</svelte:head>

<div class="page">
	<nav class="topbar">
		<a href="/" class="name">Jan Burzinski</a>
		<div class="nav-right">
			<a href="/impressum" class="nav-link">Impressum</a>
			<a href="/datenschutz" class="nav-link">Datenschutz</a>
			<a href="https://github.com/janburzinski" target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="nav-icon">
				<Github size={16} />
			</a>
			<button class="nav-icon theme-toggle" on:click={toggleTheme} aria-label="Theme wechseln" type="button">
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
			Ich baue Software bei <a href="https://bejaniclabs.de" target="_blank" rel="noopener noreferrer">Burzinski & Jaenisch GbR</a>.
		</p>

		<p>
			Informatikstudent im 4. Semester an der <a href="https://tu.berlin" target="_blank" rel="noopener noreferrer">TU Berlin</a>, 21 Jahre alt. Meine Leidenschaft für Software wurde durch Minecraft geweckt. Seitdem baue ich Dinge.
		</p>

		<p>
			Aktuell arbeite ich an <a href="https://klarvoice.com" target="_blank" rel="noopener noreferrer">klarvoice</a>. Davor habe ich <a href="https://usedatix.com" target="_blank" rel="noopener noreferrer">Datix</a>, <a href="https://samtly.app" target="_blank" rel="noopener noreferrer">samtly</a> und <a href="https://afora.app" target="_blank" rel="noopener noreferrer">afora</a> gebaut.
		</p>

		<div class="social-links">
			<a href="https://github.com/janburzinski" target="_blank" rel="noopener noreferrer" class="social-link">
				<Github size={16} />
				<span>GitHub</span>
			</a>
			<a href="mailto:jan@burzinski.de" class="social-link">
				<Mail size={16} />
				<span>Mail</span>
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
		padding: 1.5rem 1.5rem 2.5rem 1.5rem;
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

	@media (hover: hover) and (pointer: fine) {
		.social-link:hover {
			color: var(--text-primary);
		}
	}
</style>
