<script lang="ts">
	export let x1: number;
	export let y1: number;
	export let x2: number;
	export let y2: number;
	export let this_corner: 'bottom_left' | 'bottom_right' | 'top_left' | 'top_right';
	export let this_direction: 'right' | 'left' | 'up' | 'down';

	// bind these
	export let corner: 'bottom_left' | 'bottom_right' | 'top_left' | 'top_right';
	export let milling_direction: 'right' | 'left' | 'up' | 'down';
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions-->
<g
	on:click={() => {
		corner = this_corner;
		milling_direction = this_direction;
	}}
>
	<line
		{x1}
		{y1}
		{x2}
		{y2}
		stroke-width="4"
		stroke={corner === this_corner && milling_direction === this_direction ? '#ffffff' : '#525252'}
		fill={corner === this_corner && milling_direction === this_direction ? '#ffffff' : '#525252'}
		marker-end={corner === this_corner && milling_direction === this_direction
			? 'url(#arrow)'
			: 'url(#arrow-dimmed)'}
	/>
	<rect
		x={Math.min(x1, x2) - 3}
		y={Math.min(y1, y2) - 3}
		width={Math.abs(x2 - x1) + 6}
		height={Math.abs(y2 - y1) + 6}
		fill="transparent"
	/>
</g>
