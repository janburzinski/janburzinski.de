<nav class="navbar">
	<h1><a href="/" class="navbar-title">jan burzinski</a></h1>
	<hr class="navbar-divider" />

	<div class="social-icons">
		<a href="https://instagram.com/janderberliner" target="_blank" aria-label="Instagram">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				width="24"
				height="24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M7.5 2.25h9a5.25 5.25 0 015.25 5.25v9a5.25 5.25 0 01-5.25 5.25h-9a5.25 5.25 0 01-5.25-5.25v-9A5.25 5.25 0 017.5 2.25z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M16.125 11.625A4.125 4.125 0 1112 7.5a4.125 4.125 0 014.125 4.125z"
				/>
				<path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75h.008v.008h-.008z" />
			</svg>
		</a>
		<a href="https://github.com/janburzinski" target="_blank" aria-label="GitHub">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				width="24"
				height="24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75 0 4.31 2.788 7.98 6.652 9.271.487.09.664-.211.664-.47v-1.663c-2.554.555-3.087-1.23-3.087-1.23-.443-1.127-1.082-1.428-1.082-1.428-.885-.605.067-.593.067-.593 1.011.071 1.544 1.04 1.544 1.04.87 1.49 2.28 1.059 2.835.81.089-.631.34-1.06.618-1.304-2.043-.233-4.187-1.022-4.187-4.549 0-1.005.36-1.825.951-2.467-.095-.233-.413-1.17.092-2.438 0 0 .777-.249 2.55.946a8.862 8.862 0 012.321-.312c.788.004 1.582.107 2.321.312 1.772-1.195 2.549-.946 2.549-.946.506 1.268.188 2.205.093 2.438.592.642.951 1.462.951 2.467 0 3.536-2.147 4.312-4.193 4.541.348.3.657.896.657 1.805v2.678c0 .26.177.561.67.467C18.96 20.004 21.75 16.34 21.75 12c0-5.385-4.365-9.75-9.75-9.75z"
				/>
			</svg>
		</a>
	</div>
</nav>

<style>
	.navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0rem 2rem;
		color: #f4f4f4;
		font-size: 0.8rem;
	}

	.navbar-title {
		text-decoration: none;
		color: #fff;
	}

	.navbar-divider {
		width: 75%;
		border: none;
		border-top: 1px solid #797979;
		margin: 0;
	}

	.social-icons {
		display: flex;
		gap: 2.3rem;
		position: relative;
		z-index: 10;
	}

	.social-icons a {
		display: inline-block;
		padding: 8px;
		text-decoration: none;
		color: #f4f4f4;
		transition: color 0.3s ease;
	}

	.social-icons a svg {
		width: 28px;
		height: 28px;
		stroke: #f4f4f4;
		pointer-events: none;
	}
</style>
