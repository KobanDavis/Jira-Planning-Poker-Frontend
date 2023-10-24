import { Auth } from 'components'
import { useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import { GameProvider } from 'providers/game'
import { JiraProvider } from 'providers/jira'
import { ThemeProvider, useTheme } from '@kobandavis/ui'
import localFont from 'next/font/local'

import 'styles/globals.css'

const satoshi = localFont({
	src: [
		{ path: './Satoshi-Variable.woff2', style: 'normal' },
		{ path: './Satoshi-VariableItalic.woff2', style: 'italic' }
	]
})

const defaultTheme = { primary: '#286983', secondary: '#faf4ed' }

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
	const { setThemeColor } = useTheme()

	useEffect(() => {
		document.body.classList.add(satoshi.className)
		setThemeColor('primary', window.localStorage.getItem('primary') ?? defaultTheme.primary)
		setThemeColor('secondary', window.localStorage.getItem('secondary') ?? defaultTheme.secondary)
	}, [])

	return (
		<SessionProvider>
			<JiraProvider>
				<GameProvider>
					<Auth>
						<Component {...pageProps} />
					</Auth>
				</GameProvider>
			</JiraProvider>
		</SessionProvider>
	)
}

const AppWithTheme = (props: AppProps) => {
	return (
		<ThemeProvider>
			<App {...props} />
		</ThemeProvider>
	)
}

export default AppWithTheme
