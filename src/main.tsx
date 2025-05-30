import { wrap, type Remote } from "comlink";
import type { YTSearch } from "./yt-search";
import type { Session as RemoteSession } from "./worker";
import Papa from 'papaparse';
import type { ProxyScheme } from "./proxy";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import React from "react";

class Session {
    private worker: Worker;
    private remote: Remote<RemoteSession>;

    constructor() {
        this.worker = new Worker('/src/worker.ts', { type: "module" });
        this.remote = wrap<RemoteSession>(this.worker);
    }

    public async setupYTSearch() {
        const port = await this.remote.getYTSearchPort();

        // wrap<YTSearch> breaks correct parameters and return type infer
        return wrap(port) as unknown as YTSearch;
    }

    public getProxyScheme() {
        return this.remote.getProxyScheme();
    }

    public setProxyScheme(scheme: ProxyScheme) {
        return this.remote.setProxyScheme(scheme);
    }

    public release() {
        this.worker.terminate();
    }
}

class ThrottledQueue<T> {
    private items: Set<T>;

    constructor() {
        this.items = new Set();
    }

    public set(item: T) {
        this.items.add(item);
    }

    public remove(item: T) {
        this.items.delete(item);
    }

    public next(): T {
        return this.items.values().next().value!;
    }
}

// const session = new Session();
// const yts = await session.setupYTSearch();

const schemes: ProxyScheme[] = [
    { encode: true, pattern: 'https://corsproxy.io/?url=<%href%>' },
    { encode: true, pattern: 'https://api.cors.lol?url=<%href%>' },
    { encode: false, pattern: 'https://cors-anywhere.herokuapp.com/<%href%>' },
];

// await session.setProxyScheme(schemes[0]);

export async function parseCSVFromFile<T = unknown>(file: File) {
    const string = await file.text();

    return Papa.parse<T>(string, {
        skipEmptyLines: true,
        comments: false,
    });
}

type YTVideoId = string;

type YTItemAddedDate = string;
type YTPlaylistItem = [YTVideoId, YTItemAddedDate];

type YTSongTitle = string;
type YTAlbumTitle = string;
type YTArtistName = string;
type YTFavoriteItem = [
    YTVideoId,
    YTSongTitle,
    YTAlbumTitle,
    YTArtistName,
    YTArtistName,
    YTArtistName
];

// const input = document.querySelector('#file') as HTMLInputElement;
// input.addEventListener('change', async () => {
//     const { files } = input;
//     if (!files) return;

//     const [file] = files;

//     const parsed = await parseCSVFromFile<YTPlaylistItem>(file);
//     console.log(parsed.data);

//     const results: unknown[] = [];
//     const errors: unknown[] = [];
//     const promises: Promise<unknown>[] = [];

//     for (const [videoId] of parsed.data.slice(1)) {
//         const promise = yts({ videoId })
//             .then(result => results.push(result))
//             .catch(error => errors.push([videoId, error]));

//         promises.push(promise);
//     }

//     await Promise.allSettled(promises);

//     console.log(errors);
//     console.log(results);
// });

const rootElement = document.getElementById('app')!;
const root = createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)