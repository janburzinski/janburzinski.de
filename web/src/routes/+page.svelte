<script lang="ts">
    import { onMount } from 'svelte';
    const contactEmail = 'j_burzinski@proton.me';

    // Live age counter (years with many decimals)
    const birthDate = new Date('2004-10-11T00:00:00Z');
    const msPerYear = 365.2425 * 24 * 60 * 60 * 1000; // Gregorian average year
    let ageYearsFormatted = '';
    let _raf = 0;

    function tick() {
        const now = Date.now();
        const years = (now - birthDate.getTime()) / msPerYear;
        ageYearsFormatted = years.toFixed(12);
        _raf = requestAnimationFrame(tick);
    }

    // Context menu for title (right-click on desktop, click on mobile)
    let isContextMenuOpen = false;
    let titleEl: HTMLButtonElement;
    let isMobile = false;

    function handleTitleInteraction(event: MouseEvent) {
        event.preventDefault();
        
        // Check if it's a right-click (desktop) or left-click (mobile)
        if (event.button === 2 || event.type === 'contextmenu') {
            // Right-click on desktop
            isContextMenuOpen = !isContextMenuOpen;
        } else if (event.button === 0 && isMobile) {
            // Left-click on mobile
            isContextMenuOpen = !isContextMenuOpen;
        }
    }

    function handleKeyboardInteraction(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            isContextMenuOpen = !isContextMenuOpen;
        }
    }

    function openContextMenu(event: MouseEvent) {
        event.preventDefault();
        isContextMenuOpen = !isContextMenuOpen;
    }

    function closeContextMenu() {
        isContextMenuOpen = false;
    }

    onMount(() => {
        _raf = requestAnimationFrame(tick);
        
        // Detect if device is mobile
        isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
        
        return () => cancelAnimationFrame(_raf);
    });

    // Close on escape key or scroll
    onMount(() => {
        function handleKeydown(e: KeyboardEvent) {
            if (e.key === 'Escape') closeContextMenu();
        }
        function handleScroll() {
            closeContextMenu();
        }
        
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('scroll', handleScroll);
        };
    });

    // Click outside directive
    function clickOutside(node: HTMLElement) {
        function handleClick(event: MouseEvent) {
            if (!node.contains(event.target as Node)) {
                closeContextMenu();
            }
        }
        
        document.addEventListener('click', handleClick);
        
        return {
            destroy() {
                document.removeEventListener('click', handleClick);
            }
        };
    }
</script>

<svelte:head>
    <title>jan burzinski</title>
    <meta
        name="description"
        content="Jan Burzinski - B.Sc. Informatik Student an der TU Berlin. Leidenschaftlicher Entwickler mit Expertise in Java, Python, JavaScript, TypeScript, C und Go."
    />
</svelte:head>

