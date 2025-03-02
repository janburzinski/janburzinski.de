<script lang="ts">
	const contactLinks = [
		{
			name: 'E-Mail',
			url: 'mailto:jan@burzinski.de',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`
		},
		{
			name: 'GitHub',
			url: 'https://github.com/janburzinski',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`
		},
		{
			name: 'Twitter',
			url: 'https://twitter.com/janburzinski',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
		}
	];
</script>

<svelte:head>
	<title>kontakt - jan burzinski</title>
</svelte:head>

<div class="contact-container">
	<h1 class="title highlight">Kontakt</h1>

	<div class="info-section">
		<p class="intro-text">
			Ich freue mich über jede Nachricht! Ob es um Projektideen, Fragen oder einfach nur einen
			freundlichen Austausch geht - kontaktiere mich gerne über einen der folgenden Kanäle.
		</p>

		<div class="contact-links">
			{#each contactLinks as link}
				<a href={link.url} class="contact-button" target="_blank" rel="noopener noreferrer">
					<span class="icon">{@html link.icon}</span>
					{link.name}
				</a>
			{/each}
		</div>
	</div>
</div>

<style>
	.contact-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 0.5rem 1rem;
		animation: fadeIn 1s ease-out forwards;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.title {
		font-size: 3rem;
		margin-bottom: 1.5rem;
		text-align: center;
		margin-top: 0.5rem;
	}

	.highlight {
		background: linear-gradient(to right, #60d394, #3fa7d6, #e07a5f);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
	}

	.info-section {
		background: rgba(255, 255, 255, 0.05);
		padding: 2rem;
		border-radius: 10px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.intro-text {
		font-size: 1.2rem;
		line-height: 1.6;
		margin-bottom: 2rem;
		color: #bbbbbb;
		text-align: center;
	}

	.contact-links {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin: 2rem 0;
	}

	.contact-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		color: white;
		text-decoration: none;
		font-size: 1.1rem;
		transition: all 0.3s ease;
	}

	.contact-button:hover {
		transform: translateY(-2px);
		background: rgba(255, 255, 255, 0.1);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.icon {
		margin-right: 0.5rem;
		display: flex;
		align-items: center;
	}

	.icon svg {
		width: 24px;
		height: 24px;
	}

	.additional-info {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.additional-info h2 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: #bbbbbb;
	}

	.additional-info p {
		color: #bbbbbb;
		line-height: 1.6;
	}

	@media (max-width: 768px) {
		.contact-container {
			padding: 1rem;
			margin: 0 1rem;
		}

		.title {
			font-size: 2rem;
		}

		.contact-links {
			grid-template-columns: 1fr;
		}
	}
</style>
