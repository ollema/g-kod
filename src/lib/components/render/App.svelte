<script lang="ts">
	import Scene from './Scene.svelte';

	import { Canvas } from '@threlte/core';

	export let g_code: string[];

	export let stock_width: number;
	export let stock_height: number;
	export let stock_depth: number;

	export let tool_radius: number;

	// props to bind
	let x: number;
	let y: number;
	let z: number;
	let current_line_index: number;
	let start: () => void;
	let pause: () => void;
	let stop: () => void;

	$: previous_line = g_code[current_line_index - 1];
	$: current_line = g_code[current_line_index];
	$: next_line = g_code[current_line_index + 1];
</script>

<div class="relative h-full w-full">
	<Canvas>
		<Scene
			{g_code}
			{stock_width}
			{stock_height}
			{stock_depth}
			{tool_radius}
			bind:x
			bind:y
			bind:z
			bind:current_line_index
			bind:start
			bind:pause
			bind:stop
		/>
	</Canvas>

	<!-- show current g-code line being executed -->
	{#if current_line_index !== undefined}
		<div class="absolute left-0 top-0 select-none text-left text-xs">
			{#if previous_line !== undefined}
				<div class="text-neutral-600">
					{previous_line}
				</div>
			{/if}
			{#if current_line !== undefined}
				<div>
					{current_line}
				</div>
			{/if}
			{#if next_line !== undefined}
				<div class="text-neutral-600">
					{next_line}
				</div>
			{/if}
		</div>
	{/if}

	<!-- show coordinates -->
	{#if x !== undefined && y !== undefined && z !== undefined}
		<div class="absolute right-0 top-0 select-none text-right text-xs">
			<div class="whitespace-pre">X: {x.toFixed(1).padStart(6)}</div>
			<div class="whitespace-pre">Y: {y.toFixed(1).padStart(6)}</div>
			<div class="whitespace-pre">Z: {z.toFixed(1).padStart(6)}</div>
		</div>
	{/if}

	<!-- buttons to control animation playback, start/stop -->
	<div class="absolute bottom-0 right-0 select-none text-center">
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
