export type GCodeLine = {
	cmd?: string;
	X?: number;
	Y?: number;
	Z?: number;
	F?: number;
	S?: number;
};

export type Position = {
	x: number;
	y: number;
	z: number;
};

export type FeedRate = number;
