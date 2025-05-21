<script lang="ts">
	import { writable } from 'svelte/store';
	import { afterNavigate } from '$app/navigation'; // Import afterNavigate

	const isMobileNavOpen = writable(false);

	// Close mobile nav on page change
	afterNavigate(() => {
		isMobileNavOpen.set(false);
	});
</script>

<nav class="navbar">
	<div class="navbar-left">
		<h1><a href="/" class="navbar-title">jan burzinski</a></h1>
	</div>

	<div class="navbar-center">
		<div class="desktop-nav">
			<a href="/">/startseite</a>
			<a href="/resume">/resume</a>
			<a href="/projekte">/projekte</a>
			<a href="/blog">/blog</a>
			<a href="/kontakt">/kontakt</a>
		</div>
	</div>

	<div class="navbar-right">
		<div class="social-icons">
			<a href="https://instagram.com/janderberliner" target="_blank" aria-label="Instagram">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
					<defs>
						<linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
							<stop offset="0%" stop-color="#FFDC80" />
							<stop offset="10%" stop-color="#FCAF45" />
							<stop offset="50%" stop-color="#F77737" />
							<stop offset="75%" stop-color="#C13584" />
							<stop offset="100%" stop-color="#5851DB" />
						</linearGradient>
					</defs>
					<path
						fill="none"
						stroke="url(#instagram-gradient)"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M7.5 2.25h9a5.25 5.25 0 015.25 5.25v9a5.25 5.25 0 01-5.25 5.25h-9a5.25 5.25 0 01-5.25-5.25v-9A5.25 5.25 0 017.5 2.25z"
					/>
					<path
						fill="none"
						stroke="url(#instagram-gradient)"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.125 11.625A4.125 4.125 0 1112 7.5a4.125 4.125 0 014.125 4.125z"
					/>
					<path
						fill="none"
						stroke="url(#instagram-gradient)"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M17.25 6.75h.008v.008h-.008z"
					/>
				</svg>
			</a>
			<a href="https://github.com/janburzinski" target="_blank" aria-label="GitHub">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
					<defs>
						<linearGradient id="github-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stop-color="#9370DB" />
							<stop offset="50%" stop-color="#6f42c1" />
							<stop offset="100%" stop-color="#2188ff" />
						</linearGradient>
					</defs>
					<path
						fill="none"
						stroke="url(#github-gradient)"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75 0 4.31 2.788 7.98 6.652 9.271.487.09.664-.211.664-.47v-1.663c-2.554.555-3.087-1.23-3.087-1.23-.443-1.127-1.082-1.428-1.082-1.428-.885-.605.067-.593.067-.593 1.011.071 1.544 1.04 1.544 1.04.87 1.49 2.28 1.059 2.835.81.089-.631.34-1.06.618-1.304-2.043-.233-4.187-1.022-4.187-4.549 0-1.005.36-1.825.951-2.467-.095-.233-.413-1.17.092-2.438 0 0 .777-.249 2.55.946a8.862 8.862 0 012.321-.312c.788.004 1.582.107 2.321.312 1.772-1.195 2.549-.946 2.549-.946.506 1.268.188 2.205.093 2.438.592.642.951 1.462.951 2.467 0 3.536-2.147 4.312-4.193 4.541.348.3.657.896.657 1.805v2.678c0 .26.177.561.67.467C18.96 20.004 21.75 16.34 21.75 12c0-5.385-4.365-9.75-9.75-9.75z"
					/>
				</svg>
			</a>
			<a href="https://x.com/janburzinski" target="_blank" aria-label="GitHub">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
					<defs>
						<linearGradient id="x-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stop-color="#FFFFFF" />
							<stop offset="50%" stop-color="#D3D3D3" />
							<stop offset="100%" stop-color="#AAAAAA" />
						</linearGradient>
					</defs>
					<path
						fill="none"
						stroke="url(#x-gradient)"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
					/>
				</svg>
			</a>
		</div>
		<button
			class="mobile-nav-toggle"
			on:click={() => ($isMobileNavOpen = !$isMobileNavOpen)}
			aria-label="Toggle Navigation"
		>
			<span class="hamburger"></span>
		</button>
	</div>