<section id="hero" class="hero">
    <div class="hero-grid">
        <div class="hero-left">
            <img class="profile-picture" src="/janbewerbungsbild.jpg" alt="Jan Burzinski" />
        </div>
        <div class="hero-right">
            <div class="title-container" style="position: relative; display: inline-block;">
                <button class="title-name" bind:this={titleEl} on:contextmenu|preventDefault={openContextMenu} on:click|preventDefault={handleTitleInteraction} aria-label="Toggle context menu">Jan Burzinski</button>
                {#if isContextMenuOpen}
                    <div class="ctx-menu" role="menu" aria-label="Links" tabindex="-1" use:clickOutside>
                        <div class="ctx-group-label">Links</div>
                        <a class="ctx-item" href="https://instagram.com/janderberliner" target="_blank" rel="noopener noreferrer" role="menuitem">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                            Instagram
                        </a>
                        <a class="ctx-item" href="https://github.com/janburzinski" target="_blank" rel="noopener noreferrer" role="menuitem">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                            </svg>
                            GitHub
                        </a>
                        <div class="ctx-separator"></div>
                        <div class="ctx-group-label">Kontakt</div>
                        <a class="ctx-btn" href="mailto:j_burzinski@proton.me" role="menuitem">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            E‑Mail senden
                        </a>
                    </div>
                {/if}
            </div>
            <p class="title-under">B.Sc. Informatik Student an der TU-Berlin</p>
            <ul class="hero-bullets">
				<li><span class="mono">{ageYearsFormatted}</span> jahre alt</li>
				<li>3 Semester Informatik</li>
                <li>interesse am programmieren durch minecraft</li>
                <li>ich liebe programmieren</li>
            </ul>
            
        </div>
    </div>

</section>



<section id="resume" class="section">
    <div class="resume-group">
        <h3 class="resume-heading">projekte</h3>
        <ul class="resume-list">
            <li class="resume-item">
				<div class="resume-left">
					<img src="/bj_favicon.svg" alt="Bejanic" class="resume-logo" />
					<div class="resume-meta">
						<div class="resume-title">Burzinski & Jaenisch GbR</div>
						<div class="resume-subtitle">software engineer | founder</div>
					</div>
				</div>
				<div class="resume-right">2025 – aktuell</div>
            </li>
        </ul>
    </div>

    <div class="resume-group">
        <h3 class="resume-heading">education</h3>
        <ul class="resume-list">
            <li class="resume-item">
				<div class="resume-left">
					<img src="/tu_berlin_logo.png" alt="TU Berlin" class="resume-logo" />
					<div class="resume-meta">
						<div class="resume-title">Technische Universität Berlin</div>
						<div class="resume-subtitle">B.Sc. Informatik (studierend)</div>
					</div>
				</div>
				<div class="resume-right">2025 – aktuell</div>
            </li>
            <li class="resume-item">
				<div class="resume-left">
					<img src="/private_kant_schule.png" alt="Private Kant Schulen" class="resume-logo" />
					<div class="resume-meta">
						<div class="resume-title">Private Kant Schulen / Internationale Schule Berlin</div>
						<div class="resume-subtitle">Schule</div>
					</div>
				</div>
				<div class="resume-right">2010 – 2024</div>
            </li>
        </ul>
    </div>
</section>


<style>
	.hero {
		margin-top: -5vh;
	}

	.hero-grid {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: 2rem;
		align-items: center;
		max-width: 820px;
		margin: 0 auto;
		padding: 1rem;
	}

	.hero-left {
		display: flex;
		justify-content: center;
	}

	.hero-right {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.profile-picture {
		width: 100%;
		max-width: 240px;
		height: auto;
		border-radius: 15%;
		box-shadow:
			0px 0px 3px 0px rgba(94, 230, 161, 0.2),
			0px 0px 6px 0px rgba(58, 167, 241, 0.2),
			0px 0px 8px 2px rgba(153, 153, 164, 0.2),
			0px 0px 10px 2px rgba(230, 138, 117, 0.2);
		animation: slideFromTop 1s ease-out forwards;
		object-fit: contain;
	}

	@keyframes slideFromTop {
		0% {
			transform: translateY(-30px);
			opacity: 20%;
		}
		100% {
			transform: translateY(0);
			opacity: 100%;
		}
	}

	.title-name {
		letter-spacing: 2px;
		font-weight: bold;
		font-size: 52px;
		margin-bottom: 0.5rem;
		text-align: left;
		animation: slideFromBottom 1s ease-out forwards;
		cursor: pointer;
		transition: opacity 0.2s ease;
		background: none;
		border: none;
		color: #ffffff;
		padding: 0;
		font-family: inherit;
	}

	.title-name:hover {
		opacity: 0.8;
	}

	.title-name:focus {
		outline: 2px solid #58a6ff;
		outline-offset: 4px;
		border-radius: 4px;
	}





	.title-under {
		font-size: 25px;
		color: #bbbbbb;
		margin: 0;
		animation: slideFromBottom 1s ease-out forwards;
		text-align: left;
	}

	@keyframes slideFromBottom {
		0% {
			transform: translateY(20px);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}







	.hero-bullets {
		list-style: disc;
		padding-left: 1.25rem;
		color: #c9d1d9;
	}



	.section {
		max-width: 820px;
		margin: 6rem auto 0 auto;
		padding: 0 1rem;
	}



	.mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
	}



	/* Resume */
	.resume-group {
		margin-top: 2rem;
	}

	.resume-heading {
		font-size: 1.2rem;
		margin: 0 0 1rem 0;
		color: #ffffff;
	}

	.resume-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.resume-item {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		padding: 0.75rem 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.resume-item:last-child {
		border-bottom: none;
	}

	.resume-left {
		display: grid;
		grid-template-columns: 44px 1fr;
		gap: 0.75rem;
		align-items: center;
	}

	.resume-logo {
		width: 44px;
		height: 44px;
		border-radius: 1rem; /* rounded-2xl */
		object-fit: cover;
		background: #222;
	}

	.resume-meta {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.resume-title {
		font-size: 1rem;
		color: #ffffff;
	}

	.resume-subtitle {
		font-size: 0.95rem;
		color: #7d8590;
	}

	.resume-right {
		color: #7d8590;
		font-size: 0.95rem;
		text-align: right;
		white-space: nowrap;
	}

	@media (max-width: 768px) {
		.resume-item {
			grid-template-columns: 1fr;
			gap: 0.25rem;
		}

		.resume-right {
			text-align: left;
		}
	}







	@media (max-width: 768px) {
		.hero {
			margin-top: -15vh;
		}
		.hero-grid {
			grid-template-columns: 1fr;
		}
		.title-name {
			font-size: 40px;
		}
	}

	/* Desktop compaction */
	@media (min-width: 769px) {
		.hero-grid { gap: 1.25rem; }
		.hero-right { gap: 0.75rem; }
		.section { margin-top: 4.5rem; }

		.resume-list { gap: 0.5rem; }
		.resume-item { padding: 0.5rem 0; }
		.resume-left { grid-template-columns: 40px 1fr; gap: 0.5rem; }
		.resume-logo { width: 40px; height: 40px; }

	}

	/* Right-click context menu styles */
	.ctx-menu {
		position: absolute;
		top: 100%;
		left: 0;
		margin-top: 8px;
		z-index: 9999;
		background: #0d1117;
		border: 1px solid #30363d;
		border-radius: 8px;
		padding: 8px 0;
		min-width: 220px;
		box-shadow: 0 16px 32px rgba(0, 0, 0, 0.5);
		animation: fadeInMenu 150ms ease-out;
		overflow: hidden;
	}

	.ctx-group-label {
		color: #7d8590;
		font-size: 0.875rem;
		font-weight: 600;
		padding: 8px 12px 4px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.ctx-item, .ctx-btn {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 8px 12px;
		color: #f0f6fc;
		text-decoration: none;
		font-size: 0.875rem;
		transition: background-color 0.15s ease;
		border: none;
		background: none;
		width: 100%;
		cursor: pointer;
		margin: 0;
	}

	.ctx-item:hover, .ctx-btn:hover {
		background-color: #21262d;
	}

	.ctx-separator {
		height: 1px;
		background-color: #30363d;
		margin: 4px 0;
	}

	@keyframes fadeInMenu {
		from { opacity: 0; transform: translateY(-4px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
