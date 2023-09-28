import clsx from 'clsx'
import { Loading } from 'components'
import React, { FC } from 'react'

interface ModalProps {
	close(): void
	loading?: boolean
	children: () => React.ReactNode
}

const Modal: FC<ModalProps> = ({ close, loading, children }) => {
	const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			close()
		}
	}

	return loading ? (
		<div className='flex items-center justify-center h-screen w-full fixed top-0 left-0 backdrop-blur-xl'>
			<Loading size={8} />
		</div>
	) : (
		<div onClick={handleOutsideClick} className={clsx('flex justify-center h-screen w-full fixed top-0 left-0 backdrop-blur-xl p-4 overflow-y-auto')}>
			{children()}
		</div>
	)
}

export default Modal
