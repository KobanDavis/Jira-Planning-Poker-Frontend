import { EyeDropperIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import Button from 'components/Button'
import { borderBase } from 'lib/styles'
import { useTheme } from 'providers/theme'
import { FC } from 'react'

interface ThemeButtonsProps {}

const ThemeButtons: FC<ThemeButtonsProps> = ({}) => {
	const { theme, setThemeColor } = useTheme()
	return (
		<div className='flex space-x-2'>
			<Button type='primary' className='relative flex items-center'>
				<span>Primary</span>
				<EyeDropperIcon className='w-3 h-3 ml-1' />
				<input
					className={clsx(borderBase, 'absolute w-full h-full cursor-pointer left-0 opacity-0')}
					type='color'
					value={theme.primary}
					onChange={(e) => setThemeColor('primary', e.target.value)}
				/>
			</Button>
			<Button type='secondary' className='relative flex items-center'>
				<span>Secondary</span>
				<EyeDropperIcon className='w-3 h-3 ml-1' />
				<input
					className={clsx(borderBase, 'absolute w-full h-full cursor-pointer left-0 opacity-0')}
					type='color'
					value={theme.secondary}
					onChange={(e) => setThemeColor('secondary', e.target.value)}
				/>
			</Button>
		</div>
	)
}

export default ThemeButtons
