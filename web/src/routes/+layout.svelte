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

			font-family: var(--font-inter);
			-webkit-font-smoothing: antialiased;
		}

		:root.dark,
		:root:not(.light) {
			color: #e8e8e8;
			background-color: #0a0a0a;

			--text-primary: #e8e8e8;
			--text-secondary: #666;
			--text-muted: #444;
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
