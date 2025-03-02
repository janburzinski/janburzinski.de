<svelte:head>
	<title>blog - jan burzinski</title>
</svelte:head>

<div class="coming-soon-container">
	<h1 class="title">
		<span class="blog-waiting-style">Blog</span> <br /><span class="highlight">Coming Soon</span>
	</h1>
	<p class="description">
		Ich arbeite gerade daran, hier interessante Inhalte für dich zu erstellen.
	</p>
	<div class="construction-icon">🚧</div>
</div>

<style>
	.blog-waiting-style {
		letter-spacing: 10px;
	}
	.coming-soon-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		padding: 2rem;
		text-align: center;
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
		font-size: 3.5rem;
		margin-bottom: 1rem;
		letter-spacing: 2px;
	}

	.highlight {
		background: linear-gradient(to right, #60d394, #3fa7d6, #e07a5f);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
	}

	.description {
		font-size: 1.5rem;
		color: #bbbbbb;
		max-width: 600px;
		margin: 1rem auto;
	}

	.construction-icon {
		font-size: 4rem;
		margin-top: 2rem;
		animation: bounce 2s infinite;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}
</style>
