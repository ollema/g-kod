import { CanvasTexture } from 'three';

export function generate_displacement_map(width: number, height: number): HTMLCanvasElement {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const context = canvas.getContext('2d');

	if (context) {
		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);

		// Here you can draw your displacement details
		// For example, draw a gradient for testing:
		const gradient = context.createLinearGradient(0, 0, width, height);
		gradient.addColorStop(0, 'black');
		gradient.addColorStop(1, 'white');
		context.fillStyle = gradient;
		context.fillRect(0, 0, width, height);
	}

	return canvas;
}

export function create_displacement_texture(width: number, height: number): CanvasTexture {
	const canvas = generate_displacement_map(width, height);
	const texture = new CanvasTexture(canvas);
	return texture;
}
