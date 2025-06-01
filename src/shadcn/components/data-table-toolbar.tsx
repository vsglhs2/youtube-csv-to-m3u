'use client';
import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { DataTableViewOptions } from './data-table-view-options';
import { DataTableGroupRowActions, type RowActions } from './data-table-row-actions';
import { hasActions } from '../lib/table-config';

export type ToolbarItemBase<TData> = {
	type: string;
	columnId: keyof TData & string;
};

export type ToolbarFilterItemOptions = {
	value: string;
	label: string;
	icon?: React.ComponentType<{ className?: string }>;
};

export type ToolbarFilterItem<TData> = ToolbarItemBase<TData> & {
	type: 'filter';
	title: string;
	options: ToolbarFilterItemOptions[];
};

export type ToolbarSearchItem<TData> = ToolbarItemBase<TData> & {
	type: 'search';
	pluralTitle: string;
};

export type ToolbarItem<TData> =
	| ToolbarFilterItem<TData>
	| ToolbarSearchItem<TData>;

export type ToolbarConfig<TData = unknown> = {
	items: ToolbarItem<TData>[];
	actions: RowActions<TData>;
};

export type ToolbarConfigInput<TData = unknown> = ToolbarConfig<TData>;

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	config: ToolbarConfig<TData>;
}

export function DataTableToolbar<TData>({
	table,
	config,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;
	const selectedRows = table.getSelectedRowModel().rows;

	const { actions, items } = config;

	const renderedToolbarItems = items.map(item => item.type === 'search' ? (
		<Input
			key={item.type + item.columnId}
			placeholder={`Filter ${item.pluralTitle}...`}
			value={(table.getColumn(item.columnId)?.getFilterValue() as string) ?? ''}
			onChange={(event) =>
				table.getColumn(item.columnId)?.setFilterValue(event.target.value)
			}
			className="h-8 w-[150px] lg:w-[250px]"
		/>
	) : (
		table.getColumn(item.columnId) && (
			<DataTableFacetedFilter
				key={item.type + item.columnId}
				column={table.getColumn(item.columnId)}
				title={item.title}
				options={item.options}
			/>
		)
	)).filter(Boolean);

	const renderedResetButton = renderedToolbarItems.length && isFiltered ? (
		<Button
			variant="ghost"
			onClick={() => table.resetColumnFilters()}
			className="h-8 px-2 lg:px-3"
		>
			Reset
			<X />
		</Button>
	) : null;

	const needRenderActions = table.options.enableRowSelection && hasActions(table);
	const renderedGroupActions = needRenderActions && (
		<DataTableGroupRowActions
			data={selectedRows}
			actions={actions}
			label='Actions'
		/>
	);

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				{renderedToolbarItems}
				{renderedResetButton ?? null}
			</div>
			<div className='flex gap-2'>
				{renderedGroupActions}
				<DataTableViewOptions table={table} />
			</div>
		</div>
	);
}
