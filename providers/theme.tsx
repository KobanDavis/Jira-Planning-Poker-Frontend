'use client'

import color from 'color'
import { useState, useContext, createContext, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { ThemeType } from 'types'

interface ThemeProviderProps {
	children: ReactNode
	initialTheme?: ThemeContext['theme']
}

interface ThemeContext {
	setThemeColor(color: ThemeType, value: string): void
	theme: Record<ThemeType, string>
}

type VariableKey = '--theme-primary' | '--theme-primary-light' | '--theme-primary-lighter' | '--theme-secondary'

type VariableMap = Record<VariableKey, string>

const ThemeProvider: FC<ThemeProviderProps> = ({ initialTheme, children, ...props }) => {
	const [theme, setTheme] = useState<ThemeContext['theme']>(
		initialTheme ?? {
			primary: '#000000',
			secondary: '#ffffff',
		}
	)

	const setThemeColor = (color: ThemeType, value: string) => {
		setTheme((old) => {
			const theme = structuredClone(old)
			theme[color] = value
			return theme
		})
	}

	useEffect(() => {
		const variables: VariableMap = {
			'--theme-primary': color(theme.primary).rgb().array().join(' '),
			'--theme-primary-light': color(theme.primary).lighten(0.05).string(),
			'--theme-primary-lighter': color(theme.primary).lighten(0.1).string(),
			'--theme-secondary': color(theme.secondary).rgb().array().join(' '),
		}

		Object.entries(variables).forEach((pair) => document.body.style.setProperty(...pair))

		return () => {
			Object.keys(variables).forEach((key) => document.body.style.removeProperty(key))
		}
	}, [theme])

	return (
		<Context.Provider value={{ theme, setThemeColor }} {...props}>
			{children}
		</Context.Provider>
	)
}

const Context = createContext<ThemeContext>(null as any)

const useTheme = () => useContext(Context)

export { ThemeProvider, useTheme }
