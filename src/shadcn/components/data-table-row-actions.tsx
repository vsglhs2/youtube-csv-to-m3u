'use client';

import type { Row } from '@tanstack/react-table';
import { MoreHorizontal  } from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import { Children, createElement  } from 'react';
import type {PropsWithChildren} from 'react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';

type CanRowActionCallback<TData> = (data: Row<TData>) => boolean;
type RowActionCallback<TData> = (data: Row<TData>) => void;
type RowActionsCallback<TData> = (data: Row<TData>[]) => void;

export type RowAction<TData> = {
	label: string;
	icon?: LucideIcon;
	canClick?: CanRowActionCallback<TData>;
	canGroup?: CanRowActionCallback<TData>;
} & ({
	onClick: RowActionCallback<TData>;
	onGroup?: RowActionsCallback<TData>;
} | {
	onClick?: RowActionCallback<TData>;
	onGroup: RowActionsCallback<TData>;
});

export type RowActions<TData = unknown> = RowAction<TData>[];

type BaseDataTableRowActionsProps = PropsWithChildren<{
	label?: string;
	icon?: LucideIcon;
}>;

export function BaseDataTableRowActions({
	label,
	icon,
	children,
}: BaseDataTableRowActionsProps) {

	const renderedActionsContainer = Children.count(children) ? (
		<DropdownMenuContent align="end" className="w-[160px]">
			{children}
		</DropdownMenuContent>
	) : null;

	const renderedButton = label ? (
		<Button
			variant="outline"
			size="sm"
			className="ml-auto hidden h-8 lg:flex"
		>
			{icon && createElement(icon)}
			{label}
		</Button>
	) : (
		<Button
			variant="ghost"
			className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
		>
			<MoreHorizontal />
			<span className="sr-only">Actions</span>
		</Button>
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				{renderedButton}
			</DropdownMenuTrigger>
			{renderedActionsContainer}
		</DropdownMenu>
	);
}

interface DataTableRowActionsProps<TData> {
	data: Row<TData>;
	actions: RowActions<TData>;
	label?: string;
	icon?: LucideIcon;
}

export function DataTableRowActions<TData>({
	data,
	actions,
	label,
	icon,
}: DataTableRowActionsProps<TData>) {
	const getActionHandler = (handler: RowActionCallback<TData>) => () => {
		handler(data);
	};

	const renderedActions = actions
		.map((action, i) => (
			<DropdownMenuItem
				disabled={Boolean(!action.canClick?.(data) || !action.onClick)}
				key={action.label + i}
				onClick={getActionHandler(action.onClick!)}
			>
				{action.icon && createElement(action.icon)}
				{action.label}
			</DropdownMenuItem>
		));

	return (
		<BaseDataTableRowActions label={label} icon={icon}>
			{renderedActions}
		</BaseDataTableRowActions>
	);
}

interface DataTableGroupRowActionsProps<TData> {
	data: Row<TData>[];
	actions: RowActions<TData>;
	label?: string;
	icon?: LucideIcon;
}

export function DataTableGroupRowActions<TData>({
	data,
	actions,
	label,
	icon,
}: DataTableGroupRowActionsProps<TData>) {
	const getActionHandler = (handler: RowActionsCallback<TData>) => () => {
		handler(data);
	};

	const renderedActions = actions
		.filter((a) => a.onGroup)
		.map((action, i) => (
			<DropdownMenuItem
				key={action.label + i}
				onClick={getActionHandler(action.onGroup!)}
			>
				{action.icon && createElement(action.icon)}
				{action.label}
			</DropdownMenuItem>
		));

	return (
		<BaseDataTableRowActions label={label} icon={icon}>
			{renderedActions}
		</BaseDataTableRowActions>
	);
}
