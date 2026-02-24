<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import '@fontsource/geist-sans/400.css';
	import '@fontsource/geist-sans/500.css';
	import '@fontsource/geist-sans/600.css';
	import '@fontsource/geist-mono/400.css';
	import '@fontsource/geist-mono/500.css';

	export let data;

	$: title = data.title ? `${data.title} - Jan Burzinski` : 'Jan Burzinski';
	$: description = data.description || 'B.Sc. Informatik Student an der TU Berlin.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<style>
		@font-face {
			font-family: 'Geist Pixel Square';
			src: url('/fonts/GeistPixel-Square.woff2') format('woff2');
			font-weight: normal;
			font-style: normal;
			font-display: swap;
		}
		@font-face {
			font-family: 'Geist Pixel Grid';
			src: url('/fonts/GeistPixel-Grid.woff2') format('woff2');
			font-weight: normal;
			font-style: normal;
			font-display: swap;
		}
		@font-face {
			font-family: 'Geist Pixel Circle';
			src: url('/fonts/GeistPixel-Circle.woff2') format('woff2');
			font-weight: normal;
			font-style: normal;
			font-display: swap;
		}
		@font-face {
			font-family: 'Geist Pixel Triangle';
			src: url('/fonts/GeistPixel-Triangle.woff2') format('woff2');
			font-weight: normal;
			font-style: normal;
			font-display: swap;
		}
		@font-face {
			font-family: 'Geist Pixel Line';
			src: url('/fonts/GeistPixel-Line.woff2') format('woff2');
			font-weight: normal;
			font-style: normal;
			font-display: swap;
		}

		:root {
			--font-geist-sans:
				'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			--font-geist-mono: 'Geist Mono', 'SF Mono', Monaco, 'Cascadia Code', monospace;
			--font-geist-pixel-square: 'Geist Pixel Square', monospace;
			--font-geist-pixel-grid: 'Geist Pixel Grid', monospace;
			--font-geist-pixel-circle: 'Geist Pixel Circle', monospace;
			--font-geist-pixel-triangle: 'Geist Pixel Triangle', monospace;
			--font-geist-pixel-line: 'Geist Pixel Line', monospace;

			font-family: var(--font-geist-sans);
			-webkit-font-smoothing: antialiased;
			scroll-behavior: auto;

			/* Smooth theme transition */
			transition:
				color 0.3s ease,
				background-color 0.3s ease;
		}

		/* Dark theme (default) */
		:root.dark,
		:root:not(.light) {
			color: #fff;
			background-color: #0d0d0d;

			/* Theme variables */
			--text-primary: #fff;
			--text-secondary: #666;
			--text-muted: #444;
			--border-color: #1a1a1a;
			--border-hover: #333;
			--hover-bg: rgba(255, 255, 255, 0.05);
			--active-bg: rgba(255, 255, 255, 0.1);
			--dropdown-bg: rgba(13, 13, 13, 0.95);
			--card-bg: #111;
			--link-color: #666;
			--link-hover: #e0e0e0;
		}

		/* Light theme */
		:root.light {
			color: #0d0d0d;
			background-color: #fafafa;

			/* Theme variables */
			--text-primary: #0d0d0d;
			--text-secondary: #666;
			--text-muted: #999;
			--border-color: #e0e0e0;
			--border-hover: #ccc;
			--hover-bg: rgba(0, 0, 0, 0.05);
			--active-bg: rgba(0, 0, 0, 0.1);
			--dropdown-bg: rgba(255, 255, 255, 0.95);
			--card-bg: #fff;
			--link-color: #666;
			--link-hover: #333;
		}
		body {
			margin: 0;
			padding: 0;
		}
		code,
		pre,
		kbd,
		samp {
			font-family: var(--font-geist-mono);
		}
	</style>
</svelte:head>

<Navbar />

<main class="content">
	<slot />
</main>

<Footer />

<style>
	.content {
		max-width: 700px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}
</style>
