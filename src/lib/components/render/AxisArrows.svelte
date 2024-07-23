<script lang="ts">
	import { T } from '@threlte/core';
	import { Vector3 } from 'three';

	export let scaled_tool_radius: number;
</script>

<T.ArrowHelper
	args={[new Vector3(1, 0, 0), new Vector3(0, 0, 0), 3 * scaled_tool_radius, '#ff3653']}
/>
<T.ArrowHelper
	args={[new Vector3(0, 1, 0), new Vector3(0, 0, 0), 3 * scaled_tool_radius, '#8adb00']}
/>
<T.ArrowHelper
	args={[new Vector3(0, 0, 1), new Vector3(0, 0, 0), 3 * scaled_tool_radius, '#2c8fff']}
/>
