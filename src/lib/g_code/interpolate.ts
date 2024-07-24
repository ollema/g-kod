import { Vector3 } from 'three';
import type { FeedRate } from './types';

export function interpolate(
	position: Vector3,
	target_position: Vector3,
	feed_rate: FeedRate,
	delta: number,
	speed: number
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

	// compare the distance distance_covered with the total distance
	if (scaled_distance_covered >= total_distance) {
		return target_position;
	}

	// calculate the travel distance
	const travel_distance = Math.min(scaled_distance_covered, total_distance);

	// return the new position
	return new Vector3().addVectors(position, direction.multiplyScalar(travel_distance));
}
