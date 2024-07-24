export const RAPID_POSITIONING = 'G00';
export const LINEAR_INTERPOLATION = 'G01';
export const DEFAULT_RAPID_POSITIONING_FEED_RATE = 5000;
export const DEFAULT_LINEAR_INTERPOLATION_FEED_RATE = 2000;

export const G_CODE_REGEX =
	/^(G\d{2})?\s*(X-?\d*\.?\d*)?\s*(Y-?\d*\.?\d*)?\s*(Z-?\d*\.?\d*)?\s*(F\d*\.?\d*)?\s*(S\d*\.?\d*)?/;
