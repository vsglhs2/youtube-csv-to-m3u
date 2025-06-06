import { expose, transfer } from 'comlink';

import { getProxyScheme, setProxyScheme, setupXMLHttpRequestProxy } from './proxy';
import { initYTSearch  } from './yt-search';
import type {YTSearch} from './yt-search';

function walkAndMutateRecursive(
	object: Record<PropertyKey, unknown>,
	callback: (key: PropertyKey, value: unknown) => unknown,
) {
	const entries = Object.entries(object);
	for (const [key, value] of entries) {
		if (object[key] && typeof object[key] === 'object') {
			// @ts-expect-error object[key] is infers like {}
			walkAndMutateRecursive(object[key], callback);

			continue;
		}

		object[key] = callback(key, value);
	}
}

async function setupYTSearch(): Promise<YTSearch> {
	const yts = await initYTSearch();

	return new Proxy<YTSearch>(yts, {
		// TODO: implement get handler?
		async apply(target, thisArg, argArray: [never]) {
			const promise = target.apply(thisArg, argArray);

			return promise.then((result) => {
				if (!(result && result instanceof Object)) {
					return result;
				}

				walkAndMutateRecursive(
					result as unknown as Record<string, unknown>,
					(_, value) => {
						if (typeof value !== 'function') return value;

						return null;
					},
				);

				return result;
			});
		},
	});
}

export class Session {
	constructor() {
		setupXMLHttpRequestProxy();
	}

	async getYTSearchPort() {
		console.log('setup yt-search in worker');
		const yts = await setupYTSearch();
		const { port1, port2 } = new MessageChannel();

		expose(yts, port1);

		return transfer(port2, [port2]);
	}

	getProxyScheme = getProxyScheme;
	setProxyScheme = setProxyScheme;
}

const session = new Session();
expose(session);
