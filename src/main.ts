import yts from "./yt-search";

const proxyScheme = 'https://api.cors.lol?url=<%url%>';

function getProxiedUrl(url: string) {
  const encoded = encodeURIComponent(url);

  return proxyScheme.replace('<%url%>', encoded);
}

window.getProxiedUrl = getProxiedUrl;

const video = await yts( { videoId: '_4Vt0UGwmgQ' } )
console.log( video.title + ` (${ video.duration.timestamp })` )

// const response = await fetch(getProxiedUrl('https://youtube.com/watch?v=dp72kHM192g'));
// const text = await response.text();

