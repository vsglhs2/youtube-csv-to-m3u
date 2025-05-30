import * as React from "react"

import { NavItems } from "@/app/components/Sidebar/nav-items"
import { config } from "@/app/navbar-config";
import { cn } from "@/shadcn/lib/utils";
import { Sidebar as SidebarComponent } from "@/shadcn/components/ui/sidebar";

export function Sidebar({ className, ...props }: React.ComponentProps<typeof SidebarComponent>) {
	return (
		<SidebarComponent className={cn(className, 'h-full')} {...props}>
			<NavItems config={config} />
		</SidebarComponent>
	)
}
