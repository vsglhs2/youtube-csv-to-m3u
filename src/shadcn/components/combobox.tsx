'use client';

import { useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';


export type ComboboxStatus = {
    value: string;
    label: string;
};

export type ComboboxPopoverStatusCallback =
    (status: ComboboxStatus | null) => void;

export type ComboboxPopoverProps = {
    statuses: ComboboxStatus[];
    label: string;
    initialLabel: string;
    onStatus: ComboboxPopoverStatusCallback;
};

export function ComboboxPopover({
	label,
	initialLabel,
	statuses,
	onStatus,
}: ComboboxPopoverProps) {
	const [open, setOpen] = useState(false);
	const [
		selectedStatus,
		setSelectedStatus,
	] = useState<ComboboxStatus | null>(null);

	const handleSelect = (status: ComboboxStatus | null) => {
		setSelectedStatus(status);
		onStatus(status);
	};

	return (
		<div className="flex items-center space-x-4">
			<p className="text-muted-foreground text-sm">{label}</p>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger>
					<Button variant="outline" className="w-[150px] justify-start">
						{selectedStatus ? <>{selectedStatus.label}</> : <>{initialLabel}</>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="p-0" side="right" align="start">
					<Command>
						<CommandInput placeholder="Change status..." />
						<CommandList>
							<CommandEmpty>No results found.</CommandEmpty>
							<CommandGroup>
								{statuses.map((status) => (
									<CommandItem
										key={status.value}
										value={status.value}
										onSelect={(value) => {
											handleSelect(
												statuses.find((priority) => priority.value === value) ||
                                                null,
											);
											setOpen(false);
										}}
									>
										{status.label}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
