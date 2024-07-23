type GCodeCommand = {
	cmd?: string;
	X?: number;
	Y?: number;
	Z?: number;
	F?: number;
	S?: number;
	comment?: string;
};

export function parse_g_code_line(line: string): GCodeCommand | null {
	const gcode_regex =
		/^(G\d{2})?\s*(X-?\d*\.?\d*)?\s*(Y-?\d*\.?\d*)?\s*(Z-?\d*\.?\d*)?\s*(F\d*\.?\d*)?\s*(S\d*\.?\d*)?/;
	const match = line.match(gcode_regex);

	if (match) {
		const command: GCodeCommand = {};

		if (match[1]) command.cmd = match[1];
		if (match[2]) command.X = parseFloat(match[2].slice(1));
		if (match[3]) command.Y = parseFloat(match[3].slice(1));
		if (match[4]) command.Z = parseFloat(match[4].slice(1));
		if (match[5]) command.F = parseFloat(match[5].slice(1));
		if (match[6]) command.S = parseFloat(match[6].slice(1));

		return command;
	}

	return null;
}
