import type { FunctionComponent, HTMLAttributes } from 'react';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import type { IconProps } from '@radix-ui/react-icons/dist/types';
import { Link } from 'react-router';

import { cn } from '@/shadcn/lib/utils';
import { Button } from '@/shadcn/components/ui/button';

type GridItemId = number;
export type GridPositioning = GridItemId[][];

export function createGridClassNames(...rows: GridPositioning) {
	type Point = { x: number; y: number };

	const pointsMap = new Map<GridItemId, [Point, Point]>();
	for (let y = 0; y < rows.length; y++) {
		const row = rows[y];

		for (let x = 0; x < row.length; x++) {
			const id = row[x];

			let points = pointsMap.get(id);
			if (!points) {
				points = [{ x, y }, { x, y }];
				pointsMap.set(id, points);

				continue;
			}

			points[1] = { x, y };
		}
	}

	const classNameMap = new Map<GridItemId, string>();
	for (const [id, points] of pointsMap.entries()) {
		const { x: x1, y: y1 } = points[0];
		const x2 = points[1].x + 1;
		const y2 = points[1].y + 1;

		const classNames = [
			`row-start-${y1 + 1}`,
			`row-end-${y2 + 1}`,
			`col-start-${x1 + 1}`,
			`col-end-${x2 + 1}`,
		];

		classNameMap.set(id, classNames.join(' '));
	}

	const width = rows[0]?.length ?? 0;
	const height = rows.length;

	const containerClassName = `grid-cols-${width} grid-rows-${height}`;
	const size = classNameMap.size;

	return {
		classNameById: classNameMap,
		containerClassName: containerClassName,
		size: size,
	};
}

const BentoGrid = ({
	grid: rows,
	cards,
	className,
}: {
	grid: GridPositioning;
	cards: BentoCardProps[];
	className?: string;
}) => {
	const {
		classNameById,
		containerClassName,
		size,
	} = createGridClassNames(...rows);

	const gridsAmount = Math.ceil(cards.length / size);
	const renderedGrids = new Array(gridsAmount).fill(null).map((_, group) => {
		const endIndex = (group + 1) * size;
		const slicedCards = cards.slice(Math.max(0, endIndex - size), endIndex);

		const renderedCards = slicedCards.map(({ className, ...card }, i) => (
			<BentoCard
				key={card.name + card.description}
				className={cn(classNameById.get(i), className)}
				{...card}
			/>
		));

		return (
			<div
				key={group}
				className={cn(
					'grid w-full gap-4',
					containerClassName,
					className,
				)}
			>
				{renderedCards}
			</div>
		);
	});

	return renderedGrids.length ? (
		renderedGrids
	) : (
		<div className="rounded-md border h-24 text-center content-center w-full">
			No results.
		</div>
	); ;
};

export type BentoCardProps = {
	name: string;
	className?: string;
	Icon: FunctionComponent<IconProps & HTMLAttributes<SVGSVGElement>>;
	description: string;
	href?: string;
	onClick?: () => void;
	cta: string;
};

const BentoCard = ({
	name,
	className,
	Icon,
	description,
	href,
	onClick,
	cta,
}: BentoCardProps) => {
	const renderedInner = (
		<>
			{cta}
			<ArrowRightIcon className="ml-2 h-4 w-4" />
		</>
	);
	const renderedButtonContent = href ? (
		<Link to={href}>
			{renderedInner}
		</Link>
	) : renderedInner;

	const asChild = Boolean(href);

	console.log(cta, name, renderedButtonContent);
	return (
		<div
			key={name}
			className={cn(
				'group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl',
				// light styles
				'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
				// dark styles
				'transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
				className,
			)}
		>
			<div>
				<img className="absolute -right-20 -top-20 opacity-60" />
			</div>
			<div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
				<Icon className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
				<h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
					{name}
				</h3>
				<p className="max-w-lg text-neutral-400">{description}</p>
			</div>

			<div
				className={cn(
					'pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100',
				)}
			>
				<Button
					variant="ghost"
					asChild={asChild}
					size="sm"
					className="pointer-events-auto"
					onClick={onClick}
				>
					{renderedButtonContent}
				</Button>
			</div>
			<div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
		</div>
	);
};

export { BentoCard, BentoGrid };
