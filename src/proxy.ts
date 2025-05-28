declare global {
    function getProxiedUrl(url: string): string;
}

self.getProxiedUrl = getProxiedUrl;

let proxyScheme = import.meta.env.VITE_APP_PROXY_SCHEME;

export function getProxiedUrl(url: string) {
  const encoded = encodeURIComponent(url);

  return proxyScheme.replace('<%url%>', encoded);
}

export function setProxyScheme(scheme: string) {
    proxyScheme = scheme;
}

export function getProxyScheme() {
    return proxyScheme;
}

export function setupXMLHttpRequestProxy() {
    // need to surpass cors issues
    const open = self.XMLHttpRequest.prototype.open;
    self.XMLHttpRequest.prototype.open = function (
        method,
        url,
        async: boolean = false,
        username?: string | null,
        password?: string | null
    ) {
        const stringifiedUrl = String(url);
        const proxiedUrl = self.getProxiedUrl(stringifiedUrl);
        
        open.call(
            this,
            method,
            proxiedUrl,
            async,
            username,
            password
        );
    }
}