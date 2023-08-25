import clsx from 'clsx'
import { backgroundPrimaryActive, backgroundPrimaryHover, backgroundSecondaryActive, backgroundSecondaryHover, borderActive, borderHover } from 'lib/styles'
import { FC } from 'react'
import { ThemeType } from 'types'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	type?: ThemeType
	htmlType?: string
}

export const inputStyles = {
	DEFAULT: clsx(borderHover, backgroundSecondaryHover),
	primary: clsx('text-theme-secondary', backgroundPrimaryHover),
	secondary: backgroundSecondaryHover,
}

const Input: FC<InputProps> = ({ className, type, htmlType, ...props }) => {
	return (
		<input
			type={htmlType}
			className={clsx(
				'px-2 py-1.5 rounded-sm outline-none placeholder-theme-primary/50',
				'font-semibold text-xs transition-colors',
				inputStyles[type ?? 'DEFAULT'],
				className
			)}
			{...props}
		/>
	)
}

export default Input
