import { setupXMLHttpRequestProxy } from "./proxy";
import { setupYTSearch } from "./yt-search"

setupXMLHttpRequestProxy();
const yts = await setupYTSearch();

const video = await yts( { videoId: '_4Vt0UGwmgQ' } )
console.log( video.title + ` (${ video.duration.timestamp })` )

// const response = await fetch(getProxiedUrl('https://youtube.com/watch?v=dp72kHM192g'));
// const text = await response.text();

