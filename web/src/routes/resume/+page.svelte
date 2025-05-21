<script lang="ts">
	export let skills = {
		Programmiersprachen: ['Go', 'C', 'Java', 'Python', 'JavaScript'],
		Webtechnologien: ['HTML, CSS', 'ReactJS, NextJS, AngularJS', 'Node.js', 'Svelte'],
		Datenbanken: [
			{
				name: 'SQL',
				specifics: ['MySQL, PostgreSQL']
			},
			{
				name: 'NoSQL',
				specifics: ['MongoDB, Redis, DynamoDB']
			}
		],
		Tools: ['Git', 'Docker'],
		'Cloud-Plattformen': [
			'Amazon Web Services',
			'Google Cloud Platform',
			'Hetzner',
			'Digital Ocean'
		]
	};

	export let education = [
		{
			institution: 'Technische Universität Berlin',
			degree: 'B.Sc Informatik',
			period: '2024 – Heute'
		},
		{
			institution: 'Private Kant Schulen / Internationale Schule Berlin',
			degree: 'Abitur',
			period: '2010 – Juli 2024'
		}
	];

	let openApplication: string | null = null;

	function toggleApplication(appName: string) {
		openApplication = openApplication === appName ? null : appName;
	}
</script>

<svelte:head>
	<title>resume - jan burzinski</title>
</svelte:head>

<div class="container">
	<div class="introduction-section">
		<h1>Jan Burzinski</h1>
		<a href="https://github.com/janburzinski" class="introduction-github-link" target="_blank"
			>github.com/janburzinski</a
		>
		<p>
			Ein kreativer Informatik-Student mit Leidenschaft für Softwareentwicklung, Problemlösung und
			Technologien.
		</p>
	</div>

	<div class="skills-section">
		<h2>Erfahrung</h2>
		<div class="skills-grid">
			{#each Object.entries(skills) as [category, items]}
				<div class="skills-category">
					<h3 style="letter-spacing:0.7px;">{category}</h3>
					<ul>
						{#each items as item}
							{#if category === 'Datenbanken'}
								<li class="application-item">
									<button
										class="application-button"
										on:click={() => toggleApplication(typeof item === 'object' ? item.name : item)}
									>
										{typeof item === 'object' ? item.name : item}
										<span class="dropdown-icon">
											{openApplication === (typeof item === 'object' ? item.name : item)
												? '▲'
												: '▼'}
										</span>
									</button>
									{#if typeof item === 'object' && openApplication === item.name}
										<ul class="specifics-list">
											{#each item.specifics as specific}
												<li>{specific}</li>
											{/each}
										</ul>
									{/if}
								</li>
							{:else}
								<li>{item}</li>
							{/if}
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>

	<div class="education-section">
		<h2>Schule</h2>
		{#each education as edu}
			<div class="education-item">
				<div class="education-header">
					<h3>{edu.institution}</h3>
					<span>{edu.period}</span>
				</div>
				<p>{edu.degree}</p>
			</div>
		{/each}
	</div>
</div>

<style>
	:root {
		--bottom-border-thickness: 1px solid #6e6e6e;
		--h2-font-size: 1.3rem;
		--h3-font-size: 1rem;
		--h1-letter-spacing: 2.5px;
	}

	.introduction-section {
		margin-top: -18vh;
		margin-bottom: 3rem;
	}

	.introduction-section h1 {
		font-size: 2.8rem;
		letter-spacing: 2px; /* letter spacing is different here then anywhere else because leck mein ars.. */
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.introduction-section a {
		color: #fff;
		text-decoration: none;
		font-size: 1.3rem;
	}

	.introduction-section a:hover {
		text-decoration: underline;
	}

	.introduction-section p {
		margin-top: 1rem;
		font-size: 1.2rem;
		color: #ccc;
		line-height: 1.6;
	}

	.container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem;
	}

	.skills-section {
		margin-bottom: 3rem;
	}

	.skills-section h2 {
		letter-spacing: var(--h1-letter-spacing);
		font-size: var(--h2-font-size);
		font-weight: bold;
		text-transform: uppercase;
		margin-bottom: 1.5rem;
		border-bottom: var(--bottom-border-thickness);
		padding-bottom: 0.5rem;
	}

	.skills-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 2rem;
	}

	.skills-category h3 {
		font-size: var(--h3-font-size);
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.skills-category ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.skills-category li {
		margin-bottom: 0.5rem;
		font-size: 1rem;
		color: #c4c4c4;
	}

	.application-item {
		margin-bottom: 0.5rem;
	}

	.application-button {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		cursor: pointer;
		color: #c4c4c4;
		font-size: 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		text-align: left;
	}

	.application-button:hover {
		color: #fff;
	}

	.dropdown-icon {
		margin-left: 5px;
	}

	.specifics-list {
		list-style: disc;
		padding-left: 20px;
		margin-top: 0.5rem;
		color: #a0a0a0;
	}

	.specifics-list li {
		font-size: 0.9rem;
	}

	.education-section {
		margin-bottom: 3rem;
	}

	.education-section h2 {
		font-size: var(--h2-font-size);
		font-weight: bold;
		text-transform: uppercase;
		margin-bottom: 1.5rem;
		border-bottom: var(--bottom-border-thickness);
		letter-spacing: var(--h1-letter-spacing);
		padding-bottom: 0.5rem;
	}

	.education-section .education-item:not(:last-child) {
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: var(--bottom-border-thickness);
	}

	.education-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 0.5rem;
	}

	.education-header h3 {
		font-size: var(--h3-font-size);
		font-weight: bold;
	}

	.education-header span {
		font-size: 1rem;
		color: #888;
	}
</style>
