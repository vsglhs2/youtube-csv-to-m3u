import { useState } from 'react';
import { Check, Clipboard } from 'lucide-react';

import { cn } from '@/shadcn/lib/utils';
import { ScrollArea } from './scroll-area';

type ClipboardPosition =
	| 'next'
	| 'top-right'
	| 'top-left'
	| 'bottom-right'
	| 'bottom-left';

interface CopyToClipboardProps {
	children: string;
	className?: string;
	iconClassName?: string;
	timeout?: number;
  	position?: ClipboardPosition;
}

const positionClassRecord: Record<ClipboardPosition, string> = {
	'top-right': 'absolute right-1.5 top-1.5',
	'top-left': 'absolute left-1.5 top-1.5',
	'bottom-right': 'absolute right-1.5 bottom-1.5',
	'bottom-left': 'absolute left-1.5 bottom-1.5',
	'next': '',
};

const scrollAreaClassRecord: Record<ClipboardPosition, string> = {
	'top-right': '',
	'top-left': '',
	'bottom-right': '',
	'bottom-left': '',
	'next': 'max-w-[calc(100%-2.5rem)]',
};

export function CopyToClipboard({
	children,
	className,
	iconClassName,
	timeout = 1000,
	position = 'next',
}: CopyToClipboardProps) {
	const [copied, setCopiedState] = useState(false);

	const handleCopy = () => {
		if (copied) return;

		navigator.clipboard.writeText(children);
		setCopiedState(true);

		setTimeout(() => {
			setCopiedState(false);
		}, timeout);
	};

	return (
		<div className='flex justify-between gap-2'>
			<ScrollArea
				orientation="horizontal"
				className={cn(
					'max-w-full',
					scrollAreaClassRecord[position],
				)}
			>
				<span className='whitespace-nowrap'>
					{children}
				</span>

			</ScrollArea>
			<button
				className={cn(
					'p-1.5 border dark:border-neutral-800 rounded-md z-[2] backdrop-blur-2xl',
					positionClassRecord[position],
					className,
				)}
				onClick={handleCopy}
			>
				{copied ? (
					<Check className={cn('size-4', iconClassName)} />
				) : (
					<Clipboard className={cn('size-4', iconClassName)} />
				)}
			</button>
		</div>
	);
}
