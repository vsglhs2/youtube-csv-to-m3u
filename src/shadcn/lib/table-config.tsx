'use client';

import type { Cell, CellContext, ColumnDef, ColumnDefTemplate, Table } from '@tanstack/react-table';

import { DataTableColumnHeader } from '../components/data-table-column-header';
import { DataTableRowActions, type RowActions } from '../components/data-table-row-actions';
import { Checkbox } from '../components/ui/checkbox';
import type { ToolbarConfig, ToolbarConfigInput } from '../components/data-table-toolbar';

export type BaseColumnOptions = {
	type: string;
};

export type SelectColumnOptions<TData> = BaseColumnOptions & {
	type: 'select';
};

function selectColumn<TData>(
	options: WithoutBase<SelectColumnOptions<TData>> = {},
): ColumnDef<TData> {
	return {
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				className="translate-y-[2px]"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="translate-y-[2px]"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	};
}

export type ActionsColumnOptions<TData> = BaseColumnOptions & {
	type: 'actions';
	actions: RowActions<TData>;
};

const ACTION_ID = 'actions';

export function hasActions<TData>(table: Table<TData>) {
	return Boolean(table.getColumn(ACTION_ID));
}

function actionsColumn<TData>(
	options: WithoutBase<ActionsColumnOptions<TData>>,
): ColumnDef<TData> {
	return {
		id: 'actions',
		cell: ({ row }) => (
			<DataTableRowActions
				data={row}
				actions={options.actions}
			/>
		) ,
	};
}

export type CellColumnOptions<TData = unknown> = BaseColumnOptions & {
	type: 'cell';
	id: keyof TData;
	header: string;
	cell?: ColumnDefTemplate<CellContext<TData, unknown>>;
	sorting?: boolean;
	hiding?: boolean;
	filtering?: boolean;
};

function cellColumn<TData>({
	id,
	header: title,
	cell,
	filtering,
	hiding,
	sorting,
}: WithoutBase<CellColumnOptions<TData>>): ColumnDef<TData> {
	const columnDefinition: ColumnDef<TData> = {
		accessorKey: id,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title={title} />
		),
	};

	if (cell) {
		columnDefinition.cell = cell;
	}

	if (filtering) {
		columnDefinition.filterFn = (row, id, value) => {
			return value.includes(row.getValue(id));
		};
	}

	columnDefinition.enableHiding = hiding;
	columnDefinition.enableSorting = sorting;

	return columnDefinition;
}

export type ColumnOptions<TData = unknown> =
	| SelectColumnOptions<TData>
	| ActionsColumnOptions<TData>
	| CellColumnOptions<TData>;

type WithoutBase<
	Options extends BaseColumnOptions,
> = Omit<Options, 'type'>;

export const columnCreatorRecord = {
	cell: cellColumn,
	select: selectColumn,
	actions: actionsColumn,
};

function isCellColumnOptions<TData = unknown>(
	options: ColumnOptions<TData> | CellColumnOptions<TData>,
): options is CellColumnOptions<TData> {
	return options.type === 'cell';
}

function isSelectColumnOptions<TData>(
	options:
		| ColumnOptions<TData>
		| SelectColumnOptions<TData>,
): options is SelectColumnOptions<TData> {
	return options.type === 'select';
}

export type TableConfig<TData> = {
	columns: ColumnDef<TData>[];
	toolbar: ToolbarConfig<TData>;
	enableRowSelection: boolean;
};

export function createTableConfig<TData>(
	columns: ColumnOptions<TData>[],
	toolbar: ToolbarConfig<TData>['items'] = [],
): TableConfig<TData> {
	const definitions: ColumnDef<TData>[] = [];

	const actions = columns.find(c => c.type === 'actions')?.actions;
	const finalToolbar: ToolbarConfig<TData> = {
		items: toolbar ?? [],
		actions: actions ?? [],
	};

	for (const item of finalToolbar.items) {
		if (item.type !== 'filter') continue;

		const column = columns.find(c =>
			isCellColumnOptions(c) && c.id === item.columnId,
		);
		if (!column || !isCellColumnOptions(column)) continue;

		column.filtering = true;
	}

	for (const column of columns) {
		const create = columnCreatorRecord[column.type];
		if (!create) throw new Error(`Can't create ${column.type} column`);

		// @ts-expect-error TODO: fix type
		const definition = create<TData>(column);

		definitions.push(definition);
	}

	const enableRowSelection = columns.some(isSelectColumnOptions);

	return {
		columns: definitions,
		toolbar: finalToolbar,
		enableRowSelection: enableRowSelection,
	};
}

function createColumnFactory<TData>() {
	return {
		actions: (
			...actions: ActionsColumnOptions<TData>['actions']
		): ActionsColumnOptions<TData> => {
			return {
				type: 'actions',
				actions: actions,
			};
		},
		select: (): SelectColumnOptions<TData> => {
			return { type: 'select' };
		},
		cell: (
			options: WithoutBase<CellColumnOptions<TData>>,
		): CellColumnOptions<TData> => {
			return Object.assign<typeof options, { type: 'cell' }>(
				options, { type: 'cell' },
			);
		},
	};
}

// TODO: add schema validation
export function createColumnsOptions<TData>(
	factory: (
		column: ReturnType<typeof createColumnFactory<TData>>
	) => ColumnOptions<TData>[],
) {
	const record = createColumnFactory<TData>();

	return factory(record);
}

export function createToolbarItems<TData>(
	...input: ToolbarConfigInput<TData>['items']
): ToolbarConfig<TData>['items'] {
	return input;
}
