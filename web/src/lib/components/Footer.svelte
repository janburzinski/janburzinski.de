<footer class="footer">
	<div class="container">
		<p>&copy; 2026 Jan Burzinski</p>
		<div class="links">
			<a href="/impressum">Impressum</a>
			<a href="/datenschutz">Datenschutz</a>
		</div>
	</div>
</footer>

<style>
	.footer {
		border-top: 1px solid var(--border-color);
		margin-top: 4rem;
		padding: 2rem 0;
		color: var(--text-secondary);
		font-size: 0.85rem;
		transition:
			border-color 0.3s ease,
			color 0.3s ease;
	}

	.container {
		max-width: 700px;
		margin: 0 auto;
		padding: 0 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.links {
		display: flex;
		gap: 1.5rem;
	}

	.links a {
		font-family: var(--font-geist-mono);
		font-size: 0.8rem;
		color: var(--text-secondary);
		text-decoration: none;
		transition: color 0.2s var(--ease-out);
	}

	@media (hover: hover) and (pointer: fine) {
		.links a:hover {
			color: var(--text-primary);
		}
	}

	.links a:active {
		opacity: 0.7;
	}

	@media (max-width: 480px) {
		.container {
			flex-direction: column;
			gap: 1rem;
			text-align: center;
		}
	}
</style>
