import { Auth } from 'components'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import { GameProvider } from 'providers/game'
import { JiraProvider } from 'providers/jira'
import { ThemeProvider } from 'providers/theme'

import 'styles/globals.css'

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
	const theme = { primary: '#286983', secondary: '#faf4ed' } // && undefined

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
