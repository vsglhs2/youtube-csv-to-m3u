'use client';

import * as React from 'react';
import type {
	ColumnFiltersState,
	SortingState,
	VisibilityState,
} from '@tanstack/react-table';
import {
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';

import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import type { TableConfig } from '../lib/table-config';

interface DataTableProps<TData, TValue> {
	config: TableConfig<TData>;
	data: TData[];
}

export function DataTable<TData, TValue>({
	config,
	data,
}: DataTableProps<TData, TValue>) {
	const { columns, toolbar, pagination, enableRowSelection } = config;

	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
		},
		initialState: {
			pagination,
		},
		enableRowSelection: enableRowSelection,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	const renderedTable = <config.renderer table={table} config={config} />;

	return (
		<div className="space-y-4">
			<DataTableToolbar table={table} config={toolbar} />
			{renderedTable}
			<DataTablePagination table={table} config={pagination} />
		</div>
	);
}
