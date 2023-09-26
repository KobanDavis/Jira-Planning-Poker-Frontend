import { Auth } from 'components'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import { GameProvider } from 'providers/game'
import { JiraProvider } from 'providers/jira'
import { ThemeProvider } from 'providers/theme'
import localFont from 'next/font/local'

import 'styles/globals.css'
import { useEffect } from 'react'

const satoshi = localFont({
	src: [
		{ path: './Satoshi-Variable.woff2', style: 'normal' },
		{ path: './Satoshi-VariableItalic.woff2', style: 'italic' },
	],
})

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
	const theme = { primary: '#286983', secondary: '#faf4ed' }

	useEffect(() => document.body.classList.add(satoshi.className), [])

	return (
		<ThemeProvider initialTheme={theme}>
			<SessionProvider>
				<JiraProvider>
					<GameProvider>
						<Auth>
							<Component {...pageProps} />
						</Auth>
					</GameProvider>
				</JiraProvider>
			</SessionProvider>
		</ThemeProvider>
	)
}

export default App
