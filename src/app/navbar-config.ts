import { File, List, Settings } from 'lucide-react';

import type { NavbarConfig } from '@/app/components/Sidebar/nav-items';
import { urls } from './urls';

export const config = [
	{
		items: [
			{
				name: 'Imports',
				url: urls.imports,
				icon: List,
			},
			{
				name: 'Picker',
				url: urls.picker,
				icon: File,
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
