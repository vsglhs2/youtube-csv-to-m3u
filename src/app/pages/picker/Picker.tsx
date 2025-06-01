import { useState, type FC } from 'react';
import { string, z } from 'zod';
import { ArrowDown, FileIcon } from 'lucide-react';

import { DataTable } from '@/shadcn/components/data-table';
import { CsvImporter } from '@/shadcn/components/csv-importer';
import { createColumnsOptions, createGridRenderer, createPaginationConfig, createTableConfig, createToolbarItems } from '@/shadcn/lib/table-config';

export const favoriteScheme = z.object({
	videoId: string(),
	songTitle: string().optional(),
	albumTitle: string().optional(),
	artistName1: string().optional(),
	artistName2: string().optional(),
	artistName3: string().optional(),
});

export type Favorite = z.infer<typeof favoriteScheme>;

export const columns = createColumnsOptions<Favorite>(c => [
	c.select(),
	c.cell({
		id: 'videoId',
		header: 'Video Id',
		sorting: false,
	}),
	c.cell({
		id: 'songTitle',
		header: 'Song title',
		hiding: false,
	}),
	c.cell({
		id: 'albumTitle',
		header: 'Album title',
	}),
	c.cell({
		id: 'artistName1',
		header: 'Artist name1',
	}),
	c.actions({
		label: 'Delete',
		onClick(data) {
			console.log('Delete:', data);
		},
		onGroup(data) {
			console.log('Delete group:', data);
		},
	}),
]);

const toolbar = createToolbarItems<Favorite>(
	{
		type: 'search',
		columnId: 'songTitle',
		pluralTitle: 'songs',
	}, {
		type: 'filter',
		columnId: 'artistName1',
		options: [{
			label: 'Low',
			value: 'low',
			icon: ArrowDown,
		}],
		title: 'Song title',
	},
);

const gridRenderer = createGridRenderer<Favorite>(
	data => ({
		name: data.videoId,
		description: data.songTitle ?? 'No song title',
		cta: 'Download',
		onClick: () => console.log(data),
		Icon: FileIcon,
	}),
);

const pagination = createPaginationConfig();

const config = createTableConfig(columns, {
	pagination,
	toolbar,
	renderer: gridRenderer,
});

export const PickerPage: FC = () => {
	const [data, setData] = useState<Favorite[]>([]);

	return (
		<>
			<CsvImporter
				fields={[
					{ label: 'Video Id', value: 'Video Id', required: true },
					{ label: 'Song Title', value: 'Song Title' },
					{ label: 'Album Title', value: 'Album Title' },
					{ label: 'Artist Name 1', value: 'Artist Name 1' },
					{ label: 'Artist Name 2', value: 'Artist Name 2' },
					{ label: 'Artist Name 3', value: 'Artist Name 3' },
				]}
				onImport={(parsedData) => {
					// TODO: use scheme.parse
					const formattedData = parsedData.map<Favorite>(
						(item) => ({
							videoId: item['Video Id'],
							songTitle: item['Song Title'],
							albumTitle: item['Album Title'],
							artistName1: item['Artist Name 1'],
							artistName2: item['Artist Name 2'],
							artistName3: item['Artist Name 3'],
						}),
					);

					console.log(formattedData);
					setData(formattedData);
				}}
				className="self-end"
			/>
			<DataTable data={data} config={config} />
		</>
	);
};
