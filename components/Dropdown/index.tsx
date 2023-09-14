'use client'

import { FC, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { ThemeType } from 'types'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { Button, Loading } from 'components'
import { buttonStyles } from 'components/Button'
import useDropdownPosition from './useDropdownPosition'

interface DropdownProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onChange'> {
	type?: ThemeType
	placeholder?: string
	selectedItemId?: string
	onChange?(id: string): void
	loading?: boolean
	items?: {
		icon?: string
		label: string
		id: string
	}[]
}

const Dropdown: FC<DropdownProps> = ({ disabled, className, type, items, placeholder, selectedItemId, onChange, loading, ...props }) => {
	const selectedItem = items?.find((item) => item.id === selectedItemId)
	const [itemsAreVisible, setItemsAreVisible] = useState(false)
	const { dropdownRef, ...position } = useDropdownPosition()
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (!dropdownRef.current?.contains(e.target as any)) {
				setItemsAreVisible(false)
			}
		}

		document.addEventListener('click', handleClickOutside)
		return () => document.removeEventListener('click', handleClickOutside)
	}, [itemsAreVisible, dropdownRef])

	return (
		<div>
			<Button
				disabled={disabled || items ? items.length === 0 : true}
				type={type}
				ref={dropdownRef}
				onClick={() => setItemsAreVisible(loading ? false : !itemsAreVisible)}
				className={clsx(
					className,
					buttonStyles[type ?? 'DEFAULT'],
					'flex px-4 py-1.5 rounded-sm font-semibold text-xs backdrop-blur-lg transition-colors h-min relative'
				)}
				{...props}
			>
				<span className={clsx(loading && 'text-white/0')}>
					{items?.length > 0 ? (
						selectedItem ? (
							<div className='flex items-center'>
								{selectedItem.icon ? <img className='mr-2 h-4 w-4' src={selectedItem.icon} /> : null}
								{selectedItem.label}
							</div>
						) : (
							placeholder ?? 'Select item'
						)
					) : (
						'No data'
					)}
				</span>
				<ChevronDownIcon className={clsx('h-4 w-3 ml-2 -mr-1', itemsAreVisible && 'rotate-180')} />
				{loading ? (
					<div className='w-full h-full absolute top-0 left-0 flex items-center justify-center'>
						<Loading />
					</div>
				) : null}
			</Button>
			{itemsAreVisible ? (
				<div
					style={{
						...position,
						margin: `${position.margin}px 0`,
					}}
					className={clsx('w-max flex flex-col absolute rounded-sm overflow-auto z-10 bg-theme-secondary')}
				>
					{items?.map(({ label, id, icon }, i) => (
						<div
							onClick={() => onChange?.(id)}
							key={id}
							className={clsx(
								buttonStyles[type ?? 'DEFAULT'],
								i !== 0 && 'border-t-0',
								i !== items.length - 1 && 'border-b-0',
								'flex items-center w-full cursor-pointer px-4 py-1.5 font-semibold text-xs transition-colors text-start'
							)}
						>
							{icon ? <img className='mr-2 h-4 w-4' src={icon} /> : null}
							{label}
						</div>
					))}
				</div>
			) : null}
		</div>
	)
}

export default Dropdown
