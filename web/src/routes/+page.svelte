<svelte:head>
	<title>start - jan burzinski</title>
</svelte:head>

<div class="page-wrapper">
	<div class="profile-container">
		<img
			class="profile-picture"
			src="https://avatars.githubusercontent.com/u/156842394?v=4"
			alt="Jan Burzinski"
		/>
		<h1 class="title-name">
			Hey! Ich bin<br /> <span class="title-color-gradient">Jan Burzinski</span>
		</h1>
		<p class="title-under">
			B.Sc. Informatik Student an der <span style="font-weight:bold;">TU Berlin</span>
		</p>

		<a href="#about-me" class="scroll-down-icon" aria-label="Ueber mich"> ↓ </a>
	</div>
</div>

<div id="about-me" class="about-me-section">
	<p>
		Ich studiere gerade Informatik im ersten Semester an der <span class="highlighted-text"
			>Technischen Universität Berlin</span
		>.
	</p>
	<p>
		Programmieren hat mich schon immer fasziniert, und mittlerweile habe ich mit Sprachen wie <span
			class="highlighted-text">Java, Python, JavaScript (TypeScript), C und Go</span
		>
		gearbeitet. Besonders spannend finde ich die Entwicklung von
		<span class="highlighted-text">Web- und Computeranwendungen</span> sowie das Lösen kniffliger Probleme
		mit kreativen Ansätzen. Neue Technologien auszuprobieren macht mir einfach Spaß!
	</p>
	<p>
		In meiner Freizeit nehme ich gern an <span class="highlighted-text">Hackathons</span> teil,
		tüftle an eigenen Projekten und lese alles Mögliche über
		<span class="highlighted-text">Algorithmen und IT-Themen</span>.
	</p>
	<div class="about-me-content">
		<div class="signature-container">
			<img src="/unterschrift-website.svg" alt="Unterschrift Jan Burzinski" class="signature" />
		</div>
	</div>
</div>

<style>
	.page-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.profile-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		/*		gap: 0.5rem;*/
		margin-top: 15vh;
	}

	.profile-picture {
		width: 220px;
		height: 220px;
		object-fit: cover;
		border-radius: 50%;
		box-shadow:
			0px 0px 5px 2px rgba(94, 230, 161, 0.2),
			0px 0px 8px 3px rgba(58, 167, 241, 0.2),
			0px 0px 10px 4px rgba(153, 153, 164, 0.2),
			0px 0px 12px 5px rgba(230, 138, 117, 0.2);
		animation: slideFromTop 1s ease-out forwards;
	}

	@keyframes slideFromTop {
		0% {
			transform: translateY(-30px);
			opacity: 20%;
		}
		100% {
			transform: translateY(0);
			opacity: 100%;
		}
	}

	.title-name {
		letter-spacing: 2px;
		font-weight: bold;
		font-size: 60px;
		margin-bottom: 0.5rm;
		text-align: center;
		animation: slideFromBottom 1s ease-out forwards;
	}

	.title-color-gradient {
		background: linear-gradient(to right, #60d394, #3fa7d6, #e07a5f);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
	}

	.title-under {
		font-size: 25px;
		color: #bbbbbb;
		margin: 0;
		animation: slideFromBottom 1s ease-out forwards;
	}

	@keyframes slideFromBottom {
		0% {
			transform: translateY(20px);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.scroll-down-icon {
		margin-top: 2rem;
		font-size: 2rem;
		color: #bbbbbb;
		text-decoration: none;
		animation: bounce 2s infinite;
	}

	.scroll-down-icon:hover {
		color: #00a2ff;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(10px);
		}
	}

	.about-me-content {
		max-width: 600px;
		margin: 0 auto;
		text-align: left;
	}

	.about-me-section {
		margin-top: calc(40vh - 160px);
		padding: 2rem;
		text-align: center;
		color: rgb(235, 235, 235);
		transition: margin-top 0.3s ease;
	}

	.about-me-section p {
		text-align: left;
		font-size: 1.2rem;
		line-height: 1.5;
		max-width: 600px;
		margin: 0 auto;
	}

	.highlighted-text {
		font-weight: bold;
		background: linear-gradient(90deg, #8a74a5, #b39bc8, #d3c2e0, #a28ea6);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
	}
	.signature-container {
		margin-top: 1.5rem;
		text-align: left;
		width: fit-content;
	}

	.signature {
		width: 180px;
		height: auto;
		opacity: 0.8;
		display: block;
	}
</style>
