<script>
	import '../app.css';
	import '@fontsource-variable/inconsolata';
	import Logo from '$lib/components/logo';
</script>

<nav class="m-4 flex h-20 items-center rounded-md bg-neutral-800 p-4 font-semibold text-white">
	<a href="/" class="h-full"><Logo /></a>
</nav>

<div>
	<slot></slot>
</div>
