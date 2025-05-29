declare global {
    function getProxiedUrl(url: string): string;
}

self.getProxiedUrl = getProxiedUrl;

export type ProxyScheme = {
    encode: boolean;
    pattern: string;
};

type ParsedProxyScheme = ProxyScheme & {
    keys: (keyof URL)[];
};

class ProxySchemeError extends Error {
    public scheme: ProxyScheme;

    constructor(scheme: ProxyScheme, message: string) {
        super(message);

        this.scheme = scheme;
    }
}

class InsufficientProxySchemeError extends ProxySchemeError {
    constructor(scheme: ProxyScheme) {
        const message = `Pattern ${scheme.pattern} must include at least on <%url_key%>`;
        super(scheme, message);
    }
}

class MalformedProxySchemeError extends ProxySchemeError {
    constructor(scheme: ProxyScheme) {
        const message = `Pattern ${scheme.pattern} must include only parts of URL`;
        super(scheme, message);
    }
}

function getProxySchemeKeys() {
    const url = new URL(location.href);
    const keys = Object.keys(Object.getPrototypeOf(url)) as (keyof URL)[];
    const substitutableKeys: (keyof URL)[] = [];

    for (const key of keys) {
        if (typeof url[key] !== 'string') continue;

        substitutableKeys.push(key);
    }

    console.log(substitutableKeys);

    return substitutableKeys;
}

const keys = getProxySchemeKeys();


function parseProxyScheme(scheme: ProxyScheme): ParsedProxyScheme {
    const result = scheme.pattern.match(/\<\%(\w+)\%\>/);
    if (!result || result.length <= 1) {
        throw new InsufficientProxySchemeError(scheme);
    }

    const candidates = result.slice(1);
    const keys: (keyof URL)[] = [];

    for (const key of candidates) {
        if (!isProxySchemeKey(key)) {
            throw new MalformedProxySchemeError(scheme);
        }

        keys.push(key);
    }

    return {
        ...scheme,
        keys,
    };
}

export function isProxySchemeParsable(scheme: ProxyScheme) {
    try {
        parseProxyScheme(scheme);
        return true;
    } catch (error) {
        console.error(error);

        return false;
    }
}

function isProxySchemeKey(key: keyof URL | string): key is keyof URL {
    return keys.includes(key as keyof URL);
}

export function getProxiedUrl(url: string) {
    const parsed = new URL(url);
    let final = proxyScheme.pattern;

    for (const key of proxyScheme.keys) {
        const value = parsed[key] as string;
        const encoded = proxyScheme.encode ? encodeURIComponent(value) : value;

        final = final.replace(`<%${key}%>`, encoded);
    }

    return final;
}

export function setProxyScheme(scheme: ProxyScheme) {
    proxyScheme = parseProxyScheme(scheme);
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

let proxyScheme: ParsedProxyScheme = parseProxyScheme({
    encode: true,
    pattern: import.meta.env.VITE_APP_PROXY_SCHEME,
});
