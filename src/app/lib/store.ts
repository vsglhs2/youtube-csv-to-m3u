import { createInstance, INDEXEDDB } from 'localforage';

export function createStore<
    Scheme extends Record<string, unknown>,
>(name: string) {
	const store = createInstance({
		name: name,
		driver: INDEXEDDB,
	});

	return {
		get<Key extends keyof Scheme>(key: Key) {
			return store.getItem<Scheme[Key]>(key as string);
		},
		set<Key extends keyof Scheme>(key: Key, value: Scheme[Key]) {
			return store.setItem(key as string, value);
		},
		keys() {
			return store.keys() as unknown as Promise<keyof Scheme>;
		},
		clear() {
			return store.clear();
		},
	};
}

export type Store<
    Scheme extends Record<string, unknown>,
> = ReturnType<typeof createStore<Scheme>>;
