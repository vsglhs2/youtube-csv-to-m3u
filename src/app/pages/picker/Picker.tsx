import { useEffect, useReducer, useRef, useState   } from 'react';
import type {FC, ReactNode} from 'react';
import { ListRestart, MoreHorizontal } from 'lucide-react';
import type { ZodError } from 'zod/v4';
import { z } from 'zod/v4';
import { wrap  } from 'comlink';
import type {Remote} from 'comlink';

import { DataTable } from '@/shadcn/components/data-table';
import { CsvImporter } from '@/shadcn/components/csv-importer';
import { createColumnsOptions, createGridRenderer, createPaginationConfig, createTableConfig, createToolbarItems, getDefaultPaginationConfig } from '@/shadcn/lib/table-config';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/ui/popover';
import { Button } from '@/shadcn/components/ui/button';
import type {ProxyScheme} from '@/proxy';
import type { YTSearch } from '@/yt-search';
import type { Session as RemoteSession } from '@/worker';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/shadcn/components/ui/hover-card';
import { Badge } from '@/shadcn/components/ui/badge';
import type { ComboboxStatus } from '@/shadcn/components/combobox';
import { ComboboxPopover  } from '@/shadcn/components/combobox';
import type {ComboboxPopoverStatusCallback} from '@/shadcn/components/combobox';

const authorSchema = z.object({
	name: z.string(),
	url: z.url(),
});

// reconsider song schema

const songSchema = z.object({
	id: z.string(),

	title: z.string(),
	description: z.string().optional(),

	duration: z.number().gte(0),
	uploadDate: z.iso.datetime({ offset: true }),

	imageUrl: z.url(),
	url: z.url(),

	albumTitle: z.string().optional(),

	authorName: z.string(),
	authorUrl: z.url(),
});

const playlistItemSchema = z.object({
	id: z.string(),
	createDate: z.iso.datetime({ offset: true }),
});

const playlistSchema = z.object({
	id: z.string(),

	title: z.string(),

	uploadDate: z.iso.datetime({ offset: true }),
	updateDate: z.iso.datetime({ offset: true }),

	image: z.url(),
	url: z.url().optional(),

	size: z.number().gte(0),
	videos: z.array(playlistItemSchema),
});

const favoritesSchema = z.array(songSchema);

type Author = z.infer<typeof authorSchema>;
type Song = z.infer<typeof songSchema>;
type Playlist = z.infer<typeof playlistSchema>;
type Favorites = z.infer<typeof favoritesSchema>;

const partialSongSchema = songSchema.partial();

const pretransformedSongSchema = z.union([
	partialSongSchema.required({
		id: true,
	}),
	partialSongSchema.required({
		title: true,
		authorName: true,
	}),
]);

const pretransformedFavoritesSchema = z.array(pretransformedSongSchema);
type PretansformedFavorites = z.infer<typeof pretransformedFavoritesSchema>;

// const a = partialSongSchema.keyof().options;

// export const columns = createColumnsOptions<S>(c => [
// 	c.select(),
// 	c.cell({
// 		accessor: 'videoId',
// 		header: 'Video Id',
// 		sorting: false,
// 	}),
// 	c.cell({
// 		accessor: 'songTitle',
// 		header: 'Song title',
// 		hiding: false,
// 	}),
// 	c.cell({
// 		accessor: 'albumTitle',
// 		header: 'Album title',
// 	}),
// 	c.cell({
// 		accessor: 'artistName1',
// 		header: 'Artist name1',
// 	}),
// 	c.actions({
// 		label: 'Delete',
// 		onClick(data) {
// 			console.log('Delete:', data);
// 		},
// 		onGroup(data) {
// 			console.log('Delete group:', data);
// 		},
// 	}),
// ]);

// const toolbar = createToolbarItems<Favorites>(
// 	{
// 		type: 'search',
// 		columnId: 'songTitle',
// 		pluralTitle: 'songs',
// 	}, {
// 	type: 'filter',
// 	columnId: 'artistName1',
// 	options: [{
// 		label: 'Low',
// 		value: 'low',
// 		icon: ArrowDown,
// 	}],
// 	title: 'Song title',
// },
// );

// const gridRenderer = createGridRenderer<Favorites>(
// 	data => ({
// 		name: data.videoId,
// 		description: data.songTitle ?? 'No song title',
// 		cta: 'Download',
// 		onClick: () => console.log(data),
// 		Icon: FileIcon,
// 	}),
// );

