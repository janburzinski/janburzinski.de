/** 23_500_000_000 → "23.5B", 362_000_000 → "362M", 455_000 → "455k". */
export function formatTokens(n: number): string {
	if (n >= 999.5e9) return `${trim(n / 1e12)}T`;
	if (n >= 999.5e6) return `${trim(n / 1e9)}B`;
	if (n >= 999.5e3) return `${trim(n / 1e6)}M`;
	if (n >= 1e3) return `${trim(n / 1e3)}k`;
	return String(Math.round(n));
}

function trim(n: number): string {
	// One decimal, but drop a trailing ".0" so "23.0B" reads as "23B".
	return n.toFixed(n < 100 ? 1 : 0).replace(/\.0$/, '');
}

export function formatUsd(n: number): string {
	return n.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 2
	});
}

/** "anthropic/claude-opus-4-8" → "opus 4.8", "anthropic/claude-haiku-4-5" → "haiku 4.5". */
export function prettyModel(model: string | null | undefined): string {
	if (!model) return 'unknown';
	const bare = model.includes('/') ? model.slice(model.lastIndexOf('/') + 1) : model;
	const name = bare.replace(/^claude-/, '');
	// Split the trailing version segments (opus-4-8 → family "opus", version "4.8").
	const parts = name.split('-');
	const versionStart = parts.findIndex((p) => /^\d+$/.test(p));
	if (versionStart === -1) return name.replace(/-/g, ' ');
	const family = parts.slice(0, versionStart).join(' ');
	// Take the short numeric segments as the version (e.g. 4, 8) and stop at anything else — a long
	// date suffix like "20251001" or a word suffix like "codex" isn't part of the version.
	const version: string[] = [];
	for (const p of parts.slice(versionStart)) {
		if (/^\d+$/.test(p) && p.length <= 3) version.push(p);
		else break;
	}
	return `${family} ${version.join('.')}`.trim();
}

/** UTC "2026-06-17" → "jun 17, 2026". */
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
