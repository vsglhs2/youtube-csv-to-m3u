import type yts from 'yt-search';

declare global {
    interface Window {
        require: CallableFunction | undefined;
        yts: typeof yts
    }
}

export async function setupYTSearch() {
    self.require = undefined;

    // @ts-ignore
    await import('./deps.js');
    // @ts-ignore
    await import('./bundle.js');

    return window.yts;
}
