<script lang="ts">
	import { onMount } from 'svelte';

	export let href: string;

	let mounted = false;
	let hovering = false;
	let interacted = false;
	let loaded = false;
	let linkEl: HTMLAnchorElement;
	let popoverLeft = 0;
	let popoverTop = 0;
	let enterTimer: ReturnType<typeof setTimeout> | null = null;

	const POPOVER_WIDTH = 280;
	const POPOVER_HEIGHT = 175;
	const GAP = 10;
	const MARGIN = 12;

	$: previewUrl = `https://api.microlink.io/?url=${encodeURIComponent(href)}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1280&viewport.height=800&screenshot.type=webp`;

	onMount(() => {
		mounted = true;
	});

	function position() {
		if (!linkEl) return;
		const rect = linkEl.getBoundingClientRect();
		let left = rect.left + rect.width / 2 - POPOVER_WIDTH / 2;
		const maxLeft = window.innerWidth - POPOVER_WIDTH - MARGIN;
		if (left < MARGIN) left = MARGIN;
		if (left > maxLeft) left = maxLeft;

		let top = rect.top - POPOVER_HEIGHT - GAP;
		if (top < MARGIN) top = rect.bottom + GAP;

		popoverLeft = left;
		popoverTop = top;
	}

	function enter() {
		if (enterTimer) clearTimeout(enterTimer);
		enterTimer = setTimeout(() => {
			position();
			interacted = true;
			hovering = true;
		}, 60);
	}

	function leave() {
		if (enterTimer) {
			clearTimeout(enterTimer);
			enterTimer = null;
		}
		hovering = false;
	}

	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return {
			destroy() {
				node.remove();
			}
		};
	}
</script>

<a
	bind:this={linkEl}
	{href}
	target="_blank"
	rel="noopener noreferrer"
	on:mouseenter={enter}
	on:mouseleave={leave}
	on:focus={enter}
	on:blur={leave}
><slot /></a>

{#if mounted}
	<span
		use:portal
		class="popover"
		class:visible={hovering}
		style="left: {popoverLeft}px; top: {popoverTop}px; width: {POPOVER_WIDTH}px; height: {POPOVER_HEIGHT}px;"
		aria-hidden="true"
	>
		{#if interacted}
			<span class="skeleton" class:hidden={loaded}></span>
			<img
				class:loaded
				src={previewUrl}
				alt=""
				on:load={() => (loaded = true)}
			/>
		{/if}
	</span>
{/if}

<style>
	a {
		color: var(--text-primary);
		text-decoration: none;
		transition: opacity 0.15s ease;
	}

	@media (hover: hover) and (pointer: fine) {
		a:hover {
			opacity: 0.5;
		}
	}

	.popover {
		position: fixed;
		border-radius: 10px;
		overflow: hidden;
		background: color-mix(in srgb, var(--text-primary) 8%, transparent);
		border: 1px solid color-mix(in srgb, var(--text-primary) 14%, transparent);
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.08),
			0 10px 30px rgba(0, 0, 0, 0.25);
		pointer-events: none;
		z-index: 50;
		opacity: 0;
		transform: translateY(4px);
		filter: blur(8px);
		transition:
			opacity 220ms var(--ease-out),
			transform 220ms var(--ease-out),
			filter 220ms var(--ease-out);
	}

	.popover.visible {
		opacity: 1;
		transform: translateY(0);
		filter: blur(0);
	}

	.popover img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top center;
		opacity: 0;
		transition: opacity 200ms var(--ease-out);
	}

	.popover img.loaded {
		opacity: 1;
	}

	.skeleton {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(
				90deg,
				transparent 0%,
				color-mix(in srgb, var(--text-primary) 14%, transparent) 50%,
				transparent 100%
			),
			color-mix(in srgb, var(--text-primary) 7%, transparent);
		background-size: 200% 100%, 100% 100%;
		background-repeat: no-repeat;
		background-position: -50% 0, 0 0;
		animation: skeleton-shimmer 1.2s linear infinite;
		transition: opacity 200ms var(--ease-out);
	}

	.skeleton.hidden {
		opacity: 0;
	}

	@keyframes skeleton-shimmer {
		from {
			background-position: -50% 0, 0 0;
		}
		to {
			background-position: 150% 0, 0 0;
		}
	}

	@media (hover: none), (pointer: coarse) {
		.popover {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.popover {
			transition-duration: 100ms;
			filter: none;
		}
		.skeleton {
			animation: none;
		}
	}
</style>
