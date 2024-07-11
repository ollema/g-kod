<script lang="ts">
	import { greet } from '../g_kod.gleam';

	const greeting = greet();

	function generate_code(operation: string) {
		console.log('hello');
	}

	generate_code('hello');
</script>

<p>{greeting}</p>
