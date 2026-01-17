<script lang="ts">
	import { dev } from '$app/environment';
	import BackgroundEffect from '$lib/components/BackgroundEffect.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });

	export let data;

	$: title = data.title ? `${data.title} - Jan Burzinski` : 'Jan Burzinski';
	$: description = data.description || 'B.Sc. Informatik Student an der TU Berlin.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<style>
		:root {
			font-family:
				'Inter',
				-apple-system,
				BlinkMacSystemFont,
				'Segoe UI',
				Roboto,
				sans-serif;
			color: #fff;
			background-color: #000;
			-webkit-font-smoothing: antialiased;
			scroll-behavior: auto;
		}
		body {
			margin: 0;
			padding: 0;
		}
	</style>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>
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
