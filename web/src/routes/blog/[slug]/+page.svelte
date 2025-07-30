<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;
	$: article = data.post;

	function goBack() {
		goto('/blog');
	}
</script>

<svelte:head>
	{#if article}
		<title>{article.title} - Jan Burzinski Blog</title>
		<meta name="description" content={article.excerpt} />
	{:else}
		<title>Artikel nicht gefunden - Jan Burzinski Blog</title>
	{/if}
</svelte:head>

<div class="container">
	{#if article}
		<div class="introduction-section" in:fly={{ y: 40, duration: 600 }}>
			<button on:click={goBack} class="back-button">
				<span
					aria-hidden="true"
					style="display: inline-flex; align-items: center; font-size: 1.1em; vertical-align: middle;"
				>
					<svg
						width="1em"
						height="1em"
						viewBox="0 0 20 20"
						fill="none"
						style="margin-right: 0.4em; vertical-align: middle;"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M12.5 15L8 10L12.5 5"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					Zurück zum Blog
				</span>
			</button>
			<h1>{article.title}</h1>
			<div class="article-meta">
				<time class="article-date"
					>{new Date(article.date).toLocaleDateString('de-DE', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}</time
				>
			</div>
		</div>

		<div class="content-section" in:fly={{ y: 40, duration: 600, delay: 100 }}>
			<h2>Artikel</h2>
			<div class="article-content">
				<svelte:component this={article.content} />
			</div>
		</div>
	{:else}
		<div class="container">
			<div class="introduction-section error-container" in:fly={{ y: 40, duration: 600 }}>
				<h1>Artikel nicht gefunden</h1>
				<p>Der angeforderte Artikel existiert nicht.</p>
				<button on:click={goBack} class="back-button"> ← Zurück zum Blog </button>
			</div>
		</div>
	{/if}
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
		letter-spacing: 2px;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.back-button {
		background: none;
		border: 1px solid #6e6e6e;
		color: #c4c4c4;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.9rem;
		margin-bottom: 1.5rem;
		transition: all 0.3s ease;
	}

	.back-button:hover {
		border-color: #fff;
		color: #fff;
	}

	.article-meta {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1rem;
	}

	.article-date {
		font-size: 1.2rem;
		color: #ccc;
	}

	.container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem;
	}

	.content-section {
		margin-bottom: 3rem;
	}

	.content-section h2 {
		letter-spacing: var(--h1-letter-spacing);
		font-size: var(--h2-font-size);
		font-weight: bold;
		text-transform: uppercase;
		margin-bottom: 1.5rem;
		border-bottom: var(--bottom-border-thickness);
		padding-bottom: 0.5rem;
	}

	.article-content {
		text-align: left;
		line-height: 1.7;
		font-size: 1rem;
		color: #c4c4c4;
	}

	.article-content :global(h2) {
		color: #fff;
		font-size: var(--h3-font-size);
		font-weight: bold;
		margin: 2rem 0 1rem 0;
		text-transform: none;
		border: none;
		padding: 0;
		letter-spacing: normal;
	}

	.article-content :global(h3) {
		color: #fff;
		font-size: 1rem;
		margin: 1.5rem 0 0.75rem 0;
		font-weight: bold;
	}

	.article-content :global(p) {
		margin-bottom: 1.5rem;
		color: #c4c4c4;
		line-height: 1.6;
	}

	.article-content :global(ul) {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.article-content :global(li) {
		margin-bottom: 0.5rem;
		color: #c4c4c4;
	}

	.article-content :global(strong) {
		color: #fff;
		font-weight: bold;
	}

	.article-content :global(code) {
		background: rgba(255, 255, 255, 0.1);
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-family: 'Courier New', monospace;
		color: #fff;
	}

	.error-container {
		text-align: center;
	}

	.error-container h1 {
		font-size: 2.8rem;
		letter-spacing: 2px;
		font-weight: bold;
		margin-bottom: 1rem;
	}

	.error-container p {
		font-size: 1.2rem;
		color: #ccc;
		margin-bottom: 2rem;
		line-height: 1.6;
	}

	@media (max-width: 600px) {
		.container {
			padding: 1rem;
		}

		.introduction-section {
			margin-top: -8vh;
			margin-bottom: 2rem;
		}

		.introduction-section h1 {
			font-size: 2rem;
			letter-spacing: 1px;
		}

		.article-date {
			font-size: 1rem;
		}

		.content-section h2 {
			font-size: 1.05rem;
			padding-bottom: 0.3rem;
		}
	}
</style>
