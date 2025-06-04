'use client';

import type { CellContext, ColumnDef, ColumnDefTemplate, Table } from '@tanstack/react-table';
import type { JSX } from 'react';

import { DataTableColumnHeader } from '../components/data-table-column-header';
import { DataTableRowActions, type RowActions } from '../components/data-table-row-actions';
import { Checkbox } from '../components/ui/checkbox';
import type { ToolbarConfig, ToolbarConfigInput } from '../components/data-table-toolbar';
import { RowsDataTable } from '../components/rows-data-table';
import { BentoGrid, type BentoCardProps, type GridPositioning } from '../components/ui/bento-grid';
import type { PaginationConfig } from '../components/data-table-pagination';

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
	id?: string;
	accessor?: keyof TData;
	header: string;
	cell?: ColumnDefTemplate<CellContext<TData, unknown>>;
	sorting?: boolean;
	hiding?: boolean;
	filtering?: boolean;
};

function cellColumn<TData>({
	id,
	accessor,
	header: title,
	cell,
	filtering,
	hiding,
	sorting,
}: WithoutBase<CellColumnOptions<TData>>): ColumnDef<TData> {
	if (!id && !accessor) {
		throw new Error('Either accessor or id must be specified');
	}

	const columnDefinition: ColumnDef<TData> = {
		id: id!,
		accessorKey: accessor,
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
	toolbar: ToolbarConfig<TData>;
	pagination: PaginationConfig;
	columns: ColumnDef<TData>[];
	renderer: DataTableRenderer<TData>;
	enableRowSelection: boolean;
	mode: TableMode;
};

export type TableMode = 'rows' | 'columns';

export function createTableConfig<TData>(
	columns: ColumnOptions<TData>[],
	options: {
		toolbar?: ToolbarConfig<TData>['items'];
		pagination?: PaginationConfig;
		renderer?: DataTableRenderer<TData>;
		mode?: TableMode;
	} = {},
): TableConfig<TData> {
	const {
		toolbar = createToolbarItems(),
		pagination = createPaginationConfig(),
		renderer = createRowsRenderer<TData>(),
		mode = 'rows',
	} = options;
	const definitions: ColumnDef<TData>[] = [];

	const actions = columns.find(c => c.type === 'actions')?.actions;
	const isGridRenderer = renderer.rendererType === GRID_RENDERER;

	for (const item of toolbar) {
		if (item.type !== 'filter') continue;

		const column = columns.find(c =>
			isCellColumnOptions(c) && c.id === item.columnId,
		);
		if (!column || !isCellColumnOptions(column)) continue;

		column.filtering = true;
	}

	for (const column of columns) {
		if (column.type === 'cell' && !column.accessor) {
			column.hiding = false;
		}

		const create = columnCreatorRecord[column.type];
		if (!create) throw new Error(`Can't create ${column.type} column`);

		// @ts-expect-error TODO: fix type
		const definition = create<TData>(column);

		definitions.push(definition);
	}

	const needEnableView = columns.some(
		c => c.type === 'cell' && (c.hiding === undefined || c.hiding),
	);

	const finalToolbar: ToolbarConfig<TData> = {
		items: toolbar ?? [],
		actions: actions ?? [],
		enableActions: !isGridRenderer,
		enableView: !isGridRenderer && needEnableView,
	};

	const enableRowSelection = (
		columns.some(isSelectColumnOptions) &&
		finalToolbar.enableActions
	);

	return {
		toolbar: finalToolbar,
		pagination: pagination,
		columns: definitions,
		renderer: renderer,
		enableRowSelection: enableRowSelection,
		mode: mode,
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
export function createColumnsOptions<TData = Record<string, unknown>>(
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

const defaultPaginationConfig: PaginationConfig = {
	pageIndex: 0,
	pageSizes: [10, 20, 30, 40, 50],
	pageSize: 10,
	enable: true,
};

export function createPaginationConfig(
	input: Partial<PaginationConfig> = {},
): PaginationConfig {
	return Object.assign({}, defaultPaginationConfig, input);
}

export type DataTableRendererProps<TData> = {
	config: TableConfig<TData>;
	table: Table<TData>;
};

export type DataTableRendererInput<TData> = (
	props: DataTableRendererProps<TData>
) => JSX.Element;


export type DataTableRenderer<TData> = {
	(props: DataTableRendererProps<TData>): JSX.Element;
	rendererType: string;
};

export const GRID_RENDERER = 'grid';
export const ROWS_RENDERER = 'rows';

export function createRenderer<TData>(
	Renderer: DataTableRendererInput<TData>,
	type: string,
): DataTableRenderer<TData> {
	// TODO: make use of it?
	const wrapped: DataTableRendererInput<TData> = (props) => {
		return <Renderer {...props} />;
	};
	Object.defineProperty(wrapped, 'rendererType', {
		value: type,
	});

	return wrapped as DataTableRenderer<TData>;
}

export function createRowsRenderer<TData>(): DataTableRenderer<TData> {
	return createRenderer(RowsDataTable, ROWS_RENDERER);
}

export function createGridRenderer<TData>(
	map: (data: TData) => BentoCardProps,
	grid: GridPositioning = [[0, 1]],
) {
	return createRenderer<TData>(({ table }) => {
		const cards = table
			.getRowModel()
			.rows.map(row => map(row.original));

		return (
			<BentoGrid cards={cards} grid={grid} />
		);
	}, GRID_RENDERER);
}
