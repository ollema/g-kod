<script lang="ts">
	import { CanvasTexture } from 'three';
	import { StockGeometry } from './stock_geometry';

	import { T } from '@threlte/core';

	export let center_of_stock: [number, number, number];
	export let scaled_stock_width: number;
	export let scaled_stock_height: number;
	export let scaled_stock_depth: number;
	export let height_map: CanvasTexture;
</script>

<T
	is={StockGeometry}
	args={[
		scaled_stock_width,
		scaled_stock_depth,
		scaled_stock_height,
		200,
		200,
		height_map,
		-scaled_stock_depth
	]}
	position={center_of_stock}
	rotation.x={-Math.PI / 2}
/>
