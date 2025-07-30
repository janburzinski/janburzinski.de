<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;
	$: articles = data.posts;
</script>

<svelte:head>
	<title>Blog - Jan Burzinski | Informatik & Entwicklung</title>
	<meta
		name="description"
		content="Blog von Jan Burzinski über Informatik, Programmierung und Softwareentwicklung."
	/>
</svelte:head>

<div class="container">
	<div class="introduction-section" in:fly={{ y: 40, duration: 600 }}>
		<h1>Blog</h1>
		<p>
			Artikel über Informatik, Programmierung und meine Erfahrungen als Student.
		</p>
	</div>

	<div class="articles-section" in:fly={{ y: 40, duration: 600, delay: 100 }}>
		<h2>Artikel</h2>
		{#each articles as article}
			<div class="article-item">
				<a href="/blog/{article.slug}" class="article-link">
					<div class="article-header">
						<h3>{article.title}</h3>
						<time class="article-date">
							{new Date(article.date).toLocaleDateString('de-DE', { 
								year: 'numeric', 
								month: 'long', 
								day: 'numeric' 
							})}
						</time>
					</div>
					<p class="article-excerpt">{article.excerpt}</p>
					<div class="article-tags">
						{#each article.tags as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>
				</a>
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
		letter-spacing: 2px;
		font-weight: bold;
		margin-bottom: 0.5rem;
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

	.articles-section {
		margin-bottom: 3rem;
	}

	.articles-section h2 {
		letter-spacing: var(--h1-letter-spacing);
		font-size: var(--h2-font-size);
		font-weight: bold;
		text-transform: uppercase;
		margin-bottom: 1.5rem;
		border-bottom: var(--bottom-border-thickness);
		padding-bottom: 0.5rem;
	}

	.article-item:not(:last-child) {
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: var(--bottom-border-thickness);
	}

	.article-link {
		display: block;
		text-decoration: none;
		color: inherit;
	}

	.article-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 0.5rem;
	}

	.article-header h3 {
		font-size: var(--h3-font-size);
		font-weight: bold;
	}

	.article-date {
		font-size: 1rem;
		color: #888;
	}

	.article-excerpt {
		font-size: 1rem;
		color: #c4c4c4;
		margin: 0.2rem 0;
		line-height: 1.6;
	}

	.article-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.tag {
		color: #c4c4c4;
		font-size: 0.9rem;
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

		.introduction-section p {
			font-size: 1rem;
		}

		.articles-section h2 {
			font-size: 1.05rem;
			padding-bottom: 0.3rem;
		}

		.article-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.2rem;
		}

		.article-header h3 {
			font-size: 0.95rem;
		}

		.article-date {
			font-size: 0.95rem;
		}

		.article-excerpt {
			font-size: 0.95rem;
		}

		.article-item:not(:last-child) {
			margin-bottom: 1rem;
			padding-bottom: 1rem;
		}

		.tag {
			font-size: 0.85rem;
		}
	}
</style>
