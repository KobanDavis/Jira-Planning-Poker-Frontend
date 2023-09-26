import clsx from 'clsx'
import { borderActive, backgroundSecondaryActive, backgroundPrimaryActive } from 'lib/styles'
import { FC, MutableRefObject, forwardRef } from 'react'
import { ThemeType } from 'types'

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
	type?: ThemeType
	icon?: boolean
}

export const buttonStyles = {
	DEFAULT: clsx(borderActive, backgroundSecondaryActive),
	primary: clsx('text-theme-secondary', backgroundPrimaryActive),
	secondary: backgroundSecondaryActive,
	icon: 'px-0 py-0 flex justify-center items-center w-8 h-8 rounded-full',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, type, icon, ...props }, ref) => {
	return (
		<button
			ref={ref}
			className={clsx(
				className,
				icon ? buttonStyles.icon : 'px-4 py-1.5 rounded-sm',
				'font-semibold text-xs uppercase transition-colors',
				buttonStyles[type ?? 'DEFAULT']
			)}
			{...props}
		/>
	)
})

export default Button
