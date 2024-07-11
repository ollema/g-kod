// TODO: whyyyyyyyy
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as GleamTypes from '../build/dev/javascript/g_kod/g_kod.d.mts';

declare global {
	declare module '*.gleam' {
		export * from '../build/dev/javascript/g_kod/g_kod.d.mts';
	}
}
