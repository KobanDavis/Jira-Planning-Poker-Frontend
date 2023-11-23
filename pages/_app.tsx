import dynamic from 'next/dynamic'
import localFont from 'next/font/local'
import { Modals } from 'components'
import { useLayoutEffect, useState } from 'react'
import { AppProps } from 'next/app'
import { GameProvider } from 'providers/game'
import { JiraProvider } from 'providers/jiraAuth'
import { ThemeProvider, useTheme } from '@kobandavis/ui'
import { Cog6ToothIcon } from '@heroicons/react/24/solid'
import Head from 'next/head'

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
	const [modalVisibility, setModalVisibility] = useState<boolean>(false)

	useLayoutEffect(() => {
		document.documentElement.style.setProperty('font-size', localStorage.getItem('baseFontSize') + 'px')
		document.body.classList.add(satoshi.className)
		setThemeColor('primary', localStorage.getItem('primary') ?? defaultTheme.primary)
		setThemeColor('secondary', localStorage.getItem('secondary') ?? defaultTheme.secondary)
	}, [])

	return (
		<JiraProvider>
			<Head>
				<link
					rel='icon'
					href='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🃏</text></svg>'
				/>
			</Head>
			<GameProvider>
				<>
					<Component {...pageProps} />
					<Cog6ToothIcon
						className='right-2 top-2 absolute h-6 w-6 cursor-pointer transition-transform hover:rotate-45'
						onClick={() => setModalVisibility(true)}
					/>
					{modalVisibility ? <Modals.Settings close={() => setModalVisibility(false)} /> : null}
				</>
			</GameProvider>
		</JiraProvider>
	)
}

const AppWithTheme = (props: AppProps) => {
	return (
		<ThemeProvider>
			<App {...props} />
		</ThemeProvider>
	)
}

// ssr is for losers
// export default AppWithTheme
export default dynamic(Promise.resolve(AppWithTheme), { ssr: false })
