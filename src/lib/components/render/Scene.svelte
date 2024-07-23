<script lang="ts">
	import Camera from './Camera.svelte';
	import Gizmo from './Gizmo.svelte';
	import Lighting from './Lighting.svelte';
	import AxisArrows from './AxisArrows.svelte';
	import Stock from './Stock.svelte';
	import Tool from './Tool.svelte';

	import type { Position } from '$lib/g_code/types';
	import {
		find_initial_feed_rate,
		find_max_dimensions,
		find_start_position,
		find_tool_radius,
		interpret_g_code_line
	} from '$lib/g_code/parser';
	import { interpolate } from '$lib/g_code/interpolate';

	import type { Writable } from 'svelte/store';

	import { useTask } from '@threlte/core';
	import { Vector3, Object3D } from 'three';

	Object3D.DEFAULT_UP = new Vector3(0, 0, 1);

	export let g_code: string[];
	export let current_line_index = 0;

	export let external_scale_factor: number = 5.0;

	export let speed: Writable<number[]>;

	let start_position = find_start_position(g_code);
	let current_position = { ...start_position };
	let target_position: Position | undefined;

	let { x_max, y_max, z_max } = find_max_dimensions(g_code);
	const scale_factor = (1 / Math.max(x_max, y_max, z_max)) * external_scale_factor;
	const scaled_stock_width = x_max * scale_factor;
	const scaled_stock_height = y_max * scale_factor;
	const scaled_stock_depth = z_max * scale_factor;
	const center_of_stock: [number, number, number] = [
		scaled_stock_width / 2,
		scaled_stock_height / 2,
		-scaled_stock_depth / 2
	];

	let tool_radius = find_tool_radius(g_code);
	const scaled_tool_radius = tool_radius * scale_factor;

	let feed_rate = find_initial_feed_rate(g_code);

	// actual x, y, z coordinates
	export let x = start_position.x;
	$: x = current_position.x;
	export let y = start_position.y;
	$: y = current_position.y;
	export let z = start_position.z;
	$: z = current_position.z;

	// scaled x, y, z coordinates
	$: scaled_x = x * scale_factor;
	$: scaled_y = y * scale_factor;
	$: scaled_z = z * scale_factor;

	let stepping: boolean = false;

	const { start: _start, stop: _stop } = useTask(
		(delta) => {
			playing = true;

			// if there is no target position, then we need to interpret the next g_code line
			if (target_position === undefined) {
				const { new_position, new_feed_rate } = interpret_g_code_line(
					g_code[current_line_index],
					current_position,
					feed_rate
				);

				target_position = new_position;
				feed_rate = new_feed_rate;
			}

			// then interpolate between current and target position
			if (target_position !== undefined) {
				current_position = interpolate(
					current_position,
					target_position,
					feed_rate,
					delta,
					$speed[0]
				);

				// if the new position is the same as the target position, then we have reached the target
				// then we can set the target position to undefined and increase the current line index
				if (x === target_position.x && y === target_position.y && z === target_position.z) {
					target_position = undefined;
					current_line_index++;

					if (current_line_index >= g_code.length) {
						_pause();
						return;
					}

					if (stepping) {
						_pause();
						stepping = false;
					}
				}
			}
		},
		{
			autoStart: false
		}
	);

	function _reset() {
		_stop();
		playing = false;
		current_position = { ...start_position };
		current_line_index = 0;
		target_position = undefined;
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
</script>

<!-- camera and controls -->
<Camera {center_of_stock} />

<Gizmo {center_of_stock} />

<Lighting />

<Stock {center_of_stock} {scaled_stock_width} {scaled_stock_height} {scaled_stock_depth} />

<AxisArrows {scaled_tool_radius} />

<Tool {scaled_x} {scaled_y} {scaled_z} {scaled_tool_radius} {scale_factor} {scaled_stock_depth} />
