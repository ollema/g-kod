<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { Portal } from '@threlte/extras';

	const { scene } = useThrelte();

	export let show_helper = false;
</script>

<T.AmbientLight args={['#ffffff', 0.2]}></T.AmbientLight>

<T.DirectionalLight args={['#ffffff', 0.8]} position.x={-4} position.y={-4} position.z={4} let:ref>
	{#if show_helper}
		<Portal object={scene}>
			<T.DirectionalLightHelper args={[ref]} />
		</Portal>
	{/if}
</T.DirectionalLight>
