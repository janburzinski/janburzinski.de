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
			<img src="/afora-logo.png" alt="afora" class="project-logo" />
			<div class="project-info">
				<div class="project-title-row">
					<a href="https://afora.app" target="_blank" class="entry-title">afora</a>
					<span class="entry-date">2025</span>
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
		<div class="entry-header">
			<span class="entry-title">Technische Universität Berlin</span>
			<span class="entry-date">2024 – Heute</span>
		</div>
		<p class="entry-role">B.Sc. Informatik</p>
	</div>
	<div class="entry">
		<div class="entry-header">
			<span class="entry-title">Private Kant Schulen</span>
			<span class="entry-date">2010 – 2024</span>
		</div>
		<p class="entry-role">Abitur</p>
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
		color: #888;
		margin: 0.25rem 0 0 0;
		font-size: 0.95rem;
	}

	.bio {
		font-size: 1rem;
		line-height: 1.6;
		color: #ccc;
	}

	.section {
		margin-bottom: 3rem;
	}

	.section-title {
		font-size: 0.9rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #888;
		border-bottom: 1px solid #222;
		padding-bottom: 0.5rem;
		margin-bottom: 1.5rem;
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
		font-weight: 500;
		color: #fff;
		text-decoration: none;
	}

	.entry-title:hover {
		text-decoration: underline;
	}

	.entry-date {
		font-size: 0.85rem;
		color: #666;
		font-variant-numeric: tabular-nums;
	}

	.entry-role {
		margin: 0.25rem 0 0 0;
		font-size: 0.9rem;
		color: #888;
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
		width: 36px;
		height: 36px;
		border-radius: 8px;
		object-fit: cover;
		flex-shrink: 0;
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
		margin: 0.5rem 0 0 0;
		font-size: 0.9rem;
		color: #888;
		line-height: 1.5;
	}

	@media (max-width: 480px) {
		.project-header {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
