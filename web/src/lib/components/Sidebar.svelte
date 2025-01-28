<div class="sidebar">
	<div class="nav-links">
		<a href="/">/startseite</a>
		<a href="/resume">/resume</a>
		<a href="mailto:jan@burzinski.de">/kontakt</a>
	</div>
</div>

<style>
	.sidebar {
		position: fixed;
		top: 0;
		right: 0;
		height: 100%;
		width: 200px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		padding: 1rem;
	}

	.nav-links {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding-left: 4rem;
	}

	.nav-links a {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		color: #c0c0c0;
		text-decoration: none;
		font-size: 1.2rem;
		transition:
			color 0.6s ease,
			border 0.6s ease,
			gap 0.6s ease,
			padding 0.6s ease,
			transform 0.6s ease;
		/*border: 1px solid #fff; */
		padding: 0.5rem 1rem;
		border-radius: 4px;
		transform: scaleX(1);
	}
</style>
