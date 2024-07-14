<script lang="ts">
	import { onMount } from 'svelte';

	const width = 610;
	const height = 100;

	const letterHeight = 80;
	const letterWidth = 60;
	const stroke = 20;
	const padding = 5;
	const spacing = 15;

	const shadow = 10;

	const ymin = height - padding;
	const ymax = height - padding - letterHeight;

	const g_xmin = padding;
	const g_xmax = padding + letterWidth;

	const dash_xmin = padding + spacing + letterWidth;
	const dash_xmax = padding + spacing + 1.5 * letterWidth;

	const k_xmin = padding + 2 * spacing + 1.5 * letterWidth;
	const k_xmax = padding + 2 * spacing + 2.5 * letterWidth;

	const o_xmin = padding + 3 * spacing + 2.5 * letterWidth;
	const o_xmax = padding + 3 * spacing + 3.5 * letterWidth;

	const d_xmin = padding + 4 * spacing + 3.5 * letterWidth;
	const d_xmax = padding + 4 * spacing + 4.5 * letterWidth;

	const dot_xmin = padding + 5 * spacing + 4.5 * letterWidth;
	const dot_xmax = padding + 5 * spacing + 4.833333 * letterWidth;

	const x_xmin = padding + 6 * spacing + 4.833333 * letterWidth;
	const x_xmax = padding + 6 * spacing + 5.833333 * letterWidth;

	const y_xmin = padding + 7 * spacing + 5.833333 * letterWidth;
	const y_xmax = padding + 7 * spacing + 6.833333 * letterWidth;

	const z_xmin = padding + 8 * spacing + 6.833333 * letterWidth;
	const z_xmax = padding + 8 * spacing + 7.833333 * letterWidth;

	let horizontalShadowColor = 'hsl(200, 100%, 70%)';
	let verticalShadowColor = 'hsl(240, 100%, 30%)';

	function updateShadowColors(event: { clientX: number; clientY: number }) {
		const { clientX, clientY } = event;
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;

		// normalize coordinates to [0, 1]
		const xNorm = clientX / screenWidth;
		const yNorm = clientY / screenHeight;

		// use sine waves to generate hue values based on x and y coordinates
		const hueX = Math.sin(2 * Math.PI * xNorm);
		const hueY = Math.sin(2 * Math.PI * yNorm);

		// combine x and y contributions and scale to [0, 360] range
		const hue = ((hueX + hueY + 1) / 2) * 180 + 180;

		const saturation = 100; // fixed saturation
		const lightnessHorizontal = 90; // lightness for horizontal shadow
		const lightnessVertical = 30; // lightness for vertical shadow

		horizontalShadowColor = `hsl(${hue}, ${saturation}%, ${lightnessHorizontal}%)`;
		verticalShadowColor = `hsl(${hue}, ${saturation}%, ${lightnessVertical}%)`;
	}

	onMount(() => {
		window.addEventListener('mousemove', updateShadowColors);
	});
</script>

