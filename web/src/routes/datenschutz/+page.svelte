<svelte:head>
	<title>Datenschutz - Jan Burzinski</title>
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<div class="page">
	<nav class="topbar">
		<a href="/" class="name">Jan Burzinski</a>
		<a href="/impressum" class="nav-link">Impressum</a>
	</nav>

	<div class="main">
		<h1>Datenschutzerklärung</h1>

		<div class="section">
			<h2>1. Verantwortlicher</h2>
			<p>
				Jan Burzinski<br />
				Burgunder Str. 1<br />
				14197 Berlin<br />
				E-Mail: jan@burzinski.de
			</p>
		</div>

		<div class="section">
			<h2>2. Hosting & Bereitstellung</h2>
			<p>
				Diese Website wird bei Cloudflare gehostet (Cloudflare, Inc., 665 3rd St. Suite 200, San
				Francisco, CA 94107, USA). Cloudflare speichert technische Daten zur Sicherheit und
				Stabilität. Es werden keine personenbezogenen Daten auf den Servern gespeichert.
			</p>
		</div>

		<div class="section">
			<h2>3. Webanalyse</h2>
			<p>
				Wir nutzen anonymisierte Analyse-Tools zur Verbesserung unseres Angebots. Es werden keine
				personenbezogenen Daten oder Cookies für Werbezwecke gespeichert.
			</p>
		</div>

		<div class="section">
			<h2>4. Ihre Rechte</h2>
			<p>
				Sie haben das Recht auf Auskunft, Berichtigung oder Löschung Ihrer Daten. Kontaktieren Sie
				uns gerne per E-Mail.
			</p>
		</div>

		<div class="meta">Letztes Update: 13.04.2026</div>
	</div>
</div>

<style>
	.page {
		width: 100%;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}

	.topbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem 1.5rem 1rem 1.5rem;
	}

	.name {
		font-size: 1.125rem;
		font-weight: 500;
		letter-spacing: -0.01em;
		color: var(--text-primary);
		text-decoration: none;
	}

	.nav-link {
		color: var(--text-muted);
		text-decoration: none;
		font-size: 0.75rem;
	}

	@media (hover: hover) and (pointer: fine) {
		.nav-link:hover {
			color: var(--text-secondary);
		}
	}

	.main {
		max-width: 480px;
		padding: 0 1.5rem;
	}

	h1 {
		font-size: 1.125rem;
		font-weight: 500;
		margin: 0 0 2rem 0;
		color: var(--text-primary);
	}

	h2 {
		font-size: 0.75rem;
		font-weight: 400;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
		margin: 0 0 0.75rem 0;
	}

	.section {
		margin-bottom: 2rem;
	}

	.section:first-of-type h2 {
		margin-top: 0;
	}

	p {
		font-size: 0.875rem;
		line-height: 1.7;
		color: var(--text-secondary);
		margin: 0;
	}

	.meta {
		margin-top: 3rem;
		font-size: 0.75rem;
		color: var(--text-muted);
	}
</style>
