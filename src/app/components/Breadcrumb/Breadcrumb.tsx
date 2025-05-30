import type { FC, JSX } from 'react';
import { Link } from 'react-router';

import { Breadcrumb as BreadcrumbComponent, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/shadcn/components/ui/breadcrumb';
import { useBreadcrumb } from '@/app/hooks';
import { cn } from '@/shadcn/lib/utils';

export const Breadcrumb: FC = () => {
	const items = useBreadcrumb();

	const renderedItems = items.map((item, i, items) => {
		const rendered: JSX.Element[] = [];
		const isLastElement = i === items.length - 1;

		const renderedItem = isLastElement ? (
			<BreadcrumbPage
				key={item.name + i}
				className={cn(!isLastElement && 'hidden md:block')}
			>
				{item.name}
			</BreadcrumbPage>
		) : (
			<BreadcrumbItem
				key={item.name + i}
				className={cn(!isLastElement && 'hidden md:block')}
			>
				<BreadcrumbLink asChild>
					<Link to={item.link}>
						{item.name}
					</Link>
				</BreadcrumbLink>
			</BreadcrumbItem>
		);

		rendered.push(renderedItem);

		if (!isLastElement) {
			rendered.push(
				<BreadcrumbSeparator
					key={'separator' + i}
					className="hidden md:block"
				/>,
			);
		}

		return rendered;
	});

	return (
		<BreadcrumbComponent>
			<BreadcrumbList>
				{renderedItems}
			</BreadcrumbList>
		</BreadcrumbComponent>
	);
};
