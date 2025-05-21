<svelte:head>
	<title>impressum - jan burzinski</title>
</svelte:head>

<div class="impressum-wrapper">
	<div class="impressum-container">
		<h1 class="title">
			<span class="title-color-gradient">Impressum</span>
		</h1>

		<div class="content-section">
			<h2>Angaben gemäß § 5 TMG</h2>
			<p>Jan Burzinski</p>
			<p>Burgunder Str. 1</p>
			<p>14197 Berlin</p>

			<h2>Kontakt</h2>
			<p>E-Mail: jan@burzinski.de</p>

			<h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
			<p>Jan Burzinski</p>
			<p>Burgunder Str. 1</p>
			<p>14197 Berlin</p>
		</div>

		<div class="content-section">
			<h2>Letztes Update</h2>
			<p>20.05.2025</p>
		</div>
	</div>
</div>

<style>
	.impressum-wrapper {
		margin-top: -15vh;
		display: flex;
		justify-content: center;
		min-height: 100vh;
		animation: fadeIn 0.8s ease-out forwards;
	}

	.impressum-container {
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
		background: linear-gradient(to right, #60d394, #3fa7d6, #e07a5f);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
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
		.impressum-container {
			margin-top: 2vh;
		}

		.title {
			font-size: 2.5rem;
		}

		.content-section {
			padding: 1.5rem;
		}
	}
</style>
