<script lang="ts">
	import { draw } from 'svelte/transition';
	import { linear } from 'svelte/easing';

	export let g_code: string[];
	export let transformCoordinates: (coord: { x: number; y: number }) => { x: number; y: number };

	function extractCoordinates(g_code: string[]): { x: number; y: number }[] {
		const coordinates: { x: number; y: number }[] = [];
		let isFirstPass = false;
		let currentX: number | null = null;
		let currentY: number | null = null;

		for (const line of g_code) {
			// determine initial X and Y coordinates from G00 or G01 commands
			const initialMatch = line.match(/G0[01]\s+X([\d.-]+)\s+Y([\d.-]+)/);
			if (initialMatch) {
				currentX = parseFloat(initialMatch[1]);
				currentY = parseFloat(initialMatch[2]);
				coordinates.push({ x: currentX, y: currentY });
				continue;
			}

			if (line.includes('start face milling pass') && !isFirstPass) {
				isFirstPass = true;
				continue;
			}
			if (isFirstPass) {
				// stop at the next Z movement
				if (line.startsWith('G01 Z-')) break;

				// otherwise extract X and Y coordinates
				const xMatch = line.match(/X([\d.-]+)/);
				const yMatch = line.match(/Y([\d.-]+)/);

				if (xMatch) {
					currentX = parseFloat(xMatch[1]);
				}
				if (yMatch) {
					currentY = parseFloat(yMatch[1]);
				}

				if (currentX !== null && currentY !== null) {
					coordinates.push({ x: currentX, y: currentY });
				}
			}
		}
		return coordinates;
	}

	$: coordinates = extractCoordinates(g_code);

	$: points = coordinates
		.map((coord) => {
			const { x, y } = transformCoordinates(coord);
			return `${x},${y}`;
		})
		.join(' ');
</script>

{#key points}
	<polyline
		{points}
		fill="none"
		stroke="#3b82f6"
		opacity="0.5"
		stroke-width="1"
		in:draw|global={{ duration: 3000, easing: linear }}
	/>
{/key}
