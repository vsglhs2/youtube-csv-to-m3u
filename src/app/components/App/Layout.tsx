import { Separator } from '@radix-ui/react-separator';
import type { FC } from 'react';
import { Outlet } from 'react-router';

import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/shadcn/components/ui/sidebar';
import { Sidebar, Breadcrumb } from '@/app/components';

export const AppLayout: FC = () => {
	return (
		<SidebarProvider>
			<Sidebar collapsible="icon" variant="inset" />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumb />
					</div>
				</header>
				<main className="flex flex-1 flex-col gap-4 p-4 pt-0">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
};
