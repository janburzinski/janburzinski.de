export function formatTokens(n: number): string {
	if (n >= 999.5e9) return `${trim(n / 1e12)}T`;
	if (n >= 999.5e6) return `${trim(n / 1e9)}B`;
	if (n >= 999.5e3) return `${trim(n / 1e6)}M`;
	if (n >= 1e3) return `${trim(n / 1e3)}k`;
	return String(Math.round(n));
}

function trim(n: number): string {
	return n.toFixed(n < 100 ? 1 : 0).replace(/\.0$/, '');
}

/** "anthropic/claude-opus-4-8" → "opus 4.8", "anthropic/claude-haiku-4-5" → "haiku 4.5". */
export function prettyModel(model: string | null | undefined): string {
	if (!model) return 'unknown';
	const bare = model.includes('/') ? model.slice(model.lastIndexOf('/') + 1) : model;
	const name = bare.replace(/^claude-/, '');
	const parts = name.split('-');
	const versionStart = parts.findIndex((p) => /^\d+$/.test(p));
	if (versionStart === -1) return name.replace(/-/g, ' ');
	const family = parts.slice(0, versionStart).join(' ');
	// Ignore long date suffixes and non-numeric provider suffixes.
	const version: string[] = [];
	for (const p of parts.slice(versionStart)) {
		if (/^\d+$/.test(p) && p.length <= 3) version.push(p);
		else break;
	}
	return `${family} ${version.join('.')}`.trim();
}

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
