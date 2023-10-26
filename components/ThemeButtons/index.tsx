import clsx from 'clsx'
import { FC } from 'react'
import { Button, ThemeType, borderBase, useTheme } from '@kobandavis/ui'
import { EyeDropperIcon } from '@heroicons/react/24/solid'

interface ThemeButtonsProps {}

const ThemeButtons: FC<ThemeButtonsProps> = ({}) => {
	const { theme, setThemeColor } = useTheme()

	const handleThemeChange = (color: ThemeType, value: string) => {
		localStorage.setItem(color, value)
		setThemeColor(color, value)
	}

	return (
		<div className='flex space-x-2'>
			<Button type='primary' className='relative flex items-center'>
				<span>Primary</span>
				<EyeDropperIcon className='w-3 h-3 ml-1' />
				<input
					className={clsx(borderBase, 'absolute w-full h-full cursor-pointer left-0 opacity-0')}
					type='color'
					value={theme.primary}
					onChange={(e) => handleThemeChange('primary', e.target.value)}
				/>
			</Button>
			<Button type='secondary' className='relative flex items-center'>
				<span>Secondary</span>
				<EyeDropperIcon className='w-3 h-3 ml-1' />
				<input
					className={clsx(borderBase, 'absolute w-full h-full cursor-pointer left-0 opacity-0')}
					type='color'
					value={theme.secondary}
					onChange={(e) => handleThemeChange('secondary', e.target.value)}
				/>
			</Button>
		</div>
	)
}

export default ThemeButtons
