import * as React from "react"

import { NavItems } from "@/components/nav-items"
import {
	Sidebar,
} from "@/components/ui/sidebar"
import { config } from "@/app/App/navbar-config";
import { cn } from "@/lib/utils";

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar className={cn(className, 'h-full')} {...props}>
			<NavItems config={config} />
		</Sidebar>
	)
}
