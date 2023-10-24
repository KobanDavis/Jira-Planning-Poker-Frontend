import { FC } from 'react'
import clsx from 'clsx'
import styles from './index.module.css'
import { borderBase } from '@kobandavis/ui'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	isFlipped?: boolean
	value?: string | number
	name?: string
}

const PokerCard: FC<CardProps> = ({ isFlipped = false, value, name, children, className, ...rest }) => {
	return (
		<div className='[perspective:1000px] h-80 w-56 bg-theme-secondary' {...rest}>
			<div
				className={clsx(
					borderBase,
					'w-full h-full transition-transform duration-500 rounded-md bg-theme-primary/15 [transform-style:preserve-3d] relative',
					isFlipped && '[transform:rotateY(180deg)]'
				)}
			>
				<div className={clsx(styles.stripes, 'absolute rounded-sm z-10 w-[stretch] h-[stretch] m-3 [backface-visibility:hidden]')} />
				<div
					className={clsx(
						'bg-theme-primary/5 rounded-md  flex items-center justify-center w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]'
					)}
				>
					<div className='text-6xl text-theme-primary'>{value}</div>
					<span className='absolute bottom-1 text-theme-primary'>{name}</span>
				</div>
			</div>
		</div>
	)
}

export default PokerCard
