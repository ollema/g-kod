<script lang="ts">
	import DirectionArrow from './DirectionArrow.svelte';

	export let corner: 'bottom_left' | 'bottom_right' | 'top_left' | 'top_right';
	export let milling_direction: 'right' | 'left' | 'up' | 'down';
</script>

<svg viewBox="0 0 120 120" class="h-full max-h-60 w-full" xmlns="http://www.w3.org/2000/svg">
	<defs>
		<marker id="arrow" orient="auto" markerWidth="3" markerHeight="2" refX="0.2" refY="1">
			<path d="M0,0 V2 L1,1 Z" fill="#ffffff" />
		</marker>
		<marker id="arrow-dimmed" orient="auto" markerWidth="3" markerHeight="2" refX="0.2" refY="1">
			<path d="M0,0 V2 L1,1 Z" fill="#525252" />
		</marker>
		<marker id="arrow-path" orient="auto" markerWidth="6" markerHeight="4" refX="0.2" refY="2">
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

	<DirectionArrow
		x1={10}
		y1={15}
		x2={10}
		y2={30}
		this_corner="top_left"
		this_direction="down"
		bind:corner
		bind:milling_direction
	/>

	<DirectionArrow
		x1={15}
		y1={10}
		x2={30}
		y2={10}
		this_corner="top_left"
		this_direction="right"
		bind:corner
		bind:milling_direction
	/>

	<DirectionArrow
		x1={105}
		y1={10}
		x2={90}
		y2={10}
		this_corner="top_right"
		this_direction="left"
		bind:corner
		bind:milling_direction
	/>

	<DirectionArrow
		x1={110}
		y1={15}
		x2={110}
		y2={30}
		this_corner="top_right"
		this_direction="down"
		bind:corner
		bind:milling_direction
	/>

	<DirectionArrow
		x1={110}
		y1={105}
		x2={110}
		y2={90}
		this_corner="bottom_right"
		this_direction="up"
		bind:corner
		bind:milling_direction
	/>

	<DirectionArrow
		x1={105}
		y1={110}
		x2={90}
		y2={110}
		this_corner="bottom_right"
		this_direction="left"
		bind:corner
		bind:milling_direction
	/>

	<DirectionArrow
		x1={15}
		y1={110}
		x2={30}
		y2={110}
		this_corner="bottom_left"
		this_direction="right"
		bind:corner
		bind:milling_direction
	/>

	<DirectionArrow
		x1={10}
		y1={105}
		x2={10}
		y2={90}
		this_corner="bottom_left"
		this_direction="up"
		bind:corner
		bind:milling_direction
	/>
</svg>
