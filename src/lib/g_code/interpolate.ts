import { CanvasTexture, Vector3 } from 'three';
import type { FeedRate } from './types';

export function interpolate(
	position: Vector3,
	target_position: Vector3,
	feed_rate: FeedRate,
	delta: number,
	speed: number,
	tool_radius: number,
	drawCtx: CanvasRenderingContext2D,
	heightMapCtx: CanvasRenderingContext2D,
	heightMap: CanvasTexture,
	z_max: number
): Vector3 {
	// calculate direction and total distance between current and target positions
	const direction = new Vector3().subVectors(target_position, position);
	const total_distance = direction.length();

	// if we are already at the target position, then exit early
	if (total_distance < 0.01) {
		return target_position;
	}

	// normalize the direction vector
	direction.normalize();

	// calculate the distance (mm)
	// that would be covered in delta (ms)
	// at the current feedrate (mm/min)
	const distance_covered = (feed_rate / (60 * 1000)) * delta;

	// scale the distance covered by the speed factor
	const scaled_distance_covered = distance_covered * Math.pow(speed, 2.25);

	let new_position: Vector3;

	if (scaled_distance_covered >= total_distance) {
		// if the distance covered is greater than the total distance,
		// then we can reach the target position
		new_position = target_position;
	} else {
		// otherwise calculate the travel distance
		const travel_distance = Math.min(scaled_distance_covered, total_distance);

		// and then calculate the new position
		new_position = new Vector3().addVectors(position, direction.multiplyScalar(travel_distance));
	}

	// get image data from the canvas
	const imageData = drawCtx.getImageData(0, 0, drawCtx.canvas.width, drawCtx.canvas.height);
	const data = imageData.data;

	// set z color based on tool height.
	const z_color = Math.round(Math.abs(new_position.z / z_max) * 255);

	// modify image data directly
	const radius = Math.round(tool_radius);
	const x_center = Math.round(new_position.x);
	const y_center = Math.round(drawCtx.canvas.height - new_position.y);
	for (let y = y_center - radius; y <= y_center + radius; y++) {
		for (let x = x_center - radius; x <= x_center + radius; x++) {
			if (x >= 0 && x < drawCtx.canvas.width && y >= 0 && y < drawCtx.canvas.height) {
				const dx = x - x_center;
				const dy = y - y_center;
				if (dx * dx + dy * dy <= radius * radius) {
					const index = (y * drawCtx.canvas.width + x) * 4;
					data[index + 0] = z_color; // red
					data[index + 1] = z_color; // green
					data[index + 2] = z_color; // blue
					data[index + 3] = 255; // alpha
				}
			}
		}
	}

	drawCtx.putImageData(imageData, 0, 0);

	// copy and mirror drawCtx to heightMapCtx along both x and y axes
	heightMapCtx.clearRect(0, 0, heightMapCtx.canvas.width, heightMapCtx.canvas.height);
	heightMapCtx.save();
	heightMapCtx.scale(-1, -1);
	heightMapCtx.drawImage(drawCtx.canvas, -drawCtx.canvas.width, -drawCtx.canvas.height);
	heightMapCtx.restore();

	heightMap.needsUpdate = true;

	return new_position;
}
