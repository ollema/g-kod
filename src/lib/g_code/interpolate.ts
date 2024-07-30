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
	path: { x: number; y: number }[],
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

	// add the new position to the path
	path.push({ x: new_position.x, y: new_position.y });

	// clear canvas
	drawCtx.clearRect(0, 0, drawCtx.canvas.width, drawCtx.canvas.height);
	drawCtx.fillStyle = 'black';
	drawCtx.fillRect(0, 0, drawCtx.canvas.width, drawCtx.canvas.height);

	// draw the entire path
	drawCtx.beginPath();
	drawCtx.moveTo(path[0].x, path[0].y);
	for (let i = 1; i < path.length; i++) {
		drawCtx.lineTo(path[i].x, path[i].y);
	}

	// set stroke color based on tool depth. white for max depth, black for min depth
	// z is negative but z max is positive
	const z = Math.abs(new_position.z);
	const z_min = 0;
	const z_range = z_max - z_min;
	const z_normalized = (z - z_min) / z_range;
	const z_color = 255 - Math.round(255 * z_normalized);
	console.log(z_color);
	drawCtx.strokeStyle = `rgb(${z_color}, ${z_color}, ${z_color})`;
	drawCtx.lineWidth = tool_radius * 2;
	drawCtx.stroke();

	// copy and mirror drawCtx to heightMapCtx along both x and y axes
	heightMapCtx.clearRect(0, 0, heightMapCtx.canvas.width, heightMapCtx.canvas.height);
	heightMapCtx.save();
	heightMapCtx.scale(-1, -1);
	heightMapCtx.drawImage(drawCtx.canvas, -drawCtx.canvas.width, -drawCtx.canvas.height);
	heightMapCtx.restore();

	heightMap.needsUpdate = true;

	return new_position;
}
