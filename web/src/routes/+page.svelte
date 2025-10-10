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

    onMount(() => {
        _raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(_raf);
    });
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
            <h1 class="title-name">Jan Burzinski</h1>
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
		max-width: 1100px;
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
		max-width: 280px;
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
		font-size: 60px;
		margin-bottom: 0.5rem;
		text-align: left;
		animation: slideFromBottom 1s ease-out forwards;
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
		max-width: 1100px;
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
</style>
