import clsx from 'clsx'
import { FC, ReactNode } from 'react'

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
	title?: ReactNode
}

const Card: FC<CardProps> = ({ className, title, children, ...props }) => {
	return (
		<div className={clsx(className, 'flex flex-col rounded-sm border border-theme-primary/15 bg-theme-primary/5 backdrop-blur-lg')} {...props}>
			{typeof title === 'string' ? <div className='px-4 py-2 text-lg font-semibold border-b border-b-theme-primary/15'>{title}</div> : title ?? null}
			{children ? <div className='p-4'>{children}</div> : null}
		</div>
	)
}

export default Card
