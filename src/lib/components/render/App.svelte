<script lang="ts">
	import PlaybackButton from './PlaybackButton.svelte';
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
	let reset: () => void;
	let start: () => void;
	let pause: () => void;
	let step: () => void;

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
			bind:reset
			bind:start
			bind:pause
			bind:step
		/>
	</Canvas>

	<!-- show current g-code line being executed -->
	{#if current_line_index !== undefined}
		<div class="absolute left-0 top-0 select-none text-left text-xs">
			{#if previous_line !== undefined}
				<div class="text-neutral-500">
					{previous_line}
				</div>
			{/if}
			{#if current_line !== undefined}
				<div>
					{current_line}
				</div>
			{/if}
			{#if next_line !== undefined}
				<div class="text-neutral-500">
					{next_line}
				</div>
			{/if}
		</div>
	{/if}

	<!-- show coordinates -->
	{#if x !== undefined && y !== undefined && z !== undefined}
		<div class="absolute right-0 top-0 select-none text-left text-xs">
			<div class="whitespace-pre">X: {x.toFixed(1).padStart(6)}</div>
			<div class="whitespace-pre">Y: {y.toFixed(1).padStart(6)}</div>
			<div class="whitespace-pre">Z: {z.toFixed(1).padStart(6)}</div>
		</div>
	{/if}

	<!-- buttons to control animation playback -->
	<div class="absolute bottom-0 right-0 select-none text-center">
		<PlaybackButton action={reset} tooltip={'reset'}>
			<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
				<rect width="24" height="24" fill="none" />
				<path fill="currentColor" d="M6.73 16.616V7.385h1v9.23zm10.54 0L10.345 12l6.923-4.615z" />
			</svg>
		</PlaybackButton>
		<PlaybackButton action={start} tooltip={'start'}>
			<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
				<rect width="24" height="24" fill="none" />
				<path fill="currentColor" d="M9 17.192V6.808L17.154 12z" />
			</svg>
		</PlaybackButton>
		<PlaybackButton action={pause} tooltip={'pause'}>
			<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
				<rect width="24" height="24" fill="none" />
				<path fill="currentColor" d="M14 18V6h3.5v12zm-7.5 0V6H10v12z" />
			</svg>
		</PlaybackButton>
		<PlaybackButton action={step} tooltip={'step'}>
			<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
				<rect width="24" height="24" fill="none" />
				<path
					fill="currentColor"
					d="M12.002 18.5q-1.04 0-1.771-.728t-.731-1.77t.729-1.771t1.769-.731t1.771.729t.731 1.769t-.728 1.771t-1.77.731m-6.812-7q.504-2.379 2.389-3.94T11.975 6q1.864 0 3.394.891q1.531.892 2.458 2.34V5.885h1V11.5h-5.616v-1h4.239q-.723-1.561-2.172-2.53Q13.828 7 12 7Q9.907 7 8.313 8.28T6.216 11.5z"
				/>
			</svg>
		</PlaybackButton>
	</div>
</div>