</nav>

<div class="mobile-nav" class:is-open={$isMobileNavOpen}>
	<div class="mobile-nav-links">
		<a href="/">/startseite</a>
		<a href="/resume">/resume</a>
		<a href="/projekte">/projekte</a>
		<a href="/blog">/blog</a>
		<a href="/kontakt">/kontakt</a>
	</div>
</div>

<style>
	.navbar {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		padding: 1rem 2rem;
		color: #f4f4f4;
		position: relative;
		z-index: 1000;
	}

	.navbar-left {
		justify-self: start;
	}

	.navbar-center {
		justify-self: center;
	}

	.navbar-right {
		justify-self: end;
		display: flex;
		align-items: center;
		gap: 2rem;
	}

	.desktop-nav {
		display: flex;
		gap: 2rem;
	}

	.desktop-nav a {
		color: #c0c0c0;
		text-decoration: none;
		font-size: 1.2rem;
		transition: all 0.3s ease;
		position: relative;
	}

	.desktop-nav a:hover {
		color: #ffffff;
		transform: translateX(-5px);
	}

	.desktop-nav a::after {
		content: '';
		position: absolute;
		bottom: -4px;
		left: 0;
		width: 0;
		height: 2px;
		background: linear-gradient(to right, #60d394, #3fa7d6, #e07a5f);
		transition: width 0.3s ease;
	}

	.desktop-nav a:hover::after {
		width: 100%;
	}

	.navbar-title {
		text-decoration: none;
		color: #fff;
		font-size: 1.5rem;
		padding-bottom: 5px;
		background-image: linear-gradient(to right, currentColor 2px, transparent 2px);
		background-position: left bottom;
		background-repeat: repeat-x;
		background-size: 8px 2px;
	}

	.social-icons {
		display: flex;
		gap: 1rem;
	}

	.social-icons a {
		display: inline-block;
		padding: 8px;
		text-decoration: none;
		color: #f4f4f4;
		transition: color 0.3s ease;
	}

	.social-icons a svg {
		width: 26px;
		height: 26px;
		stroke: #f4f4f4;
		pointer-events: none;
	}

	.mobile-nav-toggle {
		display: none;
	}

	.mobile-nav {
		display: none;
	}

	@media (max-width: 768px) {
		.navbar {
			grid-template-columns: auto auto;
		}

		.navbar-center {
			display: none;
		}

		.desktop-nav {
			display: none;
		}

		.mobile-nav-toggle {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 30px;
			height: 30px;
			background: transparent;
			border: 2px solid #fff;
			border-radius: 8px;
			cursor: pointer;
			padding: 3px;
		}

		.hamburger {
			position: relative;
			width: 15px;
			height: 2px;
			background: #fff;
			transition: all 0.3s ease;
		}

		.hamburger::before,
		.hamburger::after {
			content: '';
			position: absolute;
			width: 10px;
			height: 2px;
			background: #fff;
			transition: all 0.3s ease;
		}

		.hamburger::before {
			top: -6px;
		}

		.hamburger::after {
			bottom: -6px;
		}

		.mobile-nav {
			display: block;
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100vh;
			background: rgba(18, 18, 18, 0.98);
			transform: translateX(100%);
			transition: transform 0.3s ease;
			z-index: 999;
		}

		.mobile-nav.is-open {
			transform: translateX(0);
		}

		.mobile-nav-links {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100%;
			gap: 2rem;
		}

		.mobile-nav-links a {
			color: #f4f4f4;
			text-decoration: none;
			font-size: 1.5rem;
			transition: all 0.3s ease;
		}

		.mobile-nav-links a:hover {
			color: #60d394;
		}
	}
</style>
