<script lang="ts">
	import type { HarnessUsage } from '$lib/usage';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { CELL, harnessColor, paintCell, paintDonut, type DonutSegment } from '$lib/dither/paint';
	import { formatTokens, prettyHarness } from '$lib/format';

	let { harnesses, size = 168 }: { harnesses: HarnessUsage[]; size?: number } = $props();

	const TAU = Math.PI * 2;
	// Trim each slice edge so neighbours read as separate wedges instead of one continuous ring.
	const GAP = 0.05;
	// Floor a wedge keeps after trimming, so a harness with a tiny share is still a visible sliver
	// rather than collapsing to nothing (real data is dominated by one or two harnesses).
	const MIN_ARC = 0.04;

	// Weighted by token volume. Harnesses that round to 0% are dropped so the donut and legend stay
	// clean; angles and percentages are then taken over the visible share (colours stay tied to each
	// harness's overall rank, so hiding the tail never reshuffles them).
	const total = $derived(harnesses.reduce((sum, h) => sum + h.tokens, 0));
	const slices = $derived.by(() => {
		if (total <= 0) return [];
		const visible = harnesses.filter((h) => Math.round((h.tokens / total) * 100) >= 1);
		const visTotal = visible.reduce((sum, h) => sum + h.tokens, 0) || 1;
		let cursor = 0; // paintDonut's angle 0 is 12 o'clock, so slices start at the top
		return visible.map((h) => {
			const span = (h.tokens / visTotal) * TAU;
			const trim = visible.length > 1 ? Math.min(GAP, Math.max(0, (span - MIN_ARC) / 2)) : 0;
			const start = cursor;
			cursor += span;
			return {
				harness: h.harness,
				tokens: h.tokens,
				share: h.tokens / visTotal,
				color: harnessColor(h.harness, harnesses.indexOf(h)),
				start: start + trim,
				end: cursor - trim
			};
		});
	});

	let hover = $state<number | null>(null);
	const active = $derived(hover != null ? slices[hover] : (slices[0] ?? null));

	let canvas = $state<HTMLCanvasElement>();
	let bloomCanvas = $state<HTMLCanvasElement>();

	// Per-slice highlight intensity (1 = active, 0 = idle, -1 = dimmed by another slice's hover),
	// tweened so moving the pointer between slices cross-fades the brighten/dim instead of snapping.
	const prefersReduced =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const intensity = new Tween<number[]>([], {
		duration: prefersReduced ? 0 : 180,
		easing: cubicOut
	});

	function paint(anim: number[]) {
		if (!canvas) return;
		const px = Math.round(size / CELL);
		if (canvas.width !== px || canvas.height !== px) {
			canvas.width = px;
			canvas.height = px;
		}
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, px, px);

		const cx = px / 2;
		const cy = px / 2;
		const rOuter = px * 0.47;
		const rInner = rOuter * 0.6;
		const segments: DonutSegment[] = slices.map((s, i) => ({
			color: s.color,
			start: s.start,
			end: s.end,
			intensity: anim[i] ?? 0
		}));
		paintDonut(ctx, cx, cy, rOuter, rInner, segments);

		if (bloomCanvas) {
			if (bloomCanvas.width !== px || bloomCanvas.height !== px) {
				bloomCanvas.width = px;
				bloomCanvas.height = px;
			}
			const bctx = bloomCanvas.getContext('2d');
			if (bctx) {
				bctx.clearRect(0, 0, px, px);
				bctx.drawImage(canvas, 0, 0);
			}
		}
	}

	// Retarget on hover (animate), or snap when the slice set itself changes so counts never mismatch.
	$effect(() => {
		const targets = slices.map((_, i) => (hover == null ? 0 : hover === i ? 1 : -1));
		intensity.set(
			targets,
			intensity.current.length === targets.length ? undefined : { duration: 0 }
		);
	});

	// Repaint on every tween frame (and whenever the slices or size change).
	$effect(() => {
		paint(intensity.current);
	});

	function onMove(e: PointerEvent) {
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const dx = e.clientX - rect.left - rect.width / 2;
		const dy = e.clientY - rect.top - rect.height / 2;
		const dist = Math.hypot(dx, dy) / (rect.width / 2);
		if (dist > 0.94 || dist < 0.56) {
			hover = null;
			return;
		}
		let ang = Math.atan2(dy, dx) + Math.PI / 2;
		if (ang < 0) ang += TAU;
		const idx = slices.findIndex((s) => ang >= s.start - GAP && ang < s.end + GAP);
		hover = idx === -1 ? null : idx;
	}

	// Small dithered legend swatch, same engine as the graph.
	function swatch(node: HTMLCanvasElement, color: [number, number, number]) {
		const draw = (c: [number, number, number]) => {
			const s = 8;
			node.width = s;
			node.height = s;
			const ctx = node.getContext('2d');
			if (!ctx) return;
			ctx.clearRect(0, 0, s, s);
			paintCell(ctx, 0, 0, s, c, 0.85, 0);
		};
		draw(color);
		return { update: draw };
	}
