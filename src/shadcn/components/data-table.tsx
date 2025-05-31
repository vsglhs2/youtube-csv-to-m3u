'use client';

import * as React from 'react';
import { toast } from 'sonner';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/shadcn/components/ui/table';
import { Skeleton } from './ui/skeleton';

export type TableScheme = Record<string, unknown>[];

export type TableProps = {
	headings: string[];
	data: TableScheme;
}

export function DataTable({ headings, data }: TableProps) {
	const renderedTableHeads = headings.map((key) => (
		<TableHead key={key}>{key}</TableHead>
	));

	const renderedRows = data.map((row, i) => {
		const renderedCells = Object.entries(row).map(([key, value]) => (
			<TableCell key={key + String(value)} className="font-medium">
				<span className="line-clamp-1">{String(value)}</span>
			</TableCell>
		));

		return (
			<TableRow key={i}>
				{renderedCells}
			</TableRow>
		);
	});

	const renderedTableBody = renderedRows.length ? (
		renderedRows
	) : (
		<Skeleton
			className="size-4 rounded-md"
			data-sidebar="menu-skeleton-icon"
		/>
	);

	const renderedTable = (
		<Table>
			<TableHeader>
				<TableRow className="bg-muted/50">
					{renderedTableHeads}
				</TableRow>
			</TableHeader>
			<TableBody>
				{renderedTableBody}
			</TableBody>
		</Table>
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="rounded-md border">
				{renderedTable}
			</div>
		</div>
	);
}
