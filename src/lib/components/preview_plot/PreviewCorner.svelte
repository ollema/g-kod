<script lang="ts">
	export let cx: number;
	export let cy: number;

	export let corner: 'bottom_left' | 'bottom_right' | 'top_left' | 'top_right';
	export let this_corner: 'bottom_left' | 'bottom_right' | 'top_left' | 'top_right';
</script>

<circle {cx} {cy} r="2" fill={corner === this_corner ? '#ffffff' : '#525252'} />