</script>

{#if slices.length}
	<div class="harness">
		<div class="ring" style="width: {size}px; height: {size}px">
			<canvas
				bind:this={canvas}
				class="crisp"
				style="width: {size}px; height: {size}px"
				onpointermove={onMove}
				onpointerleave={() => (hover = null)}
			></canvas>
			<canvas
				bind:this={bloomCanvas}
				class="bloom"
				style="width: {size}px; height: {size}px"
				aria-hidden="true"
			></canvas>
			{#if active}
				<div class="center">
					<span class="pct">{Math.round(active.share * 100)}%</span>
					<span class="name">{prettyHarness(active.harness)}</span>
				</div>
			{/if}
		</div>

		<ul class="legend">
			{#each slices as s, i (s.harness)}
				<li
					class:dim={hover != null && hover !== i}
					onpointerenter={() => (hover = i)}
					onpointerleave={() => (hover = null)}
				>
					<canvas class="chip" use:swatch={s.color} aria-hidden="true"></canvas>
					<span class="label">{prettyHarness(s.harness)}</span>
					<span class="value">{Math.round(s.share * 100)}%</span>
					<span class="count">{formatTokens(s.tokens)}</span>
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	.harness {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.ring {
		position: relative;
		flex-shrink: 0;
	}

	canvas.crisp {
		display: block;
		image-rendering: pixelated;
		cursor: crosshair;
	}

	.bloom {
		position: absolute;
		inset: 0;
		pointer-events: none;
		image-rendering: auto;
		filter: blur(5px) brightness(1.35) saturate(1.5);
		mix-blend-mode: plus-lighter;
		opacity: 0.55;
	}

	.center {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		gap: 1px;
	}

	.pct {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}

	.name {
		font-size: 0.6875rem;
		color: var(--text-muted);
	}

	/* One shared grid for every row (via subgrid) so the %/token columns line up across rows
	   instead of each li sizing its own columns to its own token width. */
	.legend {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: auto 1fr auto auto;
		column-gap: 0.5rem;
		row-gap: 0.4rem;
		align-content: start;
		min-width: 150px;
		flex: 1;
	}

	.legend li {
		display: grid;
		grid-template-columns: subgrid;
		grid-column: 1 / -1;
		align-items: center;
		font-size: 0.8125rem;
		transition: opacity 0.12s ease;
	}

	.legend li.dim {
		opacity: 0.4;
	}

	.chip {
		width: 8px;
		height: 8px;
		image-rendering: pixelated;
	}

	.label {
		color: var(--text-secondary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.value {
		color: var(--text-primary);
		font-variant-numeric: tabular-nums;
		text-align: right;
	}

	.count {
		color: var(--text-muted);
		font-variant-numeric: tabular-nums;
		min-width: 3ch;
		text-align: right;
	}
</style>
