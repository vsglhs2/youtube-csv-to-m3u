import type { Cell, Table as TableType } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './ui/table';
import type { CellColumnMeta, TableConfig, TableMode } from '../lib/table-config';
import { cn } from '../lib/utils';
import { CopyToClipboard } from './ui/copy-to-clipboard';
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from './ui/context-menu';

type RowsDataTableCellProps<TData> = {
	cell: Cell<TData, unknown>;
	classNameRecord: TableClassNameRecord;
};

export function RowsDataTableCell<TData>({
	cell,
	classNameRecord,
}: RowsDataTableCellProps<TData>) {
	const { meta } = cell.column.columnDef;

	const renderedCellContent = flexRender(
		cell.column.columnDef.cell,
		cell.getContext(),
	);

	const needRenderPreview = Boolean(
		meta && (meta as CellColumnMeta<TData>).previewing,
	);
	const renderedCellBody = needRenderPreview ? (
		<ContextMenu>
			<ContextMenuTrigger>
				{renderedCellContent}
			</ContextMenuTrigger>
			<ContextMenuContent className="p-2 w-72">
				<CopyToClipboard>
					{String(cell.renderValue())}
				</CopyToClipboard>
			</ContextMenuContent>
		</ContextMenu>
	) : (
		renderedCellContent
	);

	return (
		<TableCell
			className={cn(
				'max-w-80 overflow-ellipsis overflow-hidden',
				classNameRecord.cell,
			)}
		>
			{renderedCellBody}
		</TableCell>
	);
}

type TableClassNameRecord = {
	table?: string;
	body?: string;
	header?: string;
	row?: string;
	head?: string;
	cell?: string;
	plug?: string;
};

function getTableClassnameRecord(mode: TableMode): TableClassNameRecord {
	if (mode === 'rows') return {
		plug: 'h-24',
	};

	return {
		table: 'flex flex-row h-auto',
		body: 'flex flex-row h-auto grow',
		header: 'h-auto',
		row: 'flex flex-col h-auto',
		head: 'p-2 h-8 flex justify-center items-center',
		cell: 'h-8',
		plug: 'p-2 h-24 flex justify-center items-center grow',
	};
}

type RowsDataTableProps<TData> = {
	table: TableType<TData>;
	config: TableConfig<TData>;
};

export function RowsDataTable<TData>({
	table,
	config,
}: RowsDataTableProps<TData>) {
	const classNameRecord = getTableClassnameRecord(config.mode);

	const visibleColumns = table.getVisibleFlatColumns().length > 0;
	const renderBody = visibleColumns && table.getRowModel().rows?.length;

	const plug = visibleColumns ? 'No results' : 'No columns';
	const renderedPlug = (
		<TableRow className={classNameRecord.plug}>
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
				className={classNameRecord.row}
				key={row.id}
				data-state={row.getIsSelected() && 'selected'}
			>
				{row.getVisibleCells().map(cell => (
					<RowsDataTableCell
						key={cell.id}
						cell={cell}
						classNameRecord={classNameRecord}
					/>
				))}
			</TableRow>
		))
	) : renderedPlug;

	return (
		<div className="rounded-md border">
			<Table className={classNameRecord.table}>
				<TableHeader className={classNameRecord.header}>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow
							key={headerGroup.id}
							className={classNameRecord.row}
						>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead
										key={header.id}
										colSpan={header.colSpan}
										className={classNameRecord.head}
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
				<TableBody className={classNameRecord.body}>
					{renderedBody}
				</TableBody>
			</Table>
		</div>
	);
}
