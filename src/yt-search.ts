import type yts from 'yt-search';

declare global {
    interface Window {
        require: CallableFunction | undefined;
        yts: typeof yts
    }
}

self.require = undefined;

// @ts-ignore
await import('/yt-search/deps.js');
// @ts-ignore
await import('/yt-search/bundle.js');

export default window.yts;