<script lang="ts">
	import { onMount } from 'svelte';

	let width: number;
	let height: number;

	let mouseX: number = 0;
	let mouseY: number = 0;

	let canvas: HTMLCanvasElement | null = null;
	let ctx: CanvasRenderingContext2D | null = null;

	let grd: CanvasGradient | null = null;
	let imageData: ImageData | null = null;

	onMount(() => {
		width = window.innerWidth;
		height = window.innerHeight;

		canvas = document.createElement('canvas');
		if (!canvas) return;

		canvas.width = width;
		canvas.height = height;
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		canvas.style.position = 'fixed';
		canvas.style.top = '0px';
		canvas.style.left = '0px';
		canvas.style.pointerEvents = 'none';
		canvas.style.zIndex = '-1';

		document.body.appendChild(canvas);
		ctx = canvas.getContext('2d');

		if (!ctx) return;

		ctx.fillStyle = 'rgb(50, 20, 80)';
		ctx.fillRect(0, 0, width, height);

		imageData = ctx.getImageData(0, 0, width, height);

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('touchmove', handleTouchMove);
	});

	function updateBackground(): void {
		if (!ctx || !canvas || !imageData) return;
		const radius = 150;

		ctx.putImageData(imageData, 0, 0);

		grd = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, radius);
		grd.addColorStop(0, 'rgba(138, 116, 165, 0.3)');
		grd.addColorStop(1, 'rgba(50, 20, 80, 0)');

		ctx.fillStyle = grd;
		ctx.beginPath();
		ctx.arc(mouseX, mouseY, radius, 0, 2 * Math.PI);
		ctx.fill();

		imageData = ctx.getImageData(0, 0, width, height);
	}

	function handleMouseMove(event: MouseEvent): void {
		mouseX = event.clientX;
		mouseY = event.clientY;
		updateBackground();
	}

	function handleTouchMove(event: TouchEvent): void {
		event.preventDefault();
		if (event.touches.length > 0) {
			mouseX = event.touches[0].clientX;
			mouseY = event.touches[0].clientY;
			updateBackground();
		}
	}

	$: if (width && height && canvas && ctx && imageData) {
		canvas.width = width;
		canvas.height = height;
		imageData = ctx.getImageData(0, 0, width, height);
		updateBackground();
	}
</script>

<canvas bind:this={canvas}></canvas>
