<script lang="ts">
	import Camera from './Camera.svelte';
	import Gizmo from './Gizmo.svelte';
	import Lighting from './Lighting.svelte';
	import AxisArrows from './AxisArrows.svelte';
	import Stock from './Stock.svelte';
	import Tool from './Tool.svelte';

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
	import { Vector3, Object3D, CanvasTexture } from 'three';

	import { onMount } from 'svelte';

	Object3D.DEFAULT_UP = new Vector3(0, 0, 1);

	// g_code and line index
	export let g_code: string[];
	export let line_index = 0;

	// render settings
	export let external_scale_factor: number = 5.0;
	export let speed: Writable<number[]>;
	let stepping: boolean = false;

	// tool position
	let start_position = find_start_position(g_code);
	export let position = start_position.clone();
	$: scaled_position = position.clone().multiplyScalar(scale_factor);
	let target_position: Vector3 | undefined;

	// stock dimensions
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

	// tool parameters
	let tool_radius = find_tool_radius(g_code);
	const scaled_tool_radius = tool_radius * scale_factor;
	let feed_rate = find_initial_feed_rate(g_code);

	const { start: _start, stop: _stop } = useTask(
		(delta) => {
			playing = true;

			// if there is no target position, then we need to interpret the next g_code line
			if (target_position === undefined) {
				const { new_position, new_feed_rate } = interpret_g_code_line(
					g_code[line_index],
					position,
					feed_rate
				);

				target_position = new_position;
				feed_rate = new_feed_rate;
			}

			// then interpolate between current and target position
			if (target_position !== undefined) {
				position = interpolate(
					position,
					target_position,
					feed_rate,
					delta,
					$speed[0],
					tool_radius,
					drawCtx,
					heightMapCtx,
					heightMap,
					z_max
				);

				// if the current position is the same as the target position, then we have reached the target
				// if so, set the target position to undefined and increase the current line index
				if (position === target_position) {
					target_position = undefined;
					line_index++;

					if (line_index >= g_code.length) {
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
		position = start_position.clone();
		line_index = 0;
		target_position = undefined;

		// clear the draw context
		drawCtx.clearRect(0, 0, drawCtx.canvas.width, drawCtx.canvas.height);
		drawCtx.fillStyle = 'black';
		drawCtx.fillRect(0, 0, drawCtx.canvas.width, drawCtx.canvas.height);

		// clear the height map context
		heightMapCtx.clearRect(0, 0, heightMapCtx.canvas.width, heightMapCtx.canvas.height);
		heightMapCtx.fillStyle = 'black';
		heightMapCtx.fillRect(0, 0, heightMapCtx.canvas.width, heightMapCtx.canvas.height);

		heightMap.needsUpdate = true;
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

	export let canvasDraw: HTMLCanvasElement;
	export let canvasHeightMap: HTMLCanvasElement;
	let drawCtx: CanvasRenderingContext2D;
	let heightMapCtx: CanvasRenderingContext2D;
	let heightMap: CanvasTexture;

	onMount(() => {
		heightMap = new CanvasTexture(canvasHeightMap);
		drawCtx = canvasDraw.getContext('2d') as CanvasRenderingContext2D;
		heightMapCtx = canvasHeightMap.getContext('2d') as CanvasRenderingContext2D;

		canvasDraw.width = x_max;
		canvasDraw.height = y_max;
		canvasDraw.style.width = `${2 * x_max}px`;
		canvasDraw.style.height = `${2 * y_max}px`;

		canvasHeightMap.width = x_max;
		canvasHeightMap.height = y_max;
		canvasHeightMap.style.width = `${2 * x_max}px`;
		canvasHeightMap.style.height = `${2 * y_max}px`;

		// fill the canvas with black
		drawCtx.fillStyle = 'black';
		drawCtx.fillRect(0, 0, x_max, y_max);

		// fill the height map with black
		heightMapCtx.fillStyle = 'black';
		heightMapCtx.fillRect(0, 0, x_max, y_max);

		// trigger a texture update
		heightMap.needsUpdate = true;
	});
</script>

<Camera {center_of_stock} />

<Gizmo {center_of_stock} />

<Lighting />

<Stock
	{center_of_stock}
	{scaled_stock_width}
	{scaled_stock_height}
	{scaled_stock_depth}
	{heightMap}
/>

<AxisArrows {scaled_tool_radius} />

<Tool {scaled_position} {scaled_tool_radius} {scale_factor} {scaled_stock_depth} />
