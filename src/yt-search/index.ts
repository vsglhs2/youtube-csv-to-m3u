import type ytsearch from 'yt-search';

declare global {
    var require: CallableFunction | undefined;
    var yts: typeof ytsearch;
}

export async function initYTSearch(): Promise<YTSearch> {
    self.require = undefined;

    // @ts-ignore
    await import('./deps.js');
    // @ts-ignore
    await import('./bundle.js');

    return self.yts;
}

export type YTSearch = typeof ytsearch;