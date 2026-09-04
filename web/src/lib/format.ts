export function formatDay(date: string): string {
	const d = new Date(`${date}T00:00:00Z`);
	return d
		.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			timeZone: 'UTC'
		})
		.toLowerCase();
}

export function formatDayShort(date: string): string {
	const d = new Date(`${date}T00:00:00Z`);
	return d
		.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			timeZone: 'UTC'
		})
		.toLowerCase();
}
