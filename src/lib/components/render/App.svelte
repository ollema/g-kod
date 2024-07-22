<script lang="ts">
	import Scene from './Scene.svelte';

	import { Canvas } from '@threlte/core';

	// export let code: string;

	export let stock_width: number;
	export let stock_height: number;
	export let stock_depth: number;

	export let tool_radius: number;

	// props to bind
	let x: number = 0;
	let y: number = 0;
	let z: number = 0;
	let start: () => void;
	let pause: () => void;
	let stop: () => void;
</script>

<div class="relative h-full w-full">
	<Canvas>
		<Scene
			{stock_width}
			{stock_height}
			{stock_depth}
			{tool_radius}
			bind:x
			bind:y
			bind:z
			bind:start
			bind:pause
			bind:stop
		/>
	</Canvas>

	<div class="absolute left-0 top-0 text-left text-xs">
		<div class="whitespace-pre">X: {x.toFixed(1).padStart(6)}</div>
		<div class="whitespace-pre">Y: {y.toFixed(1).padStart(6)}</div>
		<div class="whitespace-pre">Z: {z.toFixed(1).padStart(6)}</div>
	</div>

	<!-- buttons to control animation playback, start/stop -->
	<div class="absolute bottom-0 right-0 text-center">
		<button
			type="button"
			on:click={start}
			class="rounded-md bg-neutral-500 p-1 hover:bg-neutral-600"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
				<rect width="24" height="24" fill="none" />
				<path fill="currentColor" d="M9 17.192V6.808L17.154 12z" />
			</svg>
		</button>
		<button
			type="button"
			on:click={pause}
			class="rounded-md bg-neutral-500 p-1 hover:bg-neutral-600"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
				<rect width="24" height="24" fill="none" />
				<path fill="currentColor" d="M14 18V6h3.5v12zm-7.5 0V6H10v12z" />
			</svg>
		</button>
		<button
			type="button"
			on:click={stop}
			class="rounded-md bg-neutral-500 p-1 hover:bg-neutral-600"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
				<rect width="24" height="24" fill="none" />
				<path fill="currentColor" d="M7 17V7h10v10z" />
			</svg>
		</button>
	</div>
</div>
