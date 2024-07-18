<script lang="ts">
	import PreviewPlot from '$lib/components/preview_plot';

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

	let x_max: number = 80.0;
	let y_max: number = 100.0;
	let z_initial_height: number = 0.0;
	let z_final_height: number = -5.0;
	let z_safe_height: number = 5.0;
	let z_depth_of_cut: number = -2.0;
	let step_over: number = 0.8;
	let corner: 'bottom_left' | 'bottom_right' | 'top_left' | 'top_right' = 'bottom_left';
	let milling_direction: 'right' | 'left' | 'up' | 'down' = 'right';

	let diameter: number = 10.0;
	let speed: number = 10000;
	let feed: number = 2000;

	let code = '';
	let workpieceWidth = x_max;
	let workpieceHeight = y_max;

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

	async function handleSubmit() {
		// zero out code to force redraw of preview plot
		code = '';
		await tick();
		code = generate_face_milling_code();

		workpieceWidth = x_max;
		workpieceHeight = y_max;
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
			<legend class="text-sm font-medium text-neutral-300">milling parameters</legend>
			<div class="flex flex-col">
				<label for="corner" class="mt-2 p-1 text-xs font-medium lowercase">start corner:</label>
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
			<div class="h-60">
				{#if code}
					<PreviewPlot
						{code}
						{workpieceWidth}
						{workpieceHeight}
						bind:corner
						bind:milling_direction
					/>
				{/if}
			</div>
		</fieldset>
	</div>

	<button
		type="submit"
		class="mt-4 rounded-md bg-blue-500 px-3 py-2 text-neutral-900 hover:bg-blue-600"
	>
		generate code
	</button>

	<button
		type="button"
		class="ml-2 mt-4 rounded-md bg-blue-500 px-3 py-2 text-neutral-900 hover:bg-blue-600"
		on:click={() => navigator.clipboard.writeText(code)}
	>
		copy code
	</button>
</form>

<div class="m-4 rounded-md bg-neutral-800 p-4 text-xs">
	<div class="whitespace-pre-wrap">{code}</div>
</div>
