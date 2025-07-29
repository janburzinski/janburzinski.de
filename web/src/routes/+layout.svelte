<script lang="ts">
	import { dev } from '$app/environment';
	import BackgroundEffect from '$lib/components/BackgroundEffect.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });
</script>

<svelte:head>
	<style>
		:root {
			font-family: 'Rubik', 'Inter', sans-serif;
			color: #fff;
			background-color: #121212;
		}
	</style>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&family=Public+Sans:ital,wght@0,100..900;1,100..900&family=Rubik:ital,wght@0,300..900;1,300..900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
		rel="stylesheet"
	/>
	<title>Jan Burzinski - Informatik Student & Entwickler</title>
	<script
		src="https://cdn.databuddy.cc/databuddy.js"
		data-client-id="zRRQcV1-4tCaDAE_xzhOk"
		data-track-hash-changes="true"
		data-track-attributes="true"
		data-track-outgoing-links="true"
		data-track-interactions="true"
		data-track-engagement="true"
		data-track-scroll-depth="true"
		data-track-exit-intent="true"
		data-track-bounce-rate="true"
		data-track-web-vitals="true"
		data-track-errors="true"
		data-enable-batching="true"
		crossOrigin="anonymous"
		async
	></script>
</svelte:head>

<svelte:body />

<Navbar />

<BackgroundEffect />

<Sidebar />

<slot />

<Footer />
