<script lang="ts">
	let stats = {
		totalPosts: 12,
		totalViews: 3429,
		totalComments: 85,
		monthlyGrowth: 12.5
	};

	let recentPosts = [
		{
			id: 1,
			title: 'Building Modern Web Applications',
			status: 'published',
			views: 234,
			publishedAt: '2024-01-15',
			slug: 'building-modern-web-apps'
		},
		{
			id: 2,
			title: 'Understanding TypeScript',
			status: 'draft',
			views: 0,
			publishedAt: null,
			slug: 'understanding-typescript'
		},
		{
			id: 3,
			title: 'SvelteKit Best Practices',
			status: 'published',
			views: 189,
			publishedAt: '2024-01-10',
			slug: 'sveltekit-best-practices'
		}
	];

	function formatDate(dateString: string | null) {
		if (!dateString) return 'Draft';
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function getStatusColor(status: string) {
		return status === 'published' ? 'status-published' : 'status-draft';
	}
</script>

<svelte:head>
	<title>Dashboard - Admin</title>
	<meta name="description" content="Admin Dashboard" />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="dashboard">
	<div class="dashboard-header">
		<h1 class="dashboard-title">Dashboard</h1>
		<div class="dashboard-actions">
			<button class="btn btn-primary">New Post</button>
		</div>
	</div>

	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-label">Total Posts</div>
			<div class="stat-value">{stats.totalPosts}</div>
		</div>
		<div class="stat-card">
			<div class="stat-label">Total Views</div>
			<div class="stat-value">{stats.totalViews.toLocaleString()}</div>
		</div>
		<div class="stat-card">
			<div class="stat-label">Comments</div>
			<div class="stat-value">{stats.totalComments}</div>
		</div>
		<div class="stat-card">
			<div class="stat-label">Growth</div>
			<div class="stat-value">
				+{stats.monthlyGrowth}%
				<span class="stat-trend">↗</span>
			</div>
		</div>
	</div>

	<div class="dashboard-section">
		<div class="section-header">
			<h2 class="section-title">Recent Posts</h2>
			<a href="/admin/posts" class="section-link">View all</a>
		</div>
		
		<div class="posts-table">
			<div class="table-header">
				<div class="th">Title</div>
				<div class="th">Status</div>
				<div class="th">Views</div>
				<div class="th">Published</div>
				<div class="th">Actions</div>
			</div>
			
			{#each recentPosts as post}
				<div class="table-row">
					<div class="td">
						<div class="post-title">{post.title}</div>
						<div class="post-slug">/{post.slug}</div>
					</div>
					<div class="td">
						<span class="status {getStatusColor(post.status)}">
							{post.status}
						</span>
					</div>
					<div class="td">{post.views}</div>
					<div class="td">{formatDate(post.publishedAt)}</div>
					<div class="td">
						<div class="actions">
							<button class="action-btn">Edit</button>
							<button class="action-btn">View</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="dashboard-section">
		<div class="section-header">
			<h2 class="section-title">Analytics</h2>
		</div>
		
		<div class="analytics-placeholder">
			<div class="chart-placeholder">
				<div class="chart-title">Page Views (Last 30 days)</div>
				<div class="chart-mock">
					<div class="chart-bar" style="height: 20%"></div>
					<div class="chart-bar" style="height: 35%"></div>
					<div class="chart-bar" style="height: 15%"></div>
					<div class="chart-bar" style="height: 60%"></div>
					<div class="chart-bar" style="height: 45%"></div>
					<div class="chart-bar" style="height: 80%"></div>
					<div class="chart-bar" style="height: 25%"></div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.dashboard {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		background: #ffffff;
		min-height: 100vh;
	}

	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e1e1e1;
	}

	.dashboard-title {
		font-size: 2rem;
		font-weight: 600;
		color: #000000;
		margin: 0;
	}

	.dashboard-actions {
		display: flex;
		gap: 0.75rem;
	}

	.btn {
		padding: 0.5rem 1rem;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		border: none;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.btn-primary {
		background: #000000;
		color: #ffffff;
	}

	.btn-primary:hover {
		background: #1f2937;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background: #ffffff;
		border: 1px solid #e1e1e1;
		border-radius: 8px;
		padding: 1.5rem;
		transition: border-color 0.2s ease;
	}

	.stat-card:hover {
		border-color: #d1d5db;
	}

	.stat-label {
		font-size: 0.875rem;
		color: #666666;
		margin-bottom: 0.5rem;
	}

	.stat-value {
		font-size: 2rem;
		font-weight: 600;
		color: #000000;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.stat-trend {
		font-size: 1rem;
		color: #10b981;
	}

	.dashboard-section {
		margin-bottom: 2rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.section-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #000000;
		margin: 0;
	}

	.section-link {
		color: #666666;
		text-decoration: none;
		font-size: 0.875rem;
		transition: color 0.2s ease;
	}

	.section-link:hover {
		color: #000000;
	}

	.posts-table {
		background: #ffffff;
		border: 1px solid #e1e1e1;
		border-radius: 8px;
		overflow: hidden;
	}

	.table-header {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
		gap: 1rem;
		padding: 1rem;
		background: #f9fafb;
		border-bottom: 1px solid #e1e1e1;
	}

	.th {
		font-size: 0.75rem;
		font-weight: 600;
		color: #666666;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.table-row {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
		gap: 1rem;
		padding: 1rem;
		border-bottom: 1px solid #f3f4f6;
		align-items: center;
	}

	.table-row:last-child {
		border-bottom: none;
	}

	.table-row:hover {
		background: #f9fafb;
	}

	.td {
		font-size: 0.875rem;
		color: #000000;
	}

	.post-title {
		font-weight: 500;
		margin-bottom: 0.25rem;
	}

	.post-slug {
		font-size: 0.75rem;
		color: #666666;
	}

	.status {
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: capitalize;
	}

	.status-published {
		background: #d1fae5;
		color: #065f46;
	}

	.status-draft {
		background: #fef3c7;
		color: #92400e;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
	}

	.action-btn {
		padding: 0.25rem 0.5rem;
		background: none;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		color: #666666;
		font-size: 0.75rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.action-btn:hover {
		border-color: #000000;
		color: #000000;
	}

	.analytics-placeholder {
		background: #ffffff;
		border: 1px solid #e1e1e1;
		border-radius: 8px;
		padding: 1.5rem;
	}

	.chart-placeholder {
		text-align: center;
	}

	.chart-title {
		font-size: 0.875rem;
		color: #666666;
		margin-bottom: 1rem;
	}

	.chart-mock {
		display: flex;
		align-items: end;
		justify-content: center;
		gap: 0.5rem;
		height: 100px;
	}

	.chart-bar {
		width: 20px;
		background: #e1e1e1;
		border-radius: 2px;
		transition: background-color 0.2s ease;
	}

	.chart-bar:hover {
		background: #d1d5db;
	}

	@media (max-width: 768px) {
		.dashboard {
			padding: 1rem;
		}

		.dashboard-header {
			flex-direction: column;
			align-items: stretch;
			gap: 1rem;
		}

		.stats-grid {
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		}

		.table-header,
		.table-row {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}

		.th,
		.td {
			display: flex;
			justify-content: space-between;
		}

		.th::before,
		.td::before {
			content: attr(data-label);
			font-weight: 600;
		}
	}
</style>