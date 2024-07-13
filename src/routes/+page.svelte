<script lang="ts">
	import {
		FaceMillingOptions,
		FaceMilling,
		Tool,
		generate_code,
		BottomLeft,
		Right
	} from '../g_kod.gleam';

	const options = new FaceMillingOptions(
		10.0,
		10.0,
		0.0,
		-5.0,
		5.0,
		-2.0,
		0.5,
		new BottomLeft(),
		new Right()
	);
	const face_milling = new FaceMilling(options);
	const tool = new Tool(5.0, 10000, 2000);

	const code = generate_code(face_milling, tool);
</script>

<pre>{code}</pre>
