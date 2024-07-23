<script lang="ts">
	import { T } from '@threlte/core';

	export let scaled_x: number;
	export let scaled_y: number;
	export let scaled_z: number;

	export let scaled_tool_radius: number;
	export let scale_factor: number;
	export let scaled_stock_depth: number;

	const cutter_length = scaled_stock_depth + 2 * scale_factor;
	const holder_length = 15 * scale_factor;
	const cutter_z_offset = cutter_length / 2;
	const holder_z_offset = cutter_length + holder_length / 2;
</script>

<T.Group position.x={scaled_x} position.y={scaled_y} position.z={scaled_z}>
	<!-- cutter -->
	<T.Mesh rotation.x={Math.PI / 2} position.z={cutter_z_offset}>
		<T.CylinderGeometry args={[scaled_tool_radius, scaled_tool_radius, cutter_length, 32]} />
		<T.MeshStandardMaterial color={'#ffd633'} />
	</T.Mesh>
	<!-- holder -->
	<T.Mesh rotation.x={Math.PI / 2} position.z={holder_z_offset}>
		<T.CylinderGeometry args={[scaled_tool_radius, scaled_tool_radius, holder_length, 32]} />
		<T.MeshStandardMaterial color={'#666666'} />
	</T.Mesh>
</T.Group>
