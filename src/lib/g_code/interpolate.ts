import { Vector3 } from 'three';
import type { FeedRate, Position } from './types';

export function interpolate(
	current_position: Position,
	target_position: Position,
	feed_rate: FeedRate,
	delta: number,
	speed: number
): Position {
	const current_vec = new Vector3(current_position.x, current_position.y, current_position.z);
	const target_vec = new Vector3(target_position.x, target_position.y, target_position.z);

	// calculate the direction vector and total distance
	const direction = new Vector3().subVectors(target_vec, current_vec);
	const total_distance = direction.length();

	// check if total distance is zero or close to zero to avoid division by zero
	if (total_distance < 0.01) {
		return target_position;
	}

	// normalize the direction vector
	direction.normalize();

	// calculate the distance that would be covered in delta ms at the current feedrate
	const distance_covered = (feed_rate / 60000) * delta;

	// scale the distance covered by speed
	const scaled_distance_covered = distance_covered * Math.pow(speed, 2.25);

	// compare the travelable distance with the total distance
	if (scaled_distance_covered >= total_distance) {
		return target_position;
	}

	// travel how far we can along the direction vector
	const travel_distance = Math.min(scaled_distance_covered, total_distance);
	const new_position_vec = new Vector3().addVectors(
		current_vec,
		direction.multiplyScalar(travel_distance)
	);

	const new_position = { x: new_position_vec.x, y: new_position_vec.y, z: new_position_vec.z };

	return new_position;
}
