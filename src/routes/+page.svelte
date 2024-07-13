<script lang="ts">
	import { onMount, tick } from 'svelte';
	import {
		FaceMillingOptions,
		FaceMilling,
		Tool,
		BottomLeft,
		BottomRight,
		TopRight,
		TopLeft,
		Right,
		Left,
		Up,
		Down,
		generate_code
	} from '../g_kod.gleam';

	import DirectionLine from './DirectionLine.svelte';
	import DirectionMap from './DirectionMap.svelte';

	let x_max: number = 10.0;
	let y_max: number = 10.0;
	let z_initial_height: number = 0.0;
	let z_final_height: number = -5.0;
	let z_safe_height: number = 5.0;
	let z_depth_of_cut: number = -2.0;
	let step_over: number = 0.5;
	let corner: 'bottom_left' | 'bottom_right' | 'top_left' | 'top_right' = 'bottom_left';
	let milling_direction: 'right' | 'left' | 'up' | 'down' = 'right';

	let diameter: number = 5.0;
	let speed: number = 10000;
	let feed: number = 2000;

	let code = '';

	function generate_face_milling_code() {
		let crnr: BottomLeft | BottomRight | TopLeft | TopRight;
		switch (corner) {
			case 'bottom_left':
				crnr = new BottomLeft();
				break;
			case 'bottom_right':
				crnr = new BottomRight();
				break;
			case 'top_left':
				crnr = new TopLeft();
				break;
			case 'top_right':
				crnr = new TopRight();
				break;
			default:
				crnr = new BottomLeft();
		}

		let dir: Left | Right | Up | Down;
		switch (milling_direction) {
			case 'right':
				dir = new Right();
				break;
			case 'left':
				dir = new Left();
				break;
			case 'up':
				dir = new Up();
				break;
			case 'down':
				dir = new Down();
				break;
			default:
				dir = new Right();
		}

		return generate_code(
			new FaceMilling(
				new FaceMillingOptions(
					x_max,
					y_max,
					z_initial_height,
					z_final_height,
					z_safe_height,
					z_depth_of_cut,
					step_over,
					crnr,
					dir
				)
			),
			new Tool(diameter, speed, feed)
		);
	}

	let form: HTMLFormElement;
	let show = false;

	async function handleSubmit() {
		show = false;
		await tick();
		code = generate_face_milling_code();
		show = true;
	}

	onMount(() => {
		form.requestSubmit();
	});
</script>

<form
	on:submit|preventDefault={handleSubmit}
	class="m-4 space-y-4 rounded-md bg-neutral-800 p-4 pt-2"
	bind:this={form}
