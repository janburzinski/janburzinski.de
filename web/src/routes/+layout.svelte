<script lang="ts">
	import '@fontsource/geist/400.css';
	import '@fontsource/geist/500.css';
	import '@fontsource/geist/600.css';

	export let data;

	$: title = data.title ? `${data.title} - Jan Burzinski` : 'Jan Burzinski';
	$: description = data.description || 'B.Sc. Informatik Student an der TU Berlin.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<style>
		:root {
			--font: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

			font-family: var(--font);
			-webkit-font-smoothing: antialiased;
		}

		:root.dark,
		:root:not(.light) {
			color: #e8e8e8;
			background-color: #0a0a0a;

			--text-primary: #e8e8e8;
			--text-secondary: #888;
			--text-muted: #666;
			--link-color: #e8e8e8;
		}

		:root.light {
			color: #1a1a1a;
			background-color: #fafafa;

			--text-primary: #1a1a1a;
			--text-secondary: #666;
			--text-muted: #999;
			--link-color: #1a1a1a;
		}

		body {
			margin: 0;
			padding: 0;
		}

		::view-transition-old(root),
		::view-transition-new(root) {
			animation: none;
			mix-blend-mode: normal;
		}

		::view-transition-new(root) {
			animation: circle-reveal 0.4s ease-out;
		}

		@keyframes circle-reveal {
			from {
				clip-path: circle(0px at 50% 50%);
			}
			to {
				clip-path: circle(150% at 50% 50%);
			}
		}

		@media (prefers-reduced-motion: reduce) {
			::view-transition-new(root) {
				animation: none;
			}
		}
	</style>
</svelte:head>

<main class="content">
	<slot />
</main>

<style>
	.content {
		width: 100%;
		margin: 0;
		padding: 0;
	}
</style>