<div class="h-full">
	<svg viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg" height="100%">
		<!--letter G-->
		<g id="g" class="hover-translate">
			<!-- shadows -->
			<path
				d="
                M {g_xmin} {ymax}
                L {g_xmin + shadow} {ymax - shadow}
                L {g_xmax + shadow} {ymax - shadow}
                L {g_xmax} {ymax}
                Z"
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {g_xmax} {ymax}
                L {g_xmax + shadow} {ymax - shadow}
                L {g_xmax + shadow} {ymax + stroke - shadow}
                L {g_xmax} {ymax + stroke}
                Z"
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {g_xmin + stroke} {ymax + stroke}
                L {g_xmin + stroke} {ymin - stroke}
                L {g_xmin + stroke + shadow} {ymin - stroke - shadow}
                L {g_xmin + stroke + shadow} {ymax + stroke}
                Z
                "
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {g_xmin + stroke} {ymin - stroke}
                L {g_xmin + stroke + shadow} {ymin - stroke - shadow}
                L {g_xmax - stroke} {ymin - stroke - shadow}
                L {g_xmax - stroke} {ymin - stroke}
                Z
                "
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {g_xmax - stroke} {ymin - 2 * stroke}
                L {g_xmax - stroke + shadow} {ymin - 2 * stroke - shadow}
                L {g_xmax + shadow} {ymin - 2 * stroke - shadow}
                L {g_xmax} {ymin - 2 * stroke}
                Z
                "
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {g_xmax} {ymin - 2 * stroke}
                L {g_xmax + shadow} {ymin - 2 * stroke - shadow}
                L {g_xmax + shadow} {ymin - shadow}
                L {g_xmax} {ymin}
                Z
                "
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>

			<!-- letter face -->
			<path
				d="
                M {g_xmax} {ymax}
                L {g_xmin} {ymax}
                L {g_xmin} {ymin}
                L {g_xmax} {ymin}
                L {g_xmax} {ymin - letterHeight + 2 * stroke}
                L {g_xmax - stroke} {ymin - letterHeight + 2 * stroke}
                L {g_xmax - stroke} {ymin - stroke}
                L {g_xmin + stroke} {ymin - stroke}
                L {g_xmin + stroke} {ymin - letterHeight + stroke}
                L {g_xmax} {ymin - letterHeight + stroke}
                Z"
				fill="white"
				stroke="black"
				stroke-linejoin="round"
			/>
		</g>

		<!--letter dash-->
		<g id="dash" class="hover-translate">
			<!-- shadows -->
			<path
				d="
                M {dash_xmin} {ymax + 1.5 * stroke}
                L {dash_xmin + shadow} {ymax + 1.5 * stroke - shadow}
                L {dash_xmax + shadow} {ymax + 1.5 * stroke - shadow}
                L {dash_xmax} {ymax + 1.5 * stroke}
                Z"
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {dash_xmax} {ymax + 1.5 * stroke}
                L {dash_xmax + shadow} {ymax + 1.5 * stroke - shadow}
                L {dash_xmax + shadow} {ymax + 2.5 * stroke - shadow}
                L {dash_xmax} {ymax + 2.5 * stroke}
                Z"
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>

			<!-- letter face -->
			<path
				d="
                M {dash_xmax} {ymax + 1.5 * stroke}
                L {dash_xmin} {ymax + 1.5 * stroke}
                L {dash_xmin} {ymax + 2.5 * stroke}
                L {dash_xmax} {ymax + 2.5 * stroke}
                Z"
				fill="white"
				stroke="black"
				stroke-linejoin="round"
			/>
		</g>

		<!--letter K-->
		<g id="k" class="hover-translate">
			<!-- shadows -->
			<path
				d="
                M {k_xmin} {ymax}
                L {k_xmin + shadow} {ymax - shadow}
                L {k_xmin + stroke + shadow} {ymax - shadow}
                L {k_xmin + stroke} {ymax}
                Z
                "
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {k_xmin + stroke} {ymax}
                L {k_xmin + stroke + shadow} {ymax - shadow}
                L {k_xmin + stroke + shadow} {ymax + 1.5 * stroke - shadow}
                L {k_xmin + stroke} {ymax + 1.5 * stroke}
                Z
                "
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {k_xmin + stroke} {ymax + 1.5 * stroke}
                L {k_xmin + stroke + shadow} {ymax + 1.5 * stroke - shadow}
                L {k_xmin + 2 * stroke} {ymax + 1.5 * stroke - shadow}
                L {k_xmin + 2 * stroke} {ymax + 1.5 * stroke}
                Z
                "
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {k_xmax - stroke} {ymax}
                L {k_xmax - stroke + shadow} {ymax - shadow}
                L {k_xmax + shadow} {ymax - shadow}
                L {k_xmax} {ymax}
                Z
                "
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {k_xmax} {ymax}
                L {k_xmax + shadow} {ymax - shadow}
                L {k_xmax + shadow} {ymax + 1.5 * stroke - shadow}
                L {k_xmax} {ymax + 1.5 * stroke}
                Z
                "
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {k_xmax - 0.5 * stroke} {ymin - 2 * stroke}
                L {k_xmax - 0.5 * stroke + shadow} {ymin - 2 * stroke - shadow}
                L {k_xmax + shadow} {ymin - 1.5 * stroke - shadow}
                L {k_xmax} {ymin - 1.5 * stroke}
                Z
                "
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {k_xmax} {ymin - 1.5 * stroke}
                L {k_xmax + shadow} {ymin - 1.5 * stroke - shadow}
                L {k_xmax + shadow} {ymin - shadow}
                L {k_xmax} {ymin}
                Z
                "
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {k_xmin + stroke} {ymin - 1.5 * stroke}
                L {k_xmin + stroke} {ymin}
                L {k_xmin + stroke + shadow} {ymin - shadow}
                L {k_xmin + stroke + shadow} {ymin - 1.5 * stroke}
                Z
                "
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>

			<!-- letter face -->
			<path
				d="
                M {k_xmax} {ymax}
                L {k_xmax - stroke} {ymax}
                L {k_xmax - stroke} {ymax + 1.5 * stroke}
                L {k_xmin + stroke} {ymax + 1.5 * stroke}
                L {k_xmin + stroke} {ymax}
                L {k_xmin} {ymax}
                L {k_xmin} {ymin}
                L {k_xmin + stroke} {ymin}
                L {k_xmin + stroke} {ymin - 1.5 * stroke}
                L {k_xmax - stroke} {ymin - 1.5 * stroke}
                L {k_xmax - stroke} {ymin - 1.5 * stroke}
                L {k_xmax - stroke} {ymin}
                L {k_xmax} {ymin}
                L {k_xmax} {ymin - 1.5 * stroke}
                L {k_xmax - 0.5 * stroke} {ymin - 2 * stroke}
                L {k_xmax} {ymax + 1.5 * stroke}
                Z
                "
				fill="white"
				stroke="black"
				stroke-linejoin="round"
			/>
		</g>

		<!--letter O-->
		<g id="o" class="hover-translate">
			<!-- shadows -->
			<path
				d="
                M {o_xmin} {ymax}
                L {o_xmin + shadow} {ymax - shadow}
                L {o_xmax + shadow} {ymax - shadow}
                L {o_xmax} {ymax}
                Z
                "
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {o_xmax} {ymax}
                L {o_xmax + shadow} {ymax - shadow}
                L {o_xmax + shadow} {ymin - shadow}
                L {o_xmax} {ymin}
                Z
                "
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {o_xmin + stroke} {ymax + stroke}
                L {o_xmin + stroke} {ymin - stroke}
                L {o_xmin + stroke + shadow} {ymin - stroke - shadow}
                L {o_xmin + stroke + shadow} {ymax + stroke}
                Z
                "
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {o_xmin + stroke} {ymin - stroke}
                L {o_xmin + stroke + shadow} {ymin - stroke - shadow}
                L {o_xmax - stroke} {ymin - stroke - shadow}
                L {o_xmax - stroke} {ymin - stroke}
                Z
                "
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>

			<!-- letter face -->
			<path
				d="
                M {o_xmax} {ymax}
                L {o_xmin} {ymax}
                L {o_xmin} {ymin}
                L {o_xmax} {ymin}
                Z
                M {o_xmax - stroke} {ymin - stroke}
                L {o_xmin + stroke} {ymin - stroke}
                L {o_xmin + stroke} {ymax + stroke}
                L {o_xmax - stroke} {ymax + stroke}
                Z
                "
				fill="white"
				stroke="black"
				stroke-linejoin="round"
				fill-rule="evenodd"
			/>
		</g>

		<!--letter D-->
		<g id="d" class="hover-translate">
			<!-- shadows -->
			<path
				d="
                M {d_xmin} {ymax}
                L {d_xmin + shadow} {ymax - shadow}
                L {d_xmax - 0.5 * stroke + shadow} {ymax - shadow}
                L {d_xmax - 0.5 * stroke} {ymax}
                Z
                "
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {d_xmax - 0.5 * stroke} {ymax}
                L {d_xmax - 0.5 * stroke + shadow} {ymax - shadow}
                L {d_xmax + shadow} {ymax + 0.5 * stroke - shadow}
                L {d_xmax} {ymax + 0.5 * stroke}
                Z
                "
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {d_xmax} {ymax + 0.5 * stroke}
                L {d_xmax + shadow} {ymax + 0.5 * stroke - shadow}
                L {d_xmax + shadow} {ymin - 0.5 * stroke - shadow}
                L {d_xmax} {ymin - 0.5 * stroke}
                Z
                "
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {d_xmin + stroke} {ymax + stroke}
                L {d_xmin + stroke} {ymin - stroke}
                L {d_xmin + stroke + shadow} {ymin - stroke - shadow}
                L {d_xmin + stroke + shadow} {ymax + stroke}
                Z
                "
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {d_xmin + stroke} {ymin - stroke}
                L {d_xmin + stroke + shadow} {ymin - stroke - shadow}
                L {d_xmax - stroke} {ymin - stroke - shadow}
                L {d_xmax - stroke} {ymin - stroke}
                Z
                "
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>

			<!-- letter face -->
			<path
				d="
                M {d_xmax - 0.5 * stroke} {ymax}
                L {d_xmin} {ymax}
                L {d_xmin} {ymin}
                L {d_xmax - 0.5 * stroke} {ymin}
                L {d_xmax} {ymin - 0.5 * stroke}
                L {d_xmax} {ymax + 0.5 * stroke}
                Z
                M {d_xmax - stroke} {ymin - stroke}
                L {d_xmin + stroke} {ymin - stroke}
                L {d_xmin + stroke} {ymax + stroke}
                L {d_xmax - stroke} {ymax + stroke}
                Z
                "
				fill="white"
				stroke="black"
				stroke-linejoin="round"
				fill-rule="evenodd"
			/>
		</g>

		<!--dot-->
		<g id="dot" class="hover-translate">
			<!-- shadows -->
			<path
				d="
                M {dot_xmin} {ymin - stroke}
                L {dot_xmin + shadow} {ymin - stroke - shadow}
                L {dot_xmax + shadow} {ymin - stroke - shadow}
                L {dot_xmax} {ymin - stroke}
                Z
                "
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {dot_xmax} {ymin - stroke}
                L {dot_xmax + shadow} {ymin - stroke - shadow}
                L {dot_xmax + shadow} {ymin - shadow}
                L {dot_xmax} {ymin}
                Z
                "
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>

			<!-- letter face -->
			<path
				d="
                M {dot_xmax} {ymin - stroke}
                L {dot_xmin} {ymin - stroke}
                L {dot_xmin} {ymin}
                L {dot_xmax} {ymin}
                Z
                "
				fill="white"
				stroke="black"
				stroke-linejoin="round"
			/>
		</g>

		<!--letter X-->
		<g id="x" class="hover-translate">
			<!-- shadows -->
			<path
				d="
                M {x_xmin} {ymax}
                L {x_xmin + shadow} {ymax - shadow}
                L {x_xmin + stroke + shadow} {ymax - shadow}
                L {x_xmin + stroke} {ymax}
                Z
                "
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {x_xmin + stroke} {ymax}
                L {x_xmin + stroke + shadow} {ymax - shadow}
                L {x_xmin + stroke + shadow} {ymax + 1.5 * stroke - shadow}
                L {x_xmin + stroke} {ymax + 1.5 * stroke}
                Z
                "
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {x_xmin + stroke} {ymax + 1.5 * stroke}
                L {x_xmin + stroke + shadow} {ymax + 1.5 * stroke - shadow}
                L {x_xmin + 2 * stroke} {ymax + 1.5 * stroke - shadow}
                L {x_xmin + 2 * stroke} {ymax + 1.5 * stroke}
                Z
                "
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {x_xmax - stroke} {ymax}
                L {x_xmax - stroke + shadow} {ymax - shadow}
                L {x_xmax + shadow} {ymax - shadow}
                L {x_xmax} {ymax}
                Z
                "
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {x_xmax} {ymax}
                L {x_xmax + shadow} {ymax - shadow}
                L {x_xmax + shadow} {ymax + 1.5 * stroke - shadow}
                L {x_xmax} {ymax + 1.5 * stroke}
                Z
                "
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {x_xmax - 0.5 * stroke} {ymin - 2 * stroke}
                L {x_xmax - 0.5 * stroke + shadow} {ymin - 2 * stroke - shadow}
                L {x_xmax + shadow} {ymin - 1.5 * stroke - shadow}
                L {x_xmax} {ymin - 1.5 * stroke}
                Z
                "
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {x_xmax} {ymin - 1.5 * stroke}
                L {x_xmax + shadow} {ymin - 1.5 * stroke - shadow}
                L {x_xmax + shadow} {ymin - shadow}
                L {x_xmax} {ymin}
                Z
                "
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {x_xmin + stroke} {ymin - 1.5 * stroke}
                L {x_xmin + stroke} {ymin}
                L {x_xmin + stroke + shadow} {ymin - shadow}
                L {x_xmin + stroke + shadow} {ymin - 1.5 * stroke}
                Z
                "
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>

			<!-- letter face -->
			<path
				d="
                M {x_xmax} {ymax}
                L {x_xmax - stroke} {ymax}
                L {x_xmax - stroke} {ymax + 1.5 * stroke}
                L {x_xmin + stroke} {ymax + 1.5 * stroke}
                L {x_xmin + stroke} {ymax}
                L {x_xmin} {ymax}
                L {x_xmin} {ymax + 1.5 * stroke}
                L {x_xmin + 0.5 * stroke} {ymax + 2 * stroke}
                L {x_xmin} {ymin - 1.5 * stroke}
                L {x_xmin} {ymin}
                L {x_xmin + stroke} {ymin}
                L {x_xmin + stroke} {ymin - 1.5 * stroke}
                L {x_xmax - stroke} {ymin - 1.5 * stroke}
                L {x_xmax - stroke} {ymin - 1.5 * stroke}
                L {x_xmax - stroke} {ymin}
                L {x_xmax} {ymin}
                L {x_xmax} {ymin - 1.5 * stroke}
                L {x_xmax - 0.5 * stroke} {ymin - 2 * stroke}
                L {x_xmax} {ymax + 1.5 * stroke}
                Z
                "
				fill="white"
				stroke="black"
				stroke-linejoin="round"
			/>
		</g>

		<!--letter Y-->
		<g id="y" class="hover-translate">
			<!-- shadows -->
			<path
				d="
                M {y_xmin} {ymax}
                L {y_xmin + shadow} {ymax - shadow}
                L {y_xmin + stroke + shadow} {ymax - shadow}
                L {y_xmin + stroke} {ymax}
                Z
                "
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {y_xmin + stroke} {ymax}
                L {y_xmin + stroke + shadow} {ymax - shadow}
                L {y_xmin + stroke + shadow} {ymax + 1.5 * stroke - shadow}
                L {y_xmin + stroke} {ymax + 1.5 * stroke}
                Z
                "
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {y_xmin + stroke} {ymax + 1.5 * stroke}
                L {y_xmin + stroke + shadow} {ymax + 1.5 * stroke - shadow}
                L {y_xmin + 2 * stroke} {ymax + 1.5 * stroke - shadow}
                L {y_xmin + 2 * stroke} {ymax + 1.5 * stroke}
                Z
                "
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {y_xmax - stroke} {ymax}
                L {y_xmax - stroke + shadow} {ymax - shadow}
                L {y_xmax + shadow} {ymax - shadow}
                L {y_xmax} {ymax}
                Z
                "
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {y_xmax} {ymax}
                L {y_xmax + shadow} {ymax - shadow}
                L {y_xmax + shadow} {ymax + 2 * stroke - shadow}
                L {y_xmax} {ymax + 2 * stroke}
                Z
                "
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {y_xmax - stroke} {ymin - 1.5 * stroke}
                L {y_xmax - stroke} {ymin}
                L {y_xmax - stroke + shadow} {ymin - shadow}
                L {y_xmax - stroke + shadow} {ymin - stroke - shadow}
                Z
                "
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>

			<!-- letter face -->
			<path
				d="
                M {y_xmax} {ymax}
                L {y_xmax - stroke} {ymax}
                L {y_xmax - stroke} {ymax + 1.5 * stroke}
                L {y_xmin + stroke} {ymax + 1.5 * stroke}
                L {y_xmin + stroke} {ymax}
                L {y_xmin} {ymax}
                L {y_xmin} {ymax + 2 * stroke}
                L {y_xmin + 0.5 * stroke} {ymin - 1.5 * stroke}
                L {y_xmin + stroke} {ymin - 1.5 * stroke}
                L {y_xmin + stroke} {ymin}
                L {y_xmax - stroke} {ymin}
                L {y_xmax - stroke} {ymin - 1.5 * stroke}
                L {y_xmax - 0.5 * stroke} {ymin - 1.5 * stroke}
                L {y_xmax} {ymax + 2 * stroke}
                Z
                "
				fill="white"
				stroke="black"
				stroke-linejoin="round"
			/>
		</g>

		<!--letter Z-->
		<g id="z" class="hover-translate">
			<!-- shadows -->
			<path
				d="
                M {z_xmin} {ymax}
                L {z_xmin + shadow} {ymax - shadow}
                L {z_xmax + shadow} {ymax - shadow}
                L {z_xmax} {ymax}
                Z
                "
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {z_xmax} {ymax}
                L {z_xmax + shadow} {ymax - shadow}
                L {z_xmax + shadow} {ymax + stroke - shadow}
                L {z_xmax} {ymax + stroke}
                Z
                "
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {z_xmin + 1.25 * stroke} {ymin - stroke}
                L {z_xmin + 1.25 * stroke + shadow} {ymin - stroke - shadow}
                L {z_xmax + shadow} {ymin - stroke - shadow}
                L {z_xmax} {ymin - stroke}
                Z
                "
				fill={horizontalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>
			<path
				d="
                M {z_xmax} {ymin - stroke}
                L {z_xmax + shadow} {ymin - stroke - shadow}
                L {z_xmax + shadow} {ymin - shadow}
                L {z_xmax} {ymin}
                Z
                "
				fill={verticalShadowColor}
				stroke="black"
				stroke-linejoin="round"
			/>

			<!-- letter face -->
			<path
				d="
                M {z_xmax} {ymax}
                L {z_xmin} {ymax}
                L {z_xmin} {ymax + stroke}
                L {z_xmax - 1.25 * stroke} {ymax + stroke}
                L {z_xmin} {ymin - stroke}
                L {z_xmin} {ymin}
                L {z_xmax} {ymin}
                L {z_xmax} {ymin - stroke}
                L {z_xmin + 1.25 * stroke} {ymin - stroke}
                L {z_xmax} {ymax + stroke}
                Z
                "
				fill="white"
				stroke="black"
				stroke-linejoin="round"
			/>
		</g>
	</svg>
</div>

<style>
	.hover-translate {
		transition: transform 0.3s ease;
	}

	.hover-translate:hover {
		transform: translateY(-6px);
	}
</style>
