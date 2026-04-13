<script lang="ts">
	export let data;

	$: title = data.title ? `${data.title} - Jan Burzinski` : 'Jan Burzinski';
	$: description = data.description || 'B.Sc. Informatik Student an der TU Berlin.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<style>
		@font-face {
			font-family: 'Inter';
			src: url('/fonts/inter-latin-400-normal.woff2') format('woff2');
			font-weight: 400;
			font-style: normal;
			font-display: swap;
		}
		@font-face {
			font-family: 'Inter';
			src: url('/fonts/inter-latin-500-normal.woff2') format('woff2');
			font-weight: 500;
			font-style: normal;
			font-display: swap;
		}
		@font-face {
			font-family: 'Inter';
			src: url('/fonts/inter-latin-600-normal.woff2') format('woff2');
			font-weight: 600;
			font-style: normal;
			font-display: swap;
		}

		:root {
			--font-inter: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			--ease-out: cubic-bezier(0.23, 1, 0.32, 1);

			font-family: var(--font-inter);
			-webkit-font-smoothing: antialiased;
			scroll-behavior: auto;
		}

		:root.theme-ready {
			transition:
				color 0.3s ease,
				background-color 0.3s ease;
		}

		:root.dark,
		:root:not(.light) {
			color: #e8e8e8;
			background-color: #0a0a0a;

			--text-primary: #e8e8e8;
			--text-secondary: #666;
			--text-muted: #444;
			--link-color: #e8e8e8;
			--link-hover: #fff;
		}

		:root.light {
			color: #1a1a1a;
			background-color: #fafafa;

			--text-primary: #1a1a1a;
			--text-secondary: #666;
			--text-muted: #999;
			--link-color: #1a1a1a;
			--link-hover: #000;
		}

		body {
			margin: 0;
			padding: 0;
		}

		@keyframes blurFadeIn {
			from {
				opacity: 0;
				filter: blur(12px);
				transform: translateY(4px);
			}
			to {
				opacity: 1;
				filter: blur(0);
				transform: translateY(0);
			}
		}

		.blur-in {
			animation: blurFadeIn 800ms var(--ease-out) both;
		}

		.delay-1 { animation-delay: 0ms; }
		.delay-2 { animation-delay: 150ms; }
		.delay-3 { animation-delay: 300ms; }
		.delay-4 { animation-delay: 450ms; }

		@media (prefers-reduced-motion: reduce) {
			@keyframes blurFadeIn {
				from { opacity: 0; }
				to { opacity: 1; }
			}

			.blur-in {
				animation-duration: 200ms;
			}

			.delay-1, .delay-2, .delay-3, .delay-4 {
				animation-delay: 0ms;
			}
		}
	</style>
</svelte:head>

<main class="content">
	<slot />
</main>

<style>
	.content {
		max-width: 480px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}
</style>
