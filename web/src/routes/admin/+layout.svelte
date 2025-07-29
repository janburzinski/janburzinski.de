<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/stores';
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });

	$: isLoginPage = $page.route.id === '/admin';
</script>

<svelte:head>
	<style>
		:root {
			font-family:
				'Inter',
				-apple-system,
				BlinkMacSystemFont,
				sans-serif;
			color: #000;
			background-color: #ffffff;
		}
	</style>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
	<title>Admin - Jan Burzinski</title>
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

{#if !isLoginPage}
	<nav class="admin-nav">
		<div class="nav-container">
			<div class="nav-brand">
				<a href="/admin/dashboard" class="brand-link">
					<span class="brand-text">Big Admin Panel</span>
				</a>
			</div>

			<div class="nav-links">
				<a
					href="/admin/dashboard"
					class="nav-link"
					class:active={$page.url.pathname === '/admin/dashboard'}
				>
					Dashboard
				</a>
				<a
					href="/admin/posts"
					class="nav-link"
					class:active={$page.url.pathname.startsWith('/admin/posts')}
				>
					Posts
				</a>
				<a
					href="/admin/analytics"
					class="nav-link"
					class:active={$page.url.pathname.startsWith('/admin/analytics')}
				>
					Analytics
				</a>
			</div>

			<div class="nav-actions">
				<button class="btn-logout">Sign Out</button>
			</div>
		</div>
	</nav>
{/if}

<main class="admin-main" class:no-nav={isLoginPage}>
	<slot />
</main>

<style>
	.admin-nav {
		background: #ffffff;
		border-bottom: 1px solid #e1e1e1;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 2rem;
		height: 60px;
	}

	.nav-brand {
		display: flex;
		align-items: center;
	}

	.brand-link {
		text-decoration: none;
		color: #000000;
	}

	.brand-text {
		font-size: 1.25rem;
		font-weight: 600;
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 2rem;
	}

	.nav-link {
		color: #666666;
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 500;
		transition: color 0.2s ease;
		padding: 0.5rem 0;
		position: relative;
	}

	.nav-link:hover {
		color: #000000;
	}

	.nav-link.active {
		color: #000000;
	}

	.nav-link.active::after {
		content: '';
		position: absolute;
		bottom: -1px;
		left: 0;
		right: 0;
		height: 2px;
		background: #000000;
		border-radius: 1px;
	}

	.nav-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.btn-logout {
		padding: 0.5rem 1rem;
		background: #ffffff;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		color: #666666;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-logout:hover {
		border-color: #000000;
		color: #000000;
	}

	.admin-main {
		min-height: calc(100vh - 60px);
	}

	.admin-main.no-nav {
		min-height: 100vh;
	}

	@media (max-width: 768px) {
		.nav-container {
			padding: 0 1rem;
		}

		.nav-links {
			gap: 1rem;
		}

		.nav-actions {
			gap: 0.5rem;
		}
	}
</style>
