<script lang="ts">
	interface Project {
		title: string;
		description: string;
		status: 'fertig' | 'in arbeit';
		link?: string;
		tech?: string[];
	}

	const projects: Project[] = [
		{
			title: 'Persönliche Website',
			description: 'Die erste Version meiner eigenen "Portfolio" Website.',
			status: 'fertig',
			tech: ['SvelteKit', 'TypeScript'],
			link: 'https://github.com/janburzinski/janburzinski.de'
		},
		{
			title: 'Minecraft Rang System',
			description:
				'Ein Gruppen System, ähnlich wie Pex oder LuckPerms. Es soll Verwaltung von Spielergruppen und deren Rechte (Permissions) direkt im Spiel ermöglichen.',
			status: 'in arbeit',
			tech: ['Java', 'PaperMC', 'Maven', 'PostgreSQL'],
			link: 'https://github.com/janburzinski/playlegend-rank'
		}
	];
</script>

<svelte:head>
	<title>projekte - jan burzinski</title>
</svelte:head>

<div class="page-wrapper">
	<div class="header">
		<h1>Projekte</h1>
		<p class="subtitle">Eine Übersicht meiner aktuellen und abgeschlossenen Projekte.</p>
	</div>

	<div class="projects-grid">
		{#each projects as project}
			<div class="project-card">
				<div class="project-header" style="text-align: center;">
					<h2>
						{#if project.link}
							<a href={project.link}>{project.title}</a>
						{:else}
							{project.title}
						{/if}
					</h2>
				</div>

				<p class="project-description">{project.description}</p>

				<div class="project-footer">
					<div class="status">
						<span
							class="status-indicator"
							class:completed={project.status === 'fertig'}
							class:in-progress={project.status === 'in arbeit'}
						></span>
						<span class="status-text">{project.status}</span>
					</div>

					{#if project.tech}
						<div class="tech-stack">
							{#each project.tech as tech}
								<span class="tech-tag">{tech}</span>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.page-wrapper {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.header {
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
	}

	.project-card {
		background: rgba(22, 27, 34, 0.5);
		border: 1px solid rgba(48, 54, 61, 0.5);
		border-radius: 0.375rem;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		transition: background-color 0.2s ease;
	}

	.project-card:hover {
		background: rgba(22, 27, 34, 0.8);
	}

	.project-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.project-icon {
		font-size: 1.2rem;
		color: #7d8590;
	}

	h2 {
		font-size: 1.1rem;
		font-weight: normal;
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

	.project-footer {
		margin-top: auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.status {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		color: #7d8590;
	}

	.status-indicator {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		display: inline-block;
	}

	.status-indicator.completed {
		background-color: #238636;
	}

	.status-indicator.in-progress {
		background-color: #db6d28;
	}

	.tech-stack {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tech-tag {
		padding: 0.125rem 0.375rem;
		background-color: #30363d;
		border-radius: 1rem;
		font-size: 0.75rem;
		color: #7d8590;
	}
</style>
