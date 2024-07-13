<script lang="ts">
	import { draw } from 'svelte/transition';
</script>

<path
	id="arrow-line"
	marker-mid="url(#arrow-path)"
	stroke-width="1"
	fill="none"
	stroke="#525252"
	d="M100,10 L10,10, L10,30, L100,30"
	in:draw={{ duration: 1000 }}
/>
