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
		border-top: 1px solid #222;
		margin-top: 4rem;
		padding: 2rem 0;
		color: #666;
		font-size: 0.85rem;
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
		color: #666;
		text-decoration: none;
	}

	.links a:hover {
		color: #fff;
	}

	@media (max-width: 480px) {
		.container {
			flex-direction: column;
			gap: 1rem;
			text-align: center;
		}
	}
</style>
