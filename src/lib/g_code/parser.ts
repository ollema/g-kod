import type { FeedRate, Position, GCodeLine } from './types';

const DEFAULT_G00_FEED_RATE = 5000;
const DEFAULT_G01_FEED_RATE = 2000;

const G_CODE_REGEX =
	/^(G\d{2})?\s*(X-?\d*\.?\d*)?\s*(Y-?\d*\.?\d*)?\s*(Z-?\d*\.?\d*)?\s*(F\d*\.?\d*)?\s*(S\d*\.?\d*)?/;

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
	current_position: Position,
	current_feed_rate: FeedRate
): { new_position: Position; new_feed_rate: FeedRate } {
	const { cmd, X, Y, Z, F } = parse_g_code_line(line);

	return {
		new_position: {
			x: X ?? current_position.x,
			y: Y ?? current_position.y,
			z: Z ?? current_position.z
		},
		new_feed_rate: cmd === 'G00' ? DEFAULT_G00_FEED_RATE : F || current_feed_rate
	};
}

export function find_start_position(g_code: string[]): { x: number; y: number; z: number } {
	for (let i = 0; i < g_code.length; i++) {
		const command = parse_g_code_line(g_code[i]);
		if (command.cmd === 'G00') {
			return { x: command.X ?? 0, y: command.Y ?? 0, z: command.Z ?? 0 };
		}
	}

	return { x: 0, y: 0, z: 0 };
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

	return 0;
}

export function find_initial_feed_rate(g_code: string[]): number {
	for (let i = 0; i < g_code.length; i++) {
		const command = parse_g_code_line(g_code[i]);
		if (command.F) {
			return command.F;
		}
	}

	return DEFAULT_G01_FEED_RATE;
}
