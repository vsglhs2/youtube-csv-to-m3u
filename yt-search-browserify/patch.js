// without this line will throw
process.versions.node = '16.0.0';

// need to surpass cors issues
const open = self.XMLHttpRequest.prototype.open;
self.XMLHttpRequest.prototype.open = function (
    method,
    url = undefined,
    ...args
) {
    const proxiedUrl = self.getProxiedUrl(url);
    
    return open.call(this, method, proxiedUrl, ...args);
}

const index = require('yt-search');
self.yts = index;