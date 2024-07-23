<script lang="ts">
	import { T } from '@threlte/core';

	export let center_of_stock: [number, number, number];
	export let scaled_stock_width: number;
	export let scaled_stock_height: number;
	export let scaled_stock_depth: number;
</script>

<T.Mesh position={center_of_stock}>
	<T.BoxGeometry args={[scaled_stock_width, scaled_stock_height, scaled_stock_depth]} />
	<T.MeshStandardMaterial color={'white'} transparent={true} opacity={0.6} />
</T.Mesh>
