import { Download, Expand, Home, ImportIcon, List, Settings } from 'lucide-react';

import type { NavbarConfig } from '@/app/components/Sidebar/nav-items';
import { urls } from './urls';

export const config = [
	{
		items: [
			{
				name: 'Home',
				url: urls.index,
				icon: Home,
			},
			{
				name: 'Imports',
				url: urls.imports,
				icon: List,
			},
			{
				name: 'Import',
				url: urls.picker,
				icon: ImportIcon,
			},
			{
				name: 'Export',
				url: urls.export,
				icon: Expand,
			},
			{
				name: 'Download',
				url: urls.download,
				icon: Download,
			},
		],
	},
	{
		moveToBottom: true,
		items: [{
			name: 'Settings',
			url: urls.settings,
			icon: Settings,
		}],
	},
] satisfies NavbarConfig;
