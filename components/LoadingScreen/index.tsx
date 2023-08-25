import { FC } from 'react'

interface LoadingScreenProps {
	message?: string
}

const LoadingScreen: FC<LoadingScreenProps> = ({ message }) => {
	return (
		<div className='h-screen w-full flex flex-col items-center justify-center'>
			<div className='h-8 w-8 border-2 rounded-full border-theme-primary border-t-transparent animate-spin' />
			{message ? <div className='mt-2'>{message}</div> : null}
		</div>
	)
}

export default LoadingScreen
