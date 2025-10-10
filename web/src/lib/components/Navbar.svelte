<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { resolveRoute } from '$app/paths';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	const isMobileNavOpen = writable(false);

	// Right-click context menu for title
	let isContextMenuOpen = false;
	let menuX = 0;
	let menuY = 0;
	let titleEl: HTMLAnchorElement;

	function openContextMenu(event: MouseEvent) {
		event.preventDefault();
		// Toggle if already open
		if (isContextMenuOpen) {
			closeContextMenu();
			return;
		}
		const rect = titleEl?.getBoundingClientRect();
		const menuWidth = 220;
		const menuHeight = 140;
		const vw = window.innerWidth;
		const baseX = rect ? rect.left : event.clientX;
		const baseY = rect ? rect.bottom + 6 : event.clientY;
		menuX = Math.max(8, Math.min(baseX, vw - menuWidth - 8));
		menuY = Math.max(8, Math.min(baseY, window.innerHeight - menuHeight - 8));
		isContextMenuOpen = true;
	}

	function closeContextMenu() {
		isContextMenuOpen = false;
	}

	onMount(() => {
		function onGlobalClick() {
			if (isContextMenuOpen) closeContextMenu();
		}
		function onEsc(e: KeyboardEvent) {
			if (e.key === 'Escape') closeContextMenu();
		}
		window.addEventListener('click', onGlobalClick);
		window.addEventListener('keydown', onEsc);
		window.addEventListener('scroll', onGlobalClick, { passive: true });
		return () => {
			window.removeEventListener('click', onGlobalClick);
			window.removeEventListener('keydown', onEsc);
			window.removeEventListener('scroll', onGlobalClick);
		};
	});

	// Resolve internal routes
    const homeUrl = resolveRoute('/');
    const resumeUrl = '#resume';
    const projekteUrl = null;
    const kontaktUrl = 'mailto:j_burzinski@proton.me';

	// Close mobile nav on page change
	afterNavigate(() => {
		isMobileNavOpen.set(false);
	});
</script>

<nav class="navbar">
    <div class="navbar-left">
        <h1 class="title-wrap">
            <a href="/" class="navbar-title" bind:this={titleEl} on:contextmenu|preventDefault={openContextMenu}>jan burzinski</a>
        </h1>
    </div>

	<div class="navbar-center">
		<div class="desktop-nav">
            <a href={homeUrl}>/startseite</a>
            <a href={resumeUrl}>/resume</a>
            
            <a href={kontaktUrl}>/kontakt</a>
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
        <a href={homeUrl}>/startseite</a>
        <a href={resumeUrl}>/resume</a>
        
        <a href={kontaktUrl}>/kontakt</a>
	</div>
</div>

{#if isContextMenuOpen}
    <div class="ctx-menu" style={`top:${menuY}px;left:${menuX}px`} role="menu" aria-label="Links">
        <div class="ctx-group-label">Links</div>
        <a class="ctx-item" href="https://instagram.com/janderberliner" target="_blank" rel="noopener noreferrer" role="menuitem">
            <span class="ctx-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="1.6"/>
                    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                </svg>
            </span>
            instagram
        </a>
        <a class="ctx-item" href="https://github.com/janburzinski" target="_blank" rel="noopener noreferrer" role="menuitem">
            <span class="ctx-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="M12 2.25c-5.38 0-9.75 4.37-9.75 9.75 0 4.31 2.79 7.98 6.65 9.27.49.09.65-.21.65-.47v-1.66c-2.55.55-3.08-1.23-3.08-1.23-.44-1.12-1.08-1.43-1.08-1.43-.88-.6.07-.59.07-.59 1.01.07 1.54 1.04 1.54 1.04.87 1.49 2.28 1.06 2.83.81.09-.63.34-1.06.62-1.3-2.04-.24-4.19-1.03-4.19-4.55 0-1.01.36-1.83.95-2.47-.1-.23-.41-1.17.09-2.44 0 0 .78-.25 2.55.95.74-.21 1.53-.32 2.31-.31.78-.01 1.57.1 2.31.31 1.77-1.2 2.55-.95 2.55-.95.5 1.27.18 2.21.09 2.44.59.64.95 1.46.95 2.47 0 3.53-2.15 4.31-4.19 4.55.36.3.66.9.66 1.81v2.68c0 .26.18.56.67.47 3.86-1.29 6.65-4.96 6.65-9.27 0-5.38-4.37-9.75-9.75-9.75Z"/>
                </svg>
            </span>
            github
        </a>
        <div class="ctx-sep"></div>
        <div class="ctx-group-label">Kontakt</div>
        <a class="ctx-btn" href="mailto:j_burzinski@proton.me" role="menuitem">E‑Mail senden</a>
    </div>
{/if}

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

.title-wrap {
    position: relative;
    display: inline-block;
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
		color: #999;
		text-decoration: none;
		font-size: 1.2rem;
		transition: color 0.2s ease;
	}

	.desktop-nav a:hover {
		color: #fff;
	}

	.navbar-title {
		text-decoration: none;
		color: #fff;
		font-size: 1.5rem;
		transition: color 0.2s ease;
	}

	.navbar-title:hover {
		color: #e0e0e0;
	}

/* Context menu */
.ctx-menu {
    position: fixed;
    width: 220px;
    background: rgba(22, 27, 34, 0.98);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 8px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.35);
    z-index: 2000;
    animation: fadeInMenu 180ms ease forwards;
}

.ctx-group-label {
    color: #9aa0a6;
    font-size: 0.8rem;
    padding: 6px 8px 8px 8px;
}

.ctx-item {
    display: block;
    color: #e6edf3;
    text-decoration: none;
    padding: 10px 8px;
    border-radius: 8px;
    transition: background-color 0.15s ease;
}

.ctx-item:hover { background: rgba(255,255,255,0.06); }

.ctx-item { display: flex; align-items: center; gap: 8px; }
.ctx-icon { width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center; }

.ctx-sep {
    height: 1px;
    background: rgba(255,255,255,0.08);
    margin: 6px 4px;
}

.ctx-btn {
    display: block;
    text-align: center;
    padding: 10px 8px;
    border-radius: 8px;
    color: #e6edf3;
    text-decoration: none;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    transition: background-color 0.15s ease, border-color 0.15s ease;
}

.ctx-btn:hover {
    background: rgba(255,255,255,0.12);
    border-color: rgba(255,255,255,0.2);
}

@keyframes fadeInMenu {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
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

	/* Ensure anchored headings don't get hidden under navbar */
	:target {
		scroll-margin-top: 120px;
	}
</style>
