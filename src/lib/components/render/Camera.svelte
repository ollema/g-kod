<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';

	export let center_of_stock: [number, number, number];

	// orbit controls
	export let autoRotate: boolean = false;
	export let enableDamping: boolean = true;
	export let rotateSpeed: number = 1;
	export let zoomToCursor: boolean = false;
	export let zoomSpeed: number = 1;
	export let minPolarAngle: number = 0;
	export let maxPolarAngle: number = Math.PI;
	export let enableZoom: boolean = true;
</script>

<T.PerspectiveCamera makeDefault position={[6, -4, 4]}>
	<OrbitControls
		{enableDamping}
		{autoRotate}
		{rotateSpeed}
		{zoomToCursor}
		{zoomSpeed}
		{minPolarAngle}
		{maxPolarAngle}
		{enableZoom}
		target={center_of_stock}
	/>
</T.PerspectiveCamera>
