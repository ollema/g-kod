// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from '../build/dev/javascript/g_kod/g_kod.d.mts';

declare global {
	namespace App {}

	declare module '*/g_kod.gleam' {
		export * from '../build/dev/javascript/g_kod/g_kod.d.mts';
	}
}

export {};
