<script lang="ts">
	interface Project {
		title: string;
		description: string;
		link?: string;
		imageUrl?: string;
	}

	const projects: Project[] = [
		{
			title: 'Persönliche Website',
			description: 'Die erste Version meiner eigenen "Portfolio" Website.',
			link: 'https://github.com/janburzinski/janburzinski.de',
			imageUrl: '/janburzinski_web_20_05_2025.png'
		},
		{
			title: 'FitByLinus',
			description:
				'Eine moderne Webseite für einen Personal Trainer zur Präsentation von Dienstleistungen und zur Kontaktaufnahme.',
			link: 'https://fitbylinus.de/',
			imageUrl: '/fitbylinus_web_20_05_2025.png'
		}
	];
</script>

<svelte:head>
	<title>Projekte - Jan Burzinski | Portfolio & Entwicklungsprojekte</title>
	<meta
		name="description"
		content="Übersicht der Projekte von Jan Burzinski - Webentwicklung, Softwareprojekte und Portfolio. Einschließlich persönlicher Website und FitByLinus."
	/>
</svelte:head>

<div class="page-wrapper">
	<div class="header">
		<h1>Projekte</h1>
		<p class="subtitle">Eine Übersicht meiner aktuellen und abgeschlossenen Projekte.</p>
	</div>

	<div class="projects-grid">
		{#each projects as project (project.title)}
			<div class="project-card">
				{#if project.imageUrl}
					<img src={project.imageUrl} alt={project.title} class="project-image" />
				{/if}
				<div class="project-card-content">
					<div class="project-header">
						<h2>
							{#if project.link}
								<a href={project.link}>{project.title}</a>
							{:else}
								{project.title}
							{/if}
						</h2>
					</div>

					<p class="project-description text-center">{project.description}</p>
				</div>
			</div>
		{/each}
	</div>

	<div class="more-projects-section">
		<p>Für weitere Projekte und Einblicke in meine Arbeit, besuche mein GitHub Profil.</p>
		<a
			href="https://github.com/janburzinski"
			target="_blank"
			rel="noopener noreferrer"
			class="github-button"
		>
			GitHub Profil ansehen
		</a>
	</div>
</div>

<style>
	.page-wrapper {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.header {
		margin-top: -20vh;
		text-align: left;
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2rem;
		font-weight: normal;
		margin-bottom: 0.5rem;
		color: #ffffff;
	}

	.subtitle {
		font-size: 1rem;
		color: #7d8590;
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.project-card {
		background: rgba(22, 27, 34, 0.5);
		border: 1px solid rgba(48, 54, 61, 0.5);
		border-radius: 0.375rem;
		display: flex;
		flex-direction: column;
		transition: background-color 0.2s ease;
		overflow: hidden;
	}

	.project-card:hover {
		background: rgba(22, 27, 34, 0.8);
	}

	.project-image {
		width: 100%;
		height: 300px;
		object-fit: cover;
	}

	.project-card-content {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		flex-grow: 1;
	}

	.project-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.project-header h2 {
		font-size: 1.1rem;
		font-weight: normal;
		text-align: center;
		width: 100%;
	}

	a {
		color: #ffffff;
		text-decoration: none;
	}

	a:hover {
		color: #3fa7d6;
	}

	.project-description {
		color: #7d8590;
		font-size: 0.875rem;
	}

	.more-projects-section {
		background-color: rgba(30, 37, 46, 0.7);
		padding: 2rem;
		text-align: center;
		border-radius: 0.375rem;
		border: 1px solid rgba(48, 54, 61, 0.5);
	}

	.more-projects-section p {
		color: #c9d1d9;
		font-size: 1rem;
		margin: 0;
		margin-bottom: 1rem;
	}

	.github-button {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background-color: #307ac0;
		color: #ffffff;
		text-decoration: none;
		border-radius: 0.5rem;
		font-weight: 500;
		transition: background-color 0.2s ease;
	}

	.github-button:hover {
		background-color: #2e72a0;
		color: #ffffff;
	}

	.text-center {
		text-align: center;
	}
</style>