// const pagination = createPaginationConfig();

// const config = createTableConfig(columns, {
// 	pagination,
// 	toolbar,
// 	renderer: gridRenderer,
// });

function createTableFromData<TData>(data: TData[]) {
	const keys = data[0] ? Object.keys(data[0]) : [];
	const columns = createColumnsOptions<TData>((c) => keys.map((key) => c.cell({
		accessor: key as keyof TData,
		header: key,
		hiding: false,
		sorting: false,
	})));

	const pagination = createPaginationConfig({ enable: false });

	return createTableConfig(columns, {
		pagination,
	});
}

function createTransformTableConfigFromData<
	TData extends Record<string, unknown>,
>(data: TData[], session: Session) {
	const { transforms, canStart, start } = useDataTransforms(data, session);
	console.log('Transforms', transforms);

	const columns = createColumnsOptions<Transform<TData, Song>>((c) => [
		c.select(),
		c.cell({
			id: 'status',
			header: 'Status',
			cell({ row }) {
				const renderedBadge = (
					<Badge>
						{row.original.state.type}
					</Badge>
				);

				const { state: status } = row.original;
				let renderedContent: ReactNode = null;

				if (status.type === 'success') {
					const rowData = [status.payload.data];

					const config = createTableFromData(rowData);
					config.mode = 'columns';

					renderedContent = (
						<DataTable data={rowData} config={config} />
					);
				}

				if (status.type === 'failed') renderedContent = (
					String(status.payload.error)
				);

				if (status.type === 'queueing') renderedContent = (
					`Queued on ${status.payload.place}`
				);

				return (
					<Popover>
						<PopoverTrigger>
							<Button
								variant="ghost"
								className="flex p-0 data-[state=open]:bg-muted"
							>
								{renderedBadge}
							</Button>
						</PopoverTrigger>
						<PopoverContent className='w-fit p-0 m-0'>
							{renderedContent}
						</PopoverContent>
					</Popover>
				);
			},
			previewing: false,
		}),
		c.cell({
			id: 'view',
			header: 'Data',
			cell({ row }) {
				const rowData = [row.original.source];

				const config = createTableFromData(rowData);
				config.mode = 'columns';

				return (
					<Popover>
						<PopoverTrigger>
							<Button
								variant="ghost"
								className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
							>
								<MoreHorizontal />
								<span className="sr-only">View</span>
							</Button>
						</PopoverTrigger>
						<PopoverContent className='w-fit p-0 m-0'>
							<DataTable data={rowData} config={config} />
						</PopoverContent>
					</Popover>
				);
			},
			previewing: false,
		}),
		c.actions({
			label: 'Restart',
			icon: ListRestart,
			onClick(data) {
				const { original: transform } = data;
				start(transform.id);
			},
			canClick(data) {
				return canStart(data.original.id);
			},
		}),
	]);

	const { pageSizes } = getDefaultPaginationConfig();
	if (data.length > (pageSizes.at(-1) ?? 0)) {
		pageSizes.push(data.length);
	}

	const pagination = createPaginationConfig({
		pageSizes: pageSizes,
	});
	const config = createTableConfig(columns, {
		pagination: pagination,
	});

	return {
		config,
		transforms,
	};
}

class Session {
	private worker: Worker;
	private remote: Remote<RemoteSession>;

	constructor() {
		this.worker = new Worker('/src/worker.ts', { type: 'module' });
		this.remote = wrap<RemoteSession>(this.worker);
	}

	public async setupYTSearch() {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		const port = await this.remote.getYTSearchPort();

		// wrap<YTSearch> breaks correct parameters and return type infer
		return wrap(port) as unknown as YTSearch;
	}

	public getProxyScheme() {
		return this.remote.getProxyScheme();
	}

