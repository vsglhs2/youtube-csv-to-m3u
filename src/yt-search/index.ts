import type ytsearch from 'yt-search';

declare global {
    // eslint-disable-next-line no-var
    var yts: typeof ytsearch;
}

export async function initYTSearch(): Promise<YTSearch> {
	// @ts-expect-error just define require so deps script won't throw error
	self.require = function () {};

	await import('./deps.js');
	await import('./bundle.js');

	return self.yts;
}

export type YTSearch = typeof ytsearch;
