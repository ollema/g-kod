<script lang="ts">
	import { Gizmo as ThrelteGizmo } from '@threlte/extras';

	export let center_of_stock: [number, number, number];
</script>

<ThrelteGizmo horizontalPlacement="left" size={64} center={center_of_stock} />
