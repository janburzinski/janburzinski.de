<script lang="ts">
	import { page } from '$app/stores';
</script>

<nav class="navbar">
	<div class="container">
		<a href="/" class="logo" class:active={$page.url.pathname === '/'}> jan burzinski </a>
		<div class="links">
			<a href="https://github.com/janburzinski" target="_blank" rel="noopener noreferrer">
				github
			</a>
		</div>
	</div>
</nav>

<style>
	.navbar {
		position: sticky;
		top: 0;
		background: rgba(13, 13, 13, 0.8);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid #1a1a1a;
		z-index: 100;
	}

	.container {
		max-width: 700px;
		margin: 0 auto;
		padding: 0 1rem;
		height: 64px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		font-weight: 600;
		text-decoration: none;
		color: #fff;
		font-size: 0.95rem;
		letter-spacing: -0.01em;
	}

	.links {
		display: flex;
		gap: 1.5rem;
	}

	.links a {
		text-decoration: none;
		color: #666;
		font-size: 0.9rem;
	}

	.links a:hover,
	.links a.active {
		color: #e0e0e0;
	}

	@media (max-width: 480px) {
		.container {
			height: 56px;
		}
	}
</style>
