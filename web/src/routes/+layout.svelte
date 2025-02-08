<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import BackgroundEffect from '$lib/components/BackgroundEffect.svelte';
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
	<title>start - jan burzinski</title>
</svelte:head>

<svelte:body />

<Navbar />

<BackgroundEffect />

<Sidebar />

<slot />

<Footer />
