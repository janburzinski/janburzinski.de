<script lang="ts">
	let experience = [
		{
			company: 'Burzinski & Jaenisch GbR',
			role: 'Software Engineer | Founder',
			period: '2025 – Heute',
			description: 'Softwarelösungen, Marketing und Beratung für KMUs.'
		}
	];

	let education = [
		{
			institution: 'Technische Universität Berlin',
			degree: 'B.Sc. Informatik',
			period: '2024 – Heute'
		},
		{
			institution: 'Private Kant Schulen',
			degree: 'Abitur',
			period: '2010 – 2024'
		}
	];

	let skills = {
		Languages: ['Go', 'C', 'Java', 'Python', 'JavaScript', 'TypeScript'],
		Frontend: ['React', 'Next.js', 'Svelte', 'Tailwind CSS'],
		Backend: ['Node.js', 'PostgreSQL', 'MongoDB', 'Redis'],
		Tools: ['Git', 'Docker', 'AWS', 'GCP']
	};
</script>

<svelte:head>
	<title>Resume - Jan Burzinski</title>
</svelte:head>

<section class="resume-container">
	<h1>Resume</h1>

	<div class="section">
		<h2>Experience</h2>
		{#each experience as job}
			<div class="entry">
				<div class="entry-header">
					<span class="entry-title">{job.company}</span>
					<span class="entry-date">{job.period}</span>
				</div>
				<p class="entry-role">{job.role}</p>
				<p class="entry-desc">{job.description}</p>
			</div>
		{/each}
	</div>

	<div class="section">
		<h2>Education</h2>
		{#each education as edu}
			<div class="entry">
				<div class="entry-header">
					<span class="entry-title">{edu.institution}</span>
					<span class="entry-date">{edu.period}</span>
				</div>
				<p class="entry-role">{edu.degree}</p>
			</div>
		{/each}
	</div>

	<div class="section">
		<h2>Skills</h2>
		<div class="skills-grid">
			{#each Object.entries(skills) as [category, list]}
				<div class="skill-category">
					<h3>{category}</h3>
					<p>{list.join(', ')}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	h1 {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 3rem;
		letter-spacing: -0.03em;
	}

	.section {
		margin-bottom: 4rem;
	}

	h2 {
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
		margin-bottom: 2rem;
	}

	.entry-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.entry-title {
		font-weight: 500;
		color: #fff;
	}

	.entry-date {
		font-size: 0.85rem;
		color: #666;
	}

	.entry-role {
		margin: 0.25rem 0 0.5rem 0;
		font-size: 0.95rem;
		color: #ccc;
	}

	.entry-desc {
		margin: 0;
		font-size: 0.9rem;
		color: #888;
		line-height: 1.5;
	}

	.skills-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 2rem;
	}

	h3 {
		font-size: 0.9rem;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
		color: #eee;
	}

	.skill-category p {
		margin: 0;
		font-size: 0.9rem;
		color: #888;
		line-height: 1.4;
	}
</style>
