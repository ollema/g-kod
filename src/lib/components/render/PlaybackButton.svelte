<script lang="ts">
	import { createTooltip, melt } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';

	export let action: () => void;
	export let tooltip: string;
	export let disabled = false;

	$: classes =
		'rounded-md bg-neutral-500 p-1 hover:bg-neutral-600' +
		(disabled ? ' bg-neutral-700 text-neutral-500' : '');

	const {
		elements: { trigger, content, arrow },
		states: { open }
	} = createTooltip({
		positioning: {
			placement: 'top'
		},
		openDelay: 0,
		closeDelay: 0,
		closeOnPointerDown: false,
		forceVisible: true
	});
</script>

<button type="button" on:click={action} use:melt={$trigger} class={classes} {disabled}>
	<slot />
</button>

{#if $open}
	<div
		use:melt={$content}
		transition:fade={{ duration: 100 }}
		class="z-10 rounded-lg bg-neutral-900 shadow"
	>
		<div use:melt={$arrow} />
		<p class="px-2 py-1 text-xs">{tooltip}</p>
	</div>
{/if}