	public setProxyScheme(scheme: ProxyScheme) {
		console.log('Setting proxy scheme:', scheme);
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

const schemes: ProxyScheme[] = [
	{ name: 'corsproxy.io', encode: true, pattern: 'https://corsproxy.io/?url=<%href%>' },
	{ name: 'cors.lol', encode: true, pattern: 'https://api.cors.lol?url=<%href%>' },
	{ name: 'cors-anywhere', encode: false, pattern: 'https://cors-anywhere.herokuapp.com/<%href%>' },
	{ name: 'local', encode: false, pattern: 'http://localhost:8080/<%href%>' },
];

function useYTSearch(session: Session) {
	const [resolvers] = useState(() => Promise.withResolvers<YTSearch>());

	useEffect(() => {
		const controller = new AbortController();

		console.log('setup yt-search inside hook');
		session
			.setupYTSearch()
			.then((yts) => {
				window.yts = yts;
				console.log('got yt-search inside hook', controller.signal.aborted);
				if (controller.signal.aborted) return;

				resolvers.resolve(yts);

			})
			.catch((reason) => {
				console.log('error inside hook');

				console.error(reason);
			});


		return () => {
			console.log('aborted yt-search inside hook');

			controller.abort();
		};
	}, []);

	return resolvers.promise;
}

const session = new Session();

function useSession() {
	// const [session] = useState(() => {
	// 	return new Session();
	// });

	// useEffect(() => {
	// 	session.release();
	// }, [session]);

	return session;
}

type TransformSession = {
	queue(): Promise<YTSearch>;
	release(): void;
};

class ReleaseQueueSessionError extends Error { }

function createTransformSession(ytsPromise: Promise<YTSearch>): TransformSession {
	const controller = new AbortController();

	function throwIfReleased() {
		if (!controller.signal.aborted) {
			return;
		}

		throw new ReleaseQueueSessionError();
	}

	return {
		async queue() {
			throwIfReleased();

			const yts = await ytsPromise;
			throwIfReleased();

			return function TransformSession(...args: Parameters<YTSearch>) {
				throwIfReleased();

				return yts(...args);
			} as YTSearch;
		},
		release() {
			controller.abort();
		},
	};
}

export type TransformError<PreTransform> = ZodError | unknown;

export type TransformState<PreTransform, Transform> =
	| {
		type: 'idle';
		payload: Record<never, unknown>;
	}
	| {
		type: 'stopped';
		payload: Record<never, unknown>;
	}
	| {
		type: 'released';
		payload: Record<never, unknown>;
	}
	| {
		type: 'queueing';
		payload: {
			place: number;
		};
	}
	| {
		type: 'pending';
		payload: {
			status: string;
		};
	}
	| {
		type: 'failed';
		payload: {
			error: TransformError<PreTransform>;
		};
	}
	| {
		type: 'success';
		payload: {
			data: Transform;
		};
	};

export type Transform<PreTransform, Transform> = {
	readonly id: number;
	readonly state: TransformState<PreTransform, Transform>;
	readonly source: PreTransform;
	start(): void;
	stop(): void;
	cleanup(): void;
};

// export function createTransform<PreTransform, Transform>(

// ) {
// 	return createFavoritesTransform<PreTransform>();
// }

function createFavoritesTransform<
	TData extends Record<string, unknown>,
>(
	id: number,
	data: TData,
	session: TransformSession,
	onTransformState: (state: TransformState<TData, Song>) => void,
): Transform<TData, Song> {
	const controller = new AbortController();
	let state: TransformState<TData, Song> = {
		type: 'idle',
		payload: {},
	};

	function setTransformState(newState: TransformState<TData, Song>) {
		state = newState;
		onTransformState(state);
	}

	setTransformState(state);

	async function* transform(): AsyncGenerator<TransformState<TData, Song>> {
		try {
			yield {
				type: 'queueing',
				payload: {
					place: 1,
				},
			};

			const search = await session.queue();

			yield {
				type: 'pending',
				payload: {
					status: 'Querying yt-search session',
				},
			};

			if ('id' in data) {
				const query = await search({ videoId: data.id as string });
				const song = songSchema.parse({
					id: query.videoId,

					title: query.title,
					description: query.description,

					duration: query.duration.seconds,
					uploadDate: new Date(query.uploadDate).toISOString(),

					imageUrl: query.thumbnail,
					url: query.url,

					albumTitle: '',

					authorName: query.author.name,
					authorUrl: query.author.url,
				});

				const transformed = songSchema.parse({
					...song,
					...data,
				});

				yield {
					type: 'success',
					payload: {
						data: transformed,
					},
				};
			}

			if ('title' in data && 'authorName' in data) {
				const result = await search(`${data.title} - ${data.authorName}`);

				const candidates = result.videos;
				const candidate = candidates[0];

				if (!candidate) {
					throw new Error('These is no relevant video with such title and author');
				}

				const query = await search({ videoId: candidate.videoId });

				const song = songSchema.parse({
					id: query.videoId,

					title: query.title,
					description: query.description,

					duration: candidate.duration.seconds,
					uploadDate: new Date(query.uploadDate).toISOString(),

					imageUrl: query.thumbnail,
					url: query.url,

					albumTitle: '',

					authorName: query.author.name,
					authorUrl: query.author.url,
				});

				const transformed = songSchema.parse({
					...song,
					...data,
				});

				yield {
					type: 'success',
					payload: {
						data: transformed,
					},
				};
			}
		} catch (error) {
			if (error instanceof ReleaseQueueSessionError) {
				yield {
					type: 'released',
					payload: {},
				};

				return;
			}

			yield {
				type: 'failed',
				payload: {
					error: error,
				},
			};
		}
	}

	async function processTransform() {
		for await (const newState of transform()) {
			console.log('New state', newState);
			if (state.type === 'stopped') break;

			setTransformState(newState);
		}
	}

	function cleanup() {
		controller.abort();
	}

	return {
		id,
		source: data,
		get state() {
			return state;
		},
		cleanup: cleanup,
		start: () => {
			processTransform();
		},
		stop: () => {
			cleanup();

			setTransformState({
				type: 'stopped',
				payload: {
				},
			});
		},
	};
}

function useDataTransforms<
	TData extends Record<string, unknown>,
>(data: TData[], session: Session) {
	const ytsPromise = useYTSearch(session);
	const transformsRef = useRef<Transform<TData, Song>[]>([]);

	// TODO: get rid of forced rerender
	const [, rerender] = useReducer((x) => x + 1, 0);

	useEffect(() => {
		const transforms: Transform<TData, Song>[] = [];

		for (const [id, row] of data.entries()) {
			const session = createTransformSession(ytsPromise);
			const transform = createFavoritesTransform(
				id,
				row,
				session,
				() => {
					rerender();
					console.log('Rerender', data, transforms, transformsRef);
				},
			);

			transform.start();

			transforms.push(transform);
		}

		transformsRef.current = transforms;

		return () => {
			for (const transform of transforms) {
				transform.cleanup();
			}
		};
	}, [data]);

	function canStart(id: number) {
		return (
			transformsRef.current[id].state.type !== 'pending' &&
			transformsRef.current[id].state.type !== 'queueing'
		);
	}

	return {
		transforms: transformsRef.current,
		start(id: number) {
			if (!canStart(id)) {
				return;
			}

			return transformsRef.current[id].start();
		},
		stop(id: number) {
			return transformsRef.current[id].stop();
		},
		canStart,
	};
}

export type ProxySettingsProps = {
	session: Session;
};

export function ProxySettings({ session }: ProxySettingsProps) {
	const [proxySchemes, setProxySchemes] = useState<ProxyScheme[]>(schemes);
	const [activeScheme, setActiveScheme] = useState<ProxyScheme | null>(null);

	const statuses = proxySchemes.map<ComboboxStatus>((scheme) => ({
		label: scheme.name,
		value: scheme.name,
	}));
	const config = createTableFromData(proxySchemes);

	const onStatus: ComboboxPopoverStatusCallback = (status) => {
		const scheme = proxySchemes.find((s) => s.name === status?.value) ?? null;
		setActiveScheme(scheme);
	};

	useEffect(() => {
		if (!activeScheme) {
			return;
		}

		session.setProxyScheme(activeScheme);
	}, [session, activeScheme]);

	return (
		<>
			<DataTable data={proxySchemes} config={config} />
			<ComboboxPopover
				label='Active proxy'
				initialLabel='Set proxy'
				statuses={statuses}
				onStatus={onStatus}
			/>
		</>
	);
}

export const PickerPage: FC = () => {
	const session = useSession();

	const [data, setData] = useState<PretansformedFavorites>([]);
	const fields = partialSongSchema.keyof().options.map((key) => ({
		label: key,
		value: key,
	}));

	const {
		config,
		transforms,
	} = createTransformTableConfigFromData(data, session);

	return (
		<>
			<ProxySettings session={session} />
			<CsvImporter
				fields={fields}
				onImport={(parsedData) => {
					const formattedData = pretransformedFavoritesSchema.safeParse(parsedData);
					console.log(formattedData);

					if (!formattedData.success) {
						throw formattedData.error;
					}

					setData(formattedData.data);
				}}
				className="self-end"
			/>
			<DataTable data={transforms} config={config} />
		</>
	);
};
