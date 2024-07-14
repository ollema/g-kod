<script lang="ts">
	import PreviewPath from './PreviewPath.svelte';
	import PreviewCorner from './PreviewCorner.svelte';
	import PreviewDirection from './PreviewDirection.svelte';

	export let corner: 'bottom_left' | 'bottom_right' | 'top_left' | 'top_right';
	export let milling_direction: 'right' | 'left' | 'up' | 'down';

	export let workpieceWidth: number;
	export let workpieceHeight: number;
	export let code: string;

	const targetSize = 100;

	// calculate the aspect ratio of the workpiece
	const aspectRatio = workpieceWidth / workpieceHeight;

	// determine the scaling factor to maintain the aspect ratio
	$: scaleFactor = aspectRatio > 1 ? targetSize / workpieceWidth : targetSize / workpieceHeight;

	// calculate the dimensions of the displayed rectangle to fit the target size while maintaining the aspect ratio
	$: rectWidth = workpieceWidth * scaleFactor;
	$: rectHeight = workpieceHeight * scaleFactor;

	function transformCoordinates(coord: { x: number; y: number }) {
		const x = xmin + (coord.x / workpieceWidth) * rectWidth;
		const y = ymax - (coord.y / workpieceHeight) * rectHeight;
		return { x, y };
	}

	const padding = 6;

	$: viewBox = `0 0 ${rectWidth + 2 * padding} ${rectHeight + 2 * padding}`;
	$: xmin = padding;
	$: xmax = rectWidth + padding;
	$: ymin = padding;
	$: ymax = rectHeight + padding;
</script>

<svg
	{viewBox}
	preserveAspectRatio="xMidYMid meet"
	class="h-full max-h-60 w-full"
	xmlns="http://www.w3.org/2000/svg"
>
	<!-- arrow marker definitions -->
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
	<rect fill="#171717" stroke="none" x={xmin} y={ymin} width={rectWidth} height={rectHeight} />

	<PreviewPath {code} {transformCoordinates} />

	<!-- small circle in each corner -->
	<PreviewCorner cx={xmin} cy={ymin} />
	<PreviewCorner cx={xmax} cy={ymin} />
	<PreviewCorner cx={xmin} cy={ymax} />
	<PreviewCorner cx={xmax} cy={ymax} />

	<!-- arrows -->
	<PreviewDirection
		x1={xmin}
		y1={ymin + 5}
		x2={xmin}
		y2={ymin + 10}
		this_corner="top_left"
		this_direction="down"
		bind:corner
		bind:milling_direction
	/>

	<PreviewDirection
		x1={xmin + 5}
		y1={ymin}
		x2={xmin + 10}
		y2={ymin}
		this_corner="top_left"
		this_direction="right"
		bind:corner
		bind:milling_direction
	/>

	<PreviewDirection
		x1={xmax - 5}
		y1={ymin}
		x2={xmax - 10}
		y2={ymin}
		this_corner="top_right"
		this_direction="left"
		bind:corner
		bind:milling_direction
	/>

	<PreviewDirection
		x1={xmax}
		y1={ymin + 5}
		x2={xmax}
		y2={ymin + 10}
		this_corner="top_right"
		this_direction="down"
		bind:corner
		bind:milling_direction
	/>

	<PreviewDirection
		x1={xmax}
		y1={ymax - 5}
		x2={xmax}
		y2={ymax - 10}
		this_corner="bottom_right"
		this_direction="up"
		bind:corner
		bind:milling_direction
	/>

	<PreviewDirection
		x1={xmax - 5}
		y1={ymax}
		x2={xmax - 10}
		y2={ymax}
		this_corner="bottom_right"
		this_direction="left"
		bind:corner
		bind:milling_direction
	/>

	<PreviewDirection
		x1={xmin + 5}
		y1={ymax}
		x2={xmin + 10}
		y2={ymax}
		this_corner="bottom_left"
		this_direction="right"
		bind:corner
		bind:milling_direction
	/>

	<PreviewDirection
		x1={xmin}
		y1={ymax - 5}
		x2={xmin}
		y2={ymax - 10}
		this_corner="bottom_left"
		this_direction="up"
		bind:corner
		bind:milling_direction
	/>
</svg>
