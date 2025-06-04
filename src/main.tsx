import Papa from 'papaparse';
import { createRoot } from 'react-dom/client';
import React from 'react';

import { App } from './app/components';

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
    YTArtistName,
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
	</React.StrictMode>,
);
