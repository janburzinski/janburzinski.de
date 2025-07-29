<script lang="ts">
	let username = '';
	let password = '';
	let isLoading = false;
	let errorMessage = '';

	async function handleLogin() {
		if (!username || !password) {
			errorMessage = 'Bitte fülle alle Felder aus.';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			// TODO: Implement actual authentication logic here
			// For now, this is a placeholder that simulates a login attempt
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Simulate authentication check
			if (username === 'admin' && password === 'password') {
				// Redirect to admin dashboard or set authentication state
				console.log('Login successful');
			} else {
				errorMessage = 'Ungültige Anmeldedaten.';
			}
		} catch (error) {
			errorMessage = 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.';
		} finally {
			isLoading = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleLogin();
		}
	}
</script>

<svelte:head>
	<title>Admin Login - Jan Burzinski</title>
	<meta name="description" content="Admin-Bereich Login" />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="login-container">
	<div class="login-card">
		<div class="login-header">
			<h1 class="login-title">Sign in to Admin</h1>
			<p class="login-subtitle">Welcome back</p>
		</div>

		<form class="login-form" on:submit|preventDefault={handleLogin}>
			<div class="form-group">
				<label for="username" class="form-label">Username</label>
				<input
					type="text"
					id="username"
					bind:value={username}
					class="form-input"
					placeholder="Enter your username"
					on:keypress={handleKeyPress}
					disabled={isLoading}
					required
				/>
			</div>

			<div class="form-group">
				<label for="password" class="form-label">Password</label>
				<input
					type="password"
					id="password"
					bind:value={password}
					class="form-input"
					placeholder="Enter your password"
					on:keypress={handleKeyPress}
					disabled={isLoading}
					required
				/>
			</div>

			{#if errorMessage}
				<div class="error-message">
					{errorMessage}
				</div>
			{/if}

			<button type="submit" class="login-button" disabled={isLoading}>
				{#if isLoading}
					<span class="loading-spinner"></span>
					Signing in...
				{:else}
					Continue
				{/if}
			</button>
		</form>

		<div class="login-footer">
			<a href="/" class="back-link">← Back to homepage</a>
		</div>
	</div>
</div>

<style>
	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: 1rem;
		background: #ffffff;
	}

	.login-card {
		background: #ffffff;
		border: 1px solid #e1e1e1;
		border-radius: 8px;
		padding: 2rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		max-width: 400px;
		width: 100%;
	}

	.login-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.login-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: #000000;
		margin-bottom: 0.5rem;
		line-height: 1.2;
	}

	.login-subtitle {
		font-size: 0.875rem;
		color: #666666;
		margin: 0;
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-label {
		font-size: 0.875rem;
		color: #000000;
		font-weight: 500;
	}

	.form-input {
		padding: 0.75rem;
		background: #ffffff;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		color: #000000;
		font-size: 0.875rem;
		transition: border-color 0.2s ease;
		font-family: inherit;
	}

	.form-input::placeholder {
		color: #9ca3af;
	}

	.form-input:focus {
		outline: none;
		border-color: #000000;
		box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
	}

	.form-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: #f9fafb;
	}

	.error-message {
		background: #fef2f2;
		border: 1px solid #fecaca;
		border-radius: 6px;
		padding: 0.75rem;
		color: #dc2626;
		font-size: 0.875rem;
		text-align: center;
	}

	.login-button {
		padding: 0.75rem 1rem;
		background: #000000;
		border: none;
		border-radius: 6px;
		color: #ffffff;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.login-button:hover:not(:disabled) {
		background: #1f2937;
	}

	.login-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: #000000;
	}

	.loading-spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top: 2px solid #ffffff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.login-footer {
		margin-top: 1.5rem;
		text-align: center;
	}

	.back-link {
		color: #666666;
		text-decoration: none;
		font-size: 0.875rem;
		transition: color 0.2s ease;
	}

	.back-link:hover {
		color: #000000;
	}

	@media (max-width: 480px) {
		.login-container {
			padding: 1rem;
		}

		.login-card {
			padding: 1.5rem;
		}

		.login-title {
			font-size: 1.25rem;
		}
	}
</style>
