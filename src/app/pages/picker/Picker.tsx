import { useState, type FC } from 'react';
import {
	BellIcon,
	CalendarIcon,
	FileTextIcon,
	GlobeIcon,
	InputIcon,
} from '@radix-ui/react-icons';

import { DataTable } from '@/shadcn/components/data-table';
import { CsvImporter } from '@/shadcn/components/csv-importer';
import { BentoCard, BentoGrid, type BentoCardProps } from '@/shadcn/components/ui/bento-grid';
import { columns } from '@/shadcn/components/columns';

const features: BentoCardProps[] = [
	{
		Icon: FileTextIcon,
		name: 'Save your files',
		description: 'We automatically save your files as you type.',
		href: '/',
		cta: 'Learn more',
		className: 'lg:row-start-1 lg:row-end-1 lg:col-start-2 lg:col-end-2',
	},
	{
		Icon: InputIcon,
		name: 'Full text search',
		description: 'Search through all your files in one place.',
		href: '/',
		cta: 'Learn more',
		className: 'lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3',
	},
	{
		Icon: GlobeIcon,
		name: 'Multilingual',
		description: 'Supports 100+ languages and counting.',
		href: '/',
		cta: 'Learn more',
		className: 'lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4',
	},
	{
		Icon: CalendarIcon,
		name: 'Calendar',
		description: 'Use the calendar to filter your files by date.',
		href: '/',
		cta: 'Learn more',
		className: 'lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2',
	},
	{
		Icon: BellIcon,
		name: 'Notifications',
		description:
      'Get notified when someone shares a file or mentions you in a comment.',
		href: '/',
		cta: 'Learn more',
		className: 'lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4',
	},
];

function BentoDemo() {
	return (
		<BentoGrid className="lg:grid-rows-4 lg:grid-cols-4">
			{features.map((feature) => (
				<BentoCard key={feature.name} {...feature} />
			))}
		</BentoGrid>
	);
}

export const PickerPage: FC = () => {
	const [data, setData] = useState([]);

	return (
		<>
			<BentoDemo />
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
					const formattedData = parsedData.map(
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
			<DataTable data={[]} columns={columns} />
		</>

	);
};