>
	<div class="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
		<fieldset class="rounded-md border border-neutral-600 px-2 pb-2">
			<legend class="text-sm font-medium text-neutral-300">dimensions</legend>
			<div class="flex flex-col">
				<div class="flex flex-col">
					<label for="x_max" class="mt-2 p-1 text-xs font-medium lowercase">x max:</label>
					<input
						id="x_max"
						type="number"
						step="0.01"
						bind:value={x_max}
						class="w-full rounded-md bg-neutral-900 p-1 text-sm lowercase text-white"
					/>
				</div>
				<div class="flex flex-col">
					<label for="y_max" class="mt-2 p-1 text-xs font-medium lowercase">y max:</label>
					<input
						id="y_max"
						type="number"
						step="0.01"
						bind:value={y_max}
						class="w-full rounded-md bg-neutral-900 p-1 text-sm lowercase text-white"
					/>
				</div>
			</div>
		</fieldset>

		<fieldset class="rounded-md border border-neutral-600 px-2 pb-2">
			<legend class="text-sm font-medium text-neutral-300">heights</legend>
			<div class="flex flex-col">
				<label for="z_safe_height" class="mt-2 p-1 text-xs font-medium lowercase">
					z safe height:
				</label>
				<input
					id="z_safe_height"
					type="number"
					step="0.01"
					bind:value={z_safe_height}
					class="w-full rounded-md bg-neutral-900 p-1 text-sm lowercase text-white"
				/>
			</div>
			<div class="flex flex-col">
				<label for="z_initial_height" class="mt-2 p-1 text-xs font-medium lowercase">
					z initial height:
				</label>
				<input
					id="z_initial_height"
					type="number"
					step="0.01"
					bind:value={z_initial_height}
					class="w-full rounded-md bg-neutral-900 p-1 text-sm lowercase text-white"
				/>
			</div>
			<div class="flex flex-col">
				<label for="z_depth_of_cut" class="mt-2 p-1 text-xs font-medium lowercase">
					z depth of cut:
				</label>
				<input
					id="z_depth_of_cut"
					type="number"
					step="0.01"
					bind:value={z_depth_of_cut}
					class="w-full rounded-md bg-neutral-900 p-1 text-sm lowercase text-white"
				/>
			</div>
			<div class="flex flex-col">
				<label for="z_final_height" class="mt-2 p-1 text-xs font-medium lowercase">
					z final height:
				</label>
				<input
					id="z_final_height"
					type="number"
					step="0.01"
					bind:value={z_final_height}
					class="w-full rounded-md bg-neutral-900 p-1 text-sm lowercase text-white"
				/>
			</div>
		</fieldset>

		<fieldset class="rounded-md border border-neutral-600 px-2 pb-2">
			<legend class="text-sm font-medium text-neutral-300">hmm</legend>
			<div class="flex flex-col">
				<label for="corner" class="mt-2 p-1 text-xs font-medium lowercase">corner:</label>
				<input
					id="corner"
					bind:value={corner}
					class="w-full rounded-md bg-neutral-900 p-1 text-sm lowercase text-white"
					disabled
				/>
			</div>
			<div class="flex flex-col">
				<label for="milling_direction" class="mt-2 p-1 text-xs font-medium lowercase">
					milling direction:
				</label>
				<input
					id="milling_direction"
					bind:value={milling_direction}
					class="w-full rounded-md bg-neutral-900 p-1 text-sm lowercase text-white"
					disabled
				/>
			</div>
			<div class="flex flex-col">
				<label for="step_over" class="mt-2 p-1 text-xs font-medium lowercase">step over:</label>
				<input
					id="step_over"
					type="number"
					step="0.01"
					bind:value={step_over}
					class="w-full rounded-md bg-neutral-900 p-1 text-sm lowercase text-white"
				/>
			</div>
		</fieldset>

		<fieldset class="rounded-md border border-neutral-600 px-2 pb-2">
			<legend class="text-sm font-medium text-neutral-300">tool parameters</legend>
			<div class="flex flex-col">
				<label for="diameter" class="mt-2 p-1 text-xs font-medium lowercase">diameter:</label>
				<input
					id="diameter"
					type="number"
					step="0.01"
					bind:value={diameter}
					class="w-full rounded-md bg-neutral-900 p-1 text-sm lowercase text-white"
				/>
			</div>
			<div class="flex flex-col">
				<label for="speed" class="mt-2 p-1 text-xs font-medium lowercase">speed:</label>
				<input
					id="speed"
					type="number"
					step="0.01"
					bind:value={speed}
					class="w-full rounded-md bg-neutral-900 p-1 text-sm lowercase text-white"
				/>
			</div>
			<div class="flex flex-col">
				<label for="feed" class="mt-2 p-1 text-xs font-medium lowercase">feed:</label>
				<input
					id="feed"
					type="number"
					bind:value={feed}
					class="w-full rounded-md bg-neutral-900 p-1 text-sm lowercase text-white"
				/>
			</div>
		</fieldset>

		<fieldset class="col-span-2 rounded-md border border-neutral-600 p-2">
			<div>
				<svg
					viewBox="0 0 120 120"
					class="h-full max-h-60 w-full"
					xmlns="http://www.w3.org/2000/svg"
				>
					<defs>
						<marker id="arrow" orient="auto" markerWidth="3" markerHeight="2" refX="0.2" refY="1">
							<path d="M0,0 V2 L1,1 Z" fill="#ffffff" />
						</marker>
						<marker
							id="arrow-dimmed"
							orient="auto"
							markerWidth="3"
							markerHeight="2"
							refX="0.2"
							refY="1"
						>
							<path d="M0,0 V2 L1,1 Z" fill="#525252" />
						</marker>
						<marker
							id="arrow-path"
							orient="auto"
							markerWidth="6"
							markerHeight="4"
							refX="0.2"
							refY="2"
						>
							<path d="M0,0 V4 L2,2 Z" fill="#525252" />
						</marker>
					</defs>

					<!-- background -->
					<rect fill="#171717" x="10" y="10" width="100" height="100" />

					<!-- small circle in each corner -->
					<circle cx="10" cy="10" r="2" fill="#ffffff" />
					<circle cx="110" cy="10" r="2" fill="#ffffff" />
					<circle cx="10" cy="110" r="2" fill="#ffffff" />
					<circle cx="110" cy="110" r="2" fill="#ffffff" />

					<DirectionLine
						x1={10}
						y1={15}
						x2={10}
						y2={30}
						this_corner="top_left"
						this_direction="down"
						bind:corner
						bind:milling_direction
					/>

					<DirectionLine
						x1={15}
						y1={10}
						x2={30}
						y2={10}
						this_corner="top_left"
						this_direction="right"
						bind:corner
						bind:milling_direction
					/>

					<DirectionLine
						x1={105}
						y1={10}
						x2={90}
						y2={10}
						this_corner="top_right"
						this_direction="left"
						bind:corner
						bind:milling_direction
					/>

					<DirectionLine
						x1={110}
						y1={15}
						x2={110}
						y2={30}
						this_corner="top_right"
						this_direction="down"
						bind:corner
						bind:milling_direction
					/>

					<DirectionLine
						x1={110}
						y1={105}
						x2={110}
						y2={90}
						this_corner="bottom_right"
						this_direction="up"
						bind:corner
						bind:milling_direction
					/>

					<DirectionLine
						x1={105}
						y1={110}
						x2={90}
						y2={110}
						this_corner="bottom_right"
						this_direction="left"
						bind:corner
						bind:milling_direction
					/>

					<DirectionLine
						x1={15}
						y1={110}
						x2={30}
						y2={110}
						this_corner="bottom_left"
						this_direction="right"
						bind:corner
						bind:milling_direction
					/>

					<DirectionLine
						x1={10}
						y1={105}
						x2={10}
						y2={90}
						this_corner="bottom_left"
						this_direction="up"
						bind:corner
						bind:milling_direction
					/>

					{#if show}
						<DirectionMap></DirectionMap>
					{/if}
				</svg>
			</div>
		</fieldset>
	</div>

	<button
		type="submit"
		class="mt-4 rounded-md bg-blue-500 px-3 py-2 text-neutral-900 hover:bg-blue-600"
	>
		generate code
	</button>
</form>

<div class="m-4 rounded-md bg-neutral-800 p-4 text-xs">
	<div class="whitespace-pre-wrap">{code}</div>
</div>
