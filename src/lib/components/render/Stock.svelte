<script lang="ts">
	import { CanvasTexture } from 'three';
	import { StockGeometry } from './stock_geometry';

	import { T } from '@threlte/core';
	import { onMount } from 'svelte';

	export let center_of_stock: [number, number, number];
	export let scaled_stock_width: number;
	export let scaled_stock_height: number;
	export let scaled_stock_depth: number;

	let canvasH: HTMLCanvasElement;
	let heightMap: CanvasTexture;

	onMount(() => {
		heightMap = new CanvasTexture(canvasH);
		const ctx = canvasH.getContext('2d');

		if (ctx) {
			ctx.fillStyle = 'black';
			ctx.fillRect(0, 0, 256, 256);
			for (let i = 0; i < 100; i++) {
				var x = Math.floor(Math.random() * 255);
				var y = Math.floor(Math.random() * 255);
				var radius = 50;
				let grd = ctx.createRadialGradient(x, y, 1, x, y, radius);
				var h8 = Math.floor(Math.random() * 255);
				grd.addColorStop(0, 'rgb(' + h8 + ',' + h8 + ',' + h8 + ')');
				grd.addColorStop(1, 'transparent');
				ctx.fillStyle = grd;
				ctx.fillRect(0, 0, 256, 256);
			}
			heightMap.needsUpdate = true;
		} else {
			console.error('could not get 2d context');
		}
	});
</script>

<T
	is={StockGeometry}
	args={[scaled_stock_width, scaled_stock_depth, scaled_stock_height, 200, 200, heightMap]}
	position={center_of_stock}
	rotation.x={-Math.PI / 2}
/>

<canvas id="heightmap" width="256" height="256" style="position: absolute;" bind:this={canvasH}>
</canvas>
