import { cn } from "@/shadcn/lib/utils";
import { SidebarMenuItem, SidebarMenuButton, SidebarGroupLabel, SidebarMenu, SidebarGroup } from "@/shadcn/components/ui/sidebar";
import {
  type LucideIcon,
} from "lucide-react"

import type { FC } from "react";
import { Link } from "react-router";

export type NavbarItem = {
  name: string;
  url: string;
  icon: LucideIcon;
};

export type NavbarGroup = {
  name?: string;
  items: NavbarItem[];
  moveToBottom?: boolean;
};

export type NavbarConfig = NavbarGroup[];

type NavItemProps = {
  item: NavbarItem;
};

const NavbarItem: FC<NavItemProps> = ({ item }) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip={item.name} asChild>
        <Link to={item.url}>
          <item.icon />
          <span>{item.name}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
};

type NavGroupProps = {
  group: NavbarGroup;
};

const NavbarGroup: FC<NavGroupProps> = ({ group }) => {
  const renderedItems = group.items.map((item) => (
    <NavbarItem key={item.name} item={item} />
  ));

  const renderedLabel = group.name && (
    <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
  );

  return (
    <SidebarMenu className={cn(group.moveToBottom ? 'mt-auto' : 'mb-4')}>
      {renderedLabel}
      {renderedItems}
    </SidebarMenu>
  )
}

type NavItemsProps = {
  config: NavbarConfig;
};

export const NavItems: FC<NavItemsProps> = ({ config }) => {
  const renderedGroups = config.map((group, i) => (
    <NavbarGroup key={String(group.name) + i} group={group} />
  ));

  return (
    <SidebarGroup className="h-full">
      {renderedGroups}
    </SidebarGroup>
  )
}
