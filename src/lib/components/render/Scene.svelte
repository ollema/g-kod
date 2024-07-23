<script lang="ts">
	import type { Writable } from 'svelte/store';

	import { T, useTask } from '@threlte/core';
	import { Gizmo, OrbitControls } from '@threlte/extras';
	import { Vector3, Object3D } from 'three';

	import { parse_g_code_line } from '$lib/g_code/parser';

	Object3D.DEFAULT_UP = new Vector3(0, 0, 1);

	// g-code to be rendered
	export let g_code: string[];

	// index of current g-code line being executed
	export let current_line_index = 0;

	// get start position from first G00 command
	let start_position = { x: 0, y: 0, z: 0 };
	g_code.find((line) => {
		const command = parse_g_code_line(line);
		if (command && command.cmd === 'G00') {
			start_position = { x: command.X || 0, y: command.Y || 0, z: command.Z || 0 };
			return true;
		}
		return false;
	});

	// initialize target position to start position
	let target_position = { ...start_position };

	// actual stock dimensions
	export let stock_width: number;
	export let stock_height: number;
	export let stock_depth: number;

	// scale factor to fit scene into view
	export let external_scale_factor: number = 5.0;
	const scale_factor =
		(1 / Math.max(stock_width, stock_height, stock_depth)) * external_scale_factor;

	// scaled stock dimensions
	const scaled_stock_width = stock_width * scale_factor;
	const scaled_stock_height = stock_height * scale_factor;
	const scaled_stock_depth = stock_depth * scale_factor;

	// center of stock
	const center_of_stock: [number, number, number] = [
		scaled_stock_width / 2,
		scaled_stock_height / 2,
		-scaled_stock_depth / 2
	];

	// actual tool radius
	export let tool_radius: number;

	// scaled tool radius and tool heights
	const scaled_tool_radius = tool_radius * scale_factor;
	const cutter_length = scaled_stock_depth / 2 + 2 * scale_factor;
	const holder_length = 15 * scale_factor;
	const cutter_z_offset = cutter_length / 2;
	const holder_z_offset = cutter_length + holder_length / 2;

	export let speed: Writable<number[]>;
	let feed_rate = 2000; // use a sane default feed rate

	// actual x, y, z coordinates
	export let x = start_position.x;
	export let y = start_position.y;
	export let z = start_position.z * 2;

	// scaled x, y, z coordinates
	$: scaled_x = x * scale_factor;
	$: scaled_y = y * scale_factor;
	$: scaled_z = z * scale_factor;

	let stepping: boolean = false;

	const { start: _start, stop: _stop } = useTask(
		(delta) => {
			playing = true;

			if (current_line_index >= g_code.length) {
				_pause();
				return;
			}

			const command = parse_g_code_line(g_code[current_line_index]);

			// move tool if G00 or G01 command
			if (command && (command.cmd === 'G00' || command.cmd === 'G01')) {
				const { cmd, X, Y, Z, F } = command;
				// rapid move
				if (cmd === 'G00') feed_rate = 10000;

				if (F) feed_rate = F;

				target_position = {
					x: X !== undefined ? X : target_position.x,
					y: Y !== undefined ? Y : target_position.y,
					z: Z !== undefined ? Z : target_position.z
				};

				const dx = target_position.x - x;
				const dy = target_position.y - y;
				const dz = target_position.z - z;

				const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
				const move_step = (feed_rate * (Math.pow($speed[0], 2) / 1000) * delta) / 60;

				const normalized_dx = (dx / distance) * move_step;
				const normalized_dy = (dy / distance) * move_step;
				const normalized_dz = (dz / distance) * move_step;

				const new_x = x + normalized_dx;
				x =
					Math.abs(target_position.x - new_x) < Math.abs(normalized_dx) ? target_position.x : new_x;

				const new_y = y + normalized_dy;
				y =
					Math.abs(target_position.y - new_y) < Math.abs(normalized_dy) ? target_position.y : new_y;

				const new_z = z + normalized_dz;
				z =
					Math.abs(target_position.z - new_z) < Math.abs(normalized_dz) ? target_position.z : new_z;

				if (
					!(
						Math.abs(target_position.x - x) < 0.01 &&
						Math.abs(target_position.y - y) < 0.01 &&
						Math.abs(target_position.z - z) < 0.01
					)
				) {
					// target not reached, return without incrementing line index
					return;
				}
			}

			current_line_index++;
			if (stepping) {
				_pause();
				stepping = false;
			}
		},
		{
			autoStart: false
		}
	);

	function _reset() {
		_stop();
		playing = false;

		// go to origin
		x = start_position.x;
		y = start_position.y;
		z = start_position.z * 2;

		// reset g_code line index and target position
		current_line_index = 0;
		target_position = { x: 0, y: 0, z: 0 };
	}

	function _pause() {
		_stop();
		playing = false;
	}

	function _step() {
		stepping = true;
		_start();
	}

	// export functions to control animation playback
	export const reset = _reset;
	export const start = _start;
	export const pause = _pause;
	export const step = _step;
	export let playing: boolean = false;

	// orbit controls
	let autoRotate: boolean = false;
	let enableDamping: boolean = true;
	let rotateSpeed: number = 1;
	let zoomToCursor: boolean = false;
	let zoomSpeed: number = 1;
	let minPolarAngle: number = 0;
	let maxPolarAngle: number = Math.PI;
	let enableZoom: boolean = true;
</script>

<!-- camera and controls -->
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

<!-- gizmo -->
<Gizmo horizontalPlacement="left" size={64} center={center_of_stock} />

<!-- light source -->
<T.DirectionalLight position={[5, -10, 20]} />

<!-- stock -->
<T.Mesh position={center_of_stock}>
	<T.BoxGeometry args={[scaled_stock_width, scaled_stock_height, scaled_stock_depth]} />
	<T.MeshStandardMaterial color={'white'} transparent={true} opacity={0.6} />
</T.Mesh>

<!-- axes -->
<T.ArrowHelper
	args={[new Vector3(1, 0, 0), new Vector3(0, 0, 0), 3 * scaled_tool_radius, '#ff3653']}
/>
<T.ArrowHelper
	args={[new Vector3(0, 1, 0), new Vector3(0, 0, 0), 3 * scaled_tool_radius, '#8adb00']}
/>
<T.ArrowHelper
	args={[new Vector3(0, 0, 1), new Vector3(0, 0, 0), 3 * scaled_tool_radius, '#2c8fff']}
/>

<!-- tool -->
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
