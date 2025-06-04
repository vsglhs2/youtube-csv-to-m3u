import type { Table as TableType } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';

type RowsDataTableProps<TData> = {
	table: TableType<TData>;
};

export function RowsDataTable<TData>({ table }: RowsDataTableProps<TData>) {
	const visibleColumns = table.getVisibleFlatColumns().length > 0;
	const renderBody = visibleColumns && table.getRowModel().rows?.length;

	const plug = visibleColumns ? 'No results' : 'No columns';
	const renderedPlug = (
		<TableRow className="flex content-center">
			<TableCell
				colSpan={table.getAllColumns().length}
				className="text-center"
			>
				{plug}
			</TableCell>
		</TableRow>
	);

	const renderedBody = renderBody ? (
		table.getRowModel().rows.map((row) => (
			<TableRow
				className="flex flex-col h-auto"
				key={row.id}
				data-state={row.getIsSelected() && 'selected'}
			>
				{row.getVisibleCells().map((cell) => (
					<TableCell
						key={cell.id}
						className='h-8 max-w-80 overflow-ellipsis overflow-hidden'
					>
						<HoverCard>
							<HoverCardTrigger>
								{flexRender(
									cell.column.columnDef.cell,
									cell.getContext(),
								)}
							</HoverCardTrigger>
							<HoverCardContent
								side="top"
								align="center"
							>
								{flexRender(
									cell.column.columnDef.cell,
									cell.getContext(),
								)}
							</HoverCardContent>
						</HoverCard>

					</TableCell>
				))}
			</TableRow>
		))
	) : renderedPlug;

	return (
		<div className="rounded-md border">
			<Table className="flex flex-row h-auto">
				<TableHeader className="h-auto">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className="flex flex-col h-auto">
							{headerGroup.headers.map((header) => {
								return (
									<TableHead
										key={header.id}
										colSpan={header.colSpan}
										className="p-2 h-8 flex justify-center"
									>
										{header.isPlaceholder
											? null
											: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody className="flex flex-row h-auto">
					{renderedBody}
				</TableBody>
			</Table>
		</div>
	);
}
