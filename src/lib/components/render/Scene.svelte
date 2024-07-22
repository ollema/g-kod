<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Gizmo, OrbitControls } from '@threlte/extras';
	import { Vector3, Object3D } from 'three';

	Object3D.DEFAULT_UP = new Vector3(0, 0, 1);

	// g-code to be rendered
	// export let code: string;

	// actual stock dimensions
	export let stock_width: number;
	export let stock_height: number;
	export let stock_depth: number;

	// scale factor to fit scene into view
	export let external_scale_factor: number = 5.0;
	const scale_factor =
		(1 / Math.max(stock_width, stock_height, stock_depth)) * external_scale_factor;

	// normalized stock dimensions
	const normalized_stock_width = stock_width * scale_factor;
	const normalized_stock_height = stock_height * scale_factor;
	const normalized_stock_depth = stock_depth * scale_factor;

	// center of stock
	const center_of_stock: [number, number, number] = [
		normalized_stock_width / 2,
		normalized_stock_height / 2,
		-normalized_stock_depth / 2
	];

	// actual tool radius
	export let tool_radius: number;

	// normalized tool radius and tool heights
	const normalized_tool_radius = tool_radius * scale_factor;
	const tool_height = normalized_stock_depth * 3;
	const tool_z_offset = tool_height / 2;

	// orbit controls
	let autoRotate: boolean = false;
	let enableDamping: boolean = true;
	let rotateSpeed: number = 1;
	let zoomToCursor: boolean = false;
	let zoomSpeed: number = 1;
	let minPolarAngle: number = 0;
	let maxPolarAngle: number = Math.PI;
	let enableZoom: boolean = true;

	// actual x, y, z coordinates
	export let x = 0;
	export let y = 0;
	export let z = 0;

	// normalized x, y, z coordinates
	let normalized_x = x * scale_factor;
	let normalized_y = y * scale_factor;
	let normalized_z = z * scale_factor;

	const { start: _start, stop: _pause } = useTask(
		(delta) => {
			if (x < 80) {
				x = Math.min(x + delta * 10, 80);
				normalized_x = x * scale_factor;
			}
		},
		{
			autoStart: false
		}
	);

	function _stop() {
		_pause();

		// go to origin
		x = 0;
		y = 0;
		z = 0;
		normalized_x = x * scale_factor;
		normalized_y = y * scale_factor;
		normalized_z = z * scale_factor;

		// TODO: reverse g-code parsing
	}

	export const start = _start;
	export const pause = _pause;
	export const stop = _stop;

	// $: console.log(code.length);
</script>

<T.PerspectiveCamera makeDefault position={[4, -4, 4]}>
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

<Gizmo horizontalPlacement="left" size={64} center={center_of_stock} />

<T.DirectionalLight position={[5, -10, 20]} />

<T.Mesh position={center_of_stock}>
	<T.BoxGeometry args={[normalized_stock_width, normalized_stock_height, normalized_stock_depth]} />
	<T.MeshStandardMaterial color={'white'} transparent={true} opacity={0.2} />
</T.Mesh>

<T.ArrowHelper
	args={[new Vector3(1, 0, 0), new Vector3(0, 0, 0), 3 * normalized_tool_radius, '#ff3653']}
/>
<T.ArrowHelper
	args={[new Vector3(0, 1, 0), new Vector3(0, 0, 0), 3 * normalized_tool_radius, '#8adb00']}
/>
<T.ArrowHelper
	args={[new Vector3(0, 0, 1), new Vector3(0, 0, 0), 3 * normalized_tool_radius, '#2c8fff']}
/>

<T.Group position.x={normalized_x} position.y={normalized_y} position.z={normalized_z}>
	<T.Mesh rotation.x={Math.PI / 2} position.z={tool_z_offset}>
		<T.CylinderGeometry
			args={[normalized_tool_radius, normalized_tool_radius, normalized_stock_depth * 3, 32]}
		/>
	</T.Mesh>
</T.Group>
