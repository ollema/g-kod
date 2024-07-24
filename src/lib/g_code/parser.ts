import {
	DEFAULT_LINEAR_INTERPOLATION_FEED_RATE,
	DEFAULT_RAPID_POSITIONING_FEED_RATE,
	G_CODE_REGEX,
	RAPID_POSITIONING
} from './constants';

import type { FeedRate, GCodeLine } from './types';

import { Vector3 } from 'three';

function parse_g_code_line(line: string | undefined): GCodeLine {
	const command: GCodeLine = {};

	if (!line) {
		return command;
	}

	const match = line.match(G_CODE_REGEX);

	if (match) {
		if (match[1]) {
			command.cmd = match[1];
		}
		if (match[2]) {
			command.X = parseFloat(match[2].slice(1));
		}
		if (match[3]) {
			command.Y = parseFloat(match[3].slice(1));
		}
		if (match[4]) {
			command.Z = parseFloat(match[4].slice(1));
		}
		if (match[5]) {
			command.F = parseFloat(match[5].slice(1));
		}
		if (match[6]) {
			command.S = parseFloat(match[6].slice(1));
		}
	}

	return command;
}

export function interpret_g_code_line(
	line: string,
	current_position: Vector3,
	current_feed_rate: FeedRate
): { new_position: Vector3; new_feed_rate: FeedRate } {
	const { cmd, X, Y, Z, F } = parse_g_code_line(line);

	return {
		new_position: new Vector3(
			X ?? current_position.x,
			Y ?? current_position.y,
			Z ?? current_position.z
		),
		new_feed_rate:
			cmd === RAPID_POSITIONING ? DEFAULT_RAPID_POSITIONING_FEED_RATE : F || current_feed_rate
	};
}

export function find_start_position(g_code: string[]): Vector3 {
	for (let i = 0; i < g_code.length; i++) {
		const command = parse_g_code_line(g_code[i]);
		if (command.cmd === RAPID_POSITIONING) {
			return new Vector3(command.X ?? 0, command.Y ?? 0, command.Z ?? 0);
		}
	}

	throw new Error('no start position found!');
}

export function find_max_dimensions(g_code: string[]): {
	x_max: number;
	y_max: number;
	z_max: number;
} {
	let x_max = 0;
	let y_max = 0;
	let z_max = 0;

	for (let i = 0; i < g_code.length; i++) {
		const command = parse_g_code_line(g_code[i]);
		if (command.X && command.X > x_max) x_max = command.X;
		if (command.Y && command.Y > y_max) y_max = command.Y;
		if (command.Z && command.Z > z_max) z_max = command.Z;
	}

	return { x_max, y_max, z_max };
}

export function find_tool_radius(g_code: string[]): number {
	const tool_regex = /tool - diameter: (\d*\.?\d*) mm/;
	for (let i = 0; i < g_code.length; i++) {
		const match = g_code[i].match(tool_regex);
		if (match) {
			const diameter = parseFloat(match[1]);
			return diameter / 2;
		}
	}

	throw new Error('no tool radius found!');
}

export function find_initial_feed_rate(g_code: string[]): number {
	for (let i = 0; i < g_code.length; i++) {
		const command = parse_g_code_line(g_code[i]);
		if (command.F) {
			return command.F;
		}
	}

	return DEFAULT_LINEAR_INTERPOLATION_FEED_RATE;
}
