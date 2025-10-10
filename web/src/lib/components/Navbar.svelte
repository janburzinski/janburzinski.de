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
	let titleEl: HTMLAnchorElement | undefined;

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

	// Close mobile nav on page change
	afterNavigate(() => {
		isMobileNavOpen.set(false);
	});
</script>

<!-- <nav class="navbar">
	<div class="navbar-left">
        <h1 class="title-wrap">
            <a href="/" class="navbar-title" bind:this={titleEl} on:contextmenu|preventDefault={openContextMenu}>jan burzinski</a>
        </h1>
    </div>

	<div class="navbar-right">
		<div class="desktop-nav">
            <a href={homeUrl}>/startseite</a>
            <a href={resumeUrl}>/resume</a>
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
	</div>
</div> -->

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
		grid-template-columns: auto 1fr;
		align-items: center;
		padding: 0.75rem 2rem;
		color: #f4f4f4;
		position: relative;
		z-index: 1000;
		max-width: 820px;
		margin: 0 auto;
	}

	.navbar-left {
		justify-self: start;
	}

.title-wrap {
    position: relative;
    display: inline-block;
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
