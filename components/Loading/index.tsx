import clsx from 'clsx'
import { FC } from 'react'
import { ThemeType } from 'types'

interface LoadingProps {
	size?: number
	type?: ThemeType
}

const Loading: FC<LoadingProps> = ({ size = 4, type }) => {
	return (
		<div
			style={{
				height: size * 4,
				width: size * 4,
			}}
			className={clsx(type === 'primary' ? 'border-theme-secondary' : 'border-theme-primary', 'border-2 rounded-full border-t-transparent animate-spin')}
		/>
	)
}

export default Loading
