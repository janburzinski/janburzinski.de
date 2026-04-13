<script lang="ts">
	import { Github, Mail, Sun, Moon } from 'lucide-svelte';
	import { onMount } from 'svelte';

	type Theme = 'light' | 'dark' | 'system';
	let theme: Theme = 'system';

	onMount(() => {
		const saved = localStorage.getItem('theme') as Theme | null;
		if (saved && ['light', 'dark', 'system'].includes(saved)) {
			theme = saved;
		}
	});

	function toggleTheme() {
		const root = document.documentElement;
		const isDark = root.classList.contains('dark');
		const newTheme: Theme = isDark ? 'light' : 'dark';
		theme = newTheme;
		localStorage.setItem('theme', newTheme);
		root.classList.toggle('dark', newTheme === 'dark');
		root.classList.toggle('light', newTheme === 'light');
	}
</script>

<svelte:head>
	<title>jan burzinski</title>
</svelte:head>

<div class="page">
	<div class="main">
		<h1 class="blur-in delay-1 shimmer">Jan Burzinski</h1>

		<p class="blur-in delay-1">
			Ich baue Software bei <a href="https://bejaniclabs.de" target="_blank" rel="noopener noreferrer">Burzinski & Jaenisch GbR</a>.
		</p>

		<p class="blur-in delay-2">
			Informatikstudent im 4. Semester an der <a href="https://tu.berlin" target="_blank" rel="noopener noreferrer">TU Berlin</a>, 21 Jahre alt. Meine Leidenschaft für Software wurde durch Minecraft geweckt. Seitdem baue ich Dinge.
		</p>

		<p class="blur-in delay-2">
			Aktuell arbeite ich an <a href="https://klarvoice.com" target="_blank" rel="noopener noreferrer">klarvoice</a>. Davor habe ich <a href="https://usedatix.com" target="_blank" rel="noopener noreferrer">Datix</a>, <a href="https://samtly.app" target="_blank" rel="noopener noreferrer">samtly</a> und <a href="https://afora.app" target="_blank" rel="noopener noreferrer">afora</a> gebaut.
		</p>

		<div class="social-links blur-in delay-3">
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

	<div class="bottom blur-in delay-4">
		<div class="bottom-links">
			<a href="https://github.com/janburzinski" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
				<Github size={16} />
			</a>
			<button class="theme-toggle" on:click={toggleTheme} aria-label="Theme wechseln" type="button">
				{#if theme === 'light'}
					<Sun size={16} />
				{:else}
					<Moon size={16} />
				{/if}
			</button>
		</div>
		<div class="legal-links">
			<a href="/impressum">Impressum</a>
			<a href="/datenschutz">Datenschutz</a>
		</div>
	</div>
</div>

<style>
	.page {
		max-width: 480px;
		width: 100%;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.main {
		padding-top: 20vh;
	}

	h1 {
		font-size: 1.125rem;
		font-weight: 500;
		margin: 0 0 1.75rem 0;
		letter-spacing: -0.01em;
		color: var(--text-primary);
	}

	.shimmer {
		--spread: 40px;
		display: inline-block;
		background:
			linear-gradient(
				90deg,
				transparent calc(50% - var(--spread)),
				var(--text-primary) 50%,
				transparent calc(50% + var(--spread))
			) 100% center / 250% 100% no-repeat,
			linear-gradient(var(--text-muted), var(--text-muted));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		animation: shimmer 1.8s linear infinite;
	}

	@keyframes shimmer {
		from { background-position: 100% center; }
		to { background-position: 0% center; }
	}

	p {
		font-size: 0.9375rem;
		line-height: 1.7;
		color: var(--text-secondary);
		margin: 0 0 1rem 0;
		font-weight: 400;
	}

	p a {
		color: var(--text-primary);
		text-decoration: none;
		transition: opacity 0.15s ease;
	}

	@media (hover: hover) and (pointer: fine) {
		p a:hover {
			opacity: 0.5;
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
		transition: color 0.15s ease;
	}

	@media (hover: hover) and (pointer: fine) {
		.social-link:hover {
			color: var(--text-primary);
		}
	}

	.bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 2rem;
		padding-top: 4rem;
	}

	.bottom-links {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.bottom-links a {
		color: var(--text-muted);
		transition: color 0.15s ease;
		display: flex;
	}

	@media (hover: hover) and (pointer: fine) {
		.bottom-links a:hover {
			color: var(--text-secondary);
		}
	}

	.theme-toggle {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		color: var(--text-muted);
		display: flex;
		align-items: center;
		transition: color 0.15s ease;
	}

	@media (hover: hover) and (pointer: fine) {
		.theme-toggle:hover {
			color: var(--text-secondary);
		}
	}

	.legal-links {
		display: flex;
		gap: 1rem;
	}

	.legal-links a {
		color: var(--text-muted);
		text-decoration: none;
		font-size: 0.75rem;
		transition: color 0.15s ease;
	}

	@media (hover: hover) and (pointer: fine) {
		.legal-links a:hover {
			color: var(--text-secondary);
		}
	}

	@media (max-width: 480px) {
		.main {
			padding-top: 15vh;
		}
	}
</style>
