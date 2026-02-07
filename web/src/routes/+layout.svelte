<script lang="ts">
	import { dev } from '$app/environment';
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import { inject } from '@vercel/analytics';
	import '@fontsource/geist-sans/400.css';
	import '@fontsource/geist-sans/500.css';
	import '@fontsource/geist-sans/600.css';
	import '@fontsource/geist-mono/400.css';
	import '@fontsource/geist-mono/500.css';

	inject({ mode: dev ? 'development' : 'production' });

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
			--font-geist-sans: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			--font-geist-mono: 'Geist Mono', 'SF Mono', Monaco, 'Cascadia Code', monospace;
			--font-geist-pixel-square: 'Geist Pixel Square', monospace;
			--font-geist-pixel-grid: 'Geist Pixel Grid', monospace;
			--font-geist-pixel-circle: 'Geist Pixel Circle', monospace;
			--font-geist-pixel-triangle: 'Geist Pixel Triangle', monospace;
			--font-geist-pixel-line: 'Geist Pixel Line', monospace;
			
			font-family: var(--font-geist-sans);
			color: #fff;
			background-color: #0d0d0d;
			-webkit-font-smoothing: antialiased;
			scroll-behavior: auto;
		}
		body {
			margin: 0;
			padding: 0;
		}
		code, pre, kbd, samp {
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
