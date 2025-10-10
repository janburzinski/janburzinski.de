<svelte:head>
	<title>Datenschutzerklärung - Jan Burzinski | DSGVO</title>
	<meta
		name="description"
		content="Datenschutzerklärung der Website janburzinski.de - Informationen zum Umgang mit personenbezogenen Daten gemäß DSGVO."
	/>
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<div class="datenschutz-wrapper">
	<div class="datenschutz-container">
		<h1 class="title">
			<span class="title-color-gradient">Datenschutzerklärung</span>
		</h1>

		<div class="content-section">
			<h2>1. Verantwortlicher</h2>
			<p>Jan Burzinski</p>
			<p>Burgunder Str. 1</p>
			<p>14197 Berlin</p>
			<p>E-Mail: j_burzinski@proton.me</p>
		</div>

		<div class="content-section">
			<h2>2. Hosting & Bereitstellung der Website</h2>
			<p>
				Diese Website wird bei Vercel gehostet. Anbieter ist Vercel Inc., 440 N Barranca Ave #4133,
				Covina, CA 91723, USA. Vercel speichert IP-Adressen in Server-Logfiles, um die Sicherheit
				und Stabilität der Website zu gewährleisten.
			</p>
			<p>
				Weitere Informationen finden Sie in der <a
					href="https://vercel.com/legal/privacy-policy"
					target="_blank"
					rel="noopener noreferrer"
					class="external-link">Vercel Datenschutzerklärung</a
				>.
			</p>
		</div>

		<div class="content-section">
			<h2>3. Hosting & Content Delivery Network (CDN)</h2>
			<p>
				Für eine schnelle und sichere Auslieferung der Website nutzen wir Vercel (Vercel Inc., 340 S
				Lemon Ave #4133, Walnut, CA 91789, USA) als Hosting- und CDN-Provider. Vercel verarbeitet
				dabei technische Daten (z.B. IP-Adresse, Zugriffszeitpunkt) zur Bereitstellung und
				Absicherung der Website.
			</p>
			<p>
				Weitere Informationen finden Sie in der <a
					href="https://vercel.com/legal/privacy-policy"
					target="_blank"
					rel="noopener noreferrer"
					class="external-link">Vercel Datenschutzerklärung</a
				>.
			</p>
		</div>

		<div class="content-section">
			<h2>4. Webanalyse mit Databuddy</h2>
			<p>
				Wir verwenden Databuddy, um das Nutzungsverhalten auf dieser Website anonymisiert zu
				analysieren. Die Daten werden ausschließlich zur Verbesserung des Angebots genutzt und nicht
				an Dritte weitergegeben. Es werden keine Cookies gesetzt und keine personenbezogenen Daten
				gespeichert.
			</p>
			<p>
				Weitere Informationen finden Sie in der <a
					href="https://www.databuddy.cc/privacy"
					target="_blank"
					rel="noopener noreferrer"
					class="external-link">Databuddy Datenschutzerklärung</a
				>.
			</p>
		</div>

		<div class="content-section">
			<h2>5. Rechte der Nutzer</h2>
			<p>
				Sie haben das Recht auf Auskunft, Berichtigung oder Löschung Ihrer gespeicherten Daten.
			Kontaktieren Sie uns dazu unter j_burzinski@proton.me.
			</p>
		</div>

		<div class="content-section">
			<h2>6. Änderungen</h2>
			<p>Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen.</p>
		</div>

		<div class="content-section">
			<h2>Letztes Update</h2>
			<p>28.06.2025</p>
		</div>
	</div>
</div>

<style>
	.datenschutz-wrapper {
		margin-top: -15vh;
		display: flex;
		justify-content: center;
		min-height: 100vh;
		animation: fadeIn 0.8s ease-out forwards;
	}

	.datenschutz-container {
		max-width: 800px;
		width: 100%;
	}

	.title {
		font-size: 3rem;
		text-align: center;
		margin-bottom: 3rem;
		letter-spacing: 2px;
	}

	.title-color-gradient {
		/* Remove gradient text; use normal text color */
		color: inherit;
	}

	.content-section {
		background: rgba(255, 255, 255, 0.03);
		border-radius: 15px;
		padding: 2rem;
		backdrop-filter: blur(10px);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
	}

	.content-section:last-child {
		margin-bottom: 0;
	}

	h2 {
		color: #bbbbbb;
		margin-top: 2rem;
		margin-bottom: 1rem;
		font-size: 1.5rem;
	}

	h2:first-child {
		margin-top: 0;
	}

	p {
		color: #ffffff;
		line-height: 1.6;
		margin: 0.5rem 0;
		font-size: 1.1rem;
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
			transform: translateY(20px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		.datenschutz-container {
			margin-top: 2vh;
		}

		.title {
			font-size: 2rem;
			letter-spacing: 1px;
		}

		.content-section {
			padding: 1.5rem;
		}
	}

	@media (max-width: 480px) {
		.title {
			font-size: 1.5rem;
			letter-spacing: 0.5px;
		}
	}

	.external-link {
		color: #60d394;
		text-decoration: underline;
		transition: color 0.2s;
		word-break: break-all;
	}
	.external-link:hover,
	.external-link:focus {
		color: #3fa7d6;
		outline: none;
	}
</style>
