import { FC } from 'react'

interface LoadingProps {
	size?: number
}

const Loading: FC<LoadingProps> = ({ size = 4 }) => {
	return (
		<div
			style={{
				height: size * 4,
				width: size * 4,
			}}
			className='border-2 rounded-full border-theme-primary border-t-transparent animate-spin'
		/>
	)
}

export default Loading
