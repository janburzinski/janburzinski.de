<svelte:head>
	<title>jan burzinski</title>
</svelte:head>

<section class="hero">
	<div class="header">
		<h1>Jan Burzinski</h1>
		<p class="subtitle">B.Sc. Informatik Student @ TU Berlin</p>
	</div>

	<div class="bio">
		<p>
			Informatikstudent im 3. Semester, 21 Jahre alt, mit einer Leidenschaft für
			Softwareentwicklung, geweckt durch Minecraft. Ich liebe es, Dinge zu bauen.
		</p>
	</div>
</section>

<section class="section">
	<h2 class="section-title">Erfahrung</h2>
	<div class="entry">
		<div class="entry-header">
			<a href="https://bejaniclabs.de" target="_blank" class="entry-title"
				>Burzinski & Jaenisch GbR</a
			>
			<span class="entry-date">2025 – Heute</span>
		</div>
		<p class="entry-role">Software Engineer | Founder</p>
	</div>
</section>

<section class="section">
	<h2 class="section-title">Projekte</h2>
	<div class="project">
		<div class="project-header">
			<img src="/crisprlogo.svg" alt="CrisprClear" class="project-logo project-logo--crisp" />
			<div class="project-info">
				<div class="project-title-row">
					<a href="https://crisprclear.com" target="_blank" class="entry-title">CrisprClear</a>
					<span class="entry-date">2026</span>
				</div>
				<p class="project-description">
					KI-gestützte Sprachtranskription für Desktop. Diktiere statt zu tippen, offline, in über
					100 Sprachen, ohne dass deine Daten dein Gerät verlassen.
				</p>
			</div>
		</div>
	</div>
	<div class="project">
		<div class="project-header">
			<img src="/logosamtly.svg" alt="samtly" class="project-logo" />
			<div class="project-info">
				<div class="project-title-row">
					<a href="https://samtly.app" target="_blank" class="entry-title">samtly</a>
					<span class="entry-date">2025</span>
				</div>
				<p class="project-description">
					KI-Hautpflege-App mit personalisierter Hautanalyse. Tracke Schlaf, Stress und Ernährung, um
					Trigger für Unreinheiten zu erkennen und individuelle Routinen zu erhalten.
				</p>
			</div>
		</div>
	</div>
	<div class="project">
		<div class="project-header">
			<img src="/afora-logo.png" alt="afora" class="project-logo" />
			<div class="project-info">
				<div class="project-title-row">
					<a href="https://afora.app" target="_blank" class="entry-title">afora</a>
					<span class="entry-date">2026</span>
				</div>
				<p class="project-description">
					AI-Powered Mood Journal & Mental Health Tracker für iOS. Ein minimalistischer Tracker mit
					KI-gestützten Erkenntnissen, die deine Muster lernen und verstehen.
				</p>
			</div>
		</div>
	</div>
</section>

<section class="section">
	<h2 class="section-title">Bildung</h2>
	<div class="entry">
		<div class="entry-with-logo">
			<img src="/tu_berlin_logo.png" alt="TU Berlin" class="entry-logo" />
			<div>
				<div class="entry-header">
					<span class="entry-title">Technische Universität Berlin</span>
					<span class="entry-date">2024 – Heute</span>
				</div>
				<p class="entry-role">B.Sc. Informatik</p>
			</div>
		</div>
	</div>
	<div class="entry">
		<div class="entry-with-logo">
			<img src="/private_kant_schule.png" alt="Private Kant Schulen" class="entry-logo" />
			<div>
				<div class="entry-header">
					<span class="entry-title">Private Kant Schulen</span>
					<span class="entry-date">2010 – 2024</span>
				</div>
				<p class="entry-role">Abitur</p>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		margin-bottom: 4rem;
	}

	.header {
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
		letter-spacing: -0.02em;
	}

	.subtitle {
		font-family: var(--font-geist-mono);
		color: var(--text-secondary);
		margin: 0.25rem 0 0 0;
		font-size: 0.9rem;
		transition: color 0.3s ease;
	}

	.bio {
		font-size: 1rem;
		line-height: 1.6;
		color: var(--text-secondary);
		transition: color 0.3s ease;
	}

	.section {
		margin-bottom: 3rem;
	}

	.section-title {
		font-family: var(--font-geist-pixel-square);
		font-size: 0.85rem;
		font-weight: 400;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-secondary);
		border-bottom: 1px solid var(--border-color);
		padding-bottom: 0.5rem;
		margin-bottom: 1.5rem;
		transition:
			color 0.3s ease,
			border-color 0.3s ease;
	}

	.entry {
		margin-bottom: 1.5rem;
	}

	.entry-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.entry-title {
		font-family: var(--font-geist-pixel-square);
		font-weight: 400;
		color: var(--text-primary);
		text-decoration: none;
		letter-spacing: 0.02em;
		transition: color 0.3s ease;
	}

	.entry-title:hover {
		text-decoration: underline;
	}

	.entry-date {
		font-family: var(--font-geist-mono);
		font-size: 0.8rem;
		color: var(--text-secondary);
		font-variant-numeric: tabular-nums;
		transition: color 0.3s ease;
	}

	.entry-role {
		font-family: var(--font-geist-mono);
		margin: 0.25rem 0 0 0;
		font-size: 0.85rem;
		color: var(--text-secondary);
		transition: color 0.3s ease;
	}

	.entry-with-logo {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.entry-with-logo > div {
		flex: 1;
	}

	.entry-logo {
		width: 44px;
		height: 44px;
		border-radius: 8px;
		object-fit: cover;
		flex-shrink: 0;
	}

	.project {
		margin-bottom: 1.5rem;
	}

	.project-header {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.project-logo {
		width: 44px;
		height: 44px;
		border-radius: 8px;
		object-fit: cover;
		flex-shrink: 0;
	}

	.project-logo--crisp {
		background: white;
		padding: 4px;
		object-fit: contain;
	}

	.project-info {
		flex: 1;
	}

	.project-title-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.project-description {
		font-family: var(--font-geist-mono);
		margin: 0.5rem 0 0 0;
		font-size: 0.85rem;
		color: var(--text-secondary);
		line-height: 1.5;
		transition: color 0.3s ease;
	}

	@media (max-width: 480px) {
		.project-header {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
