import { Auth, Modals } from 'components'
import { useEffect, useLayoutEffect, useState } from 'react'
import { AppProps } from 'next/app'
import { GameProvider } from 'providers/game'
import { ThemeProvider, useTheme } from '@kobandavis/ui'
import { Cog6ToothIcon } from '@heroicons/react/24/solid'
import localFont from 'next/font/local'

import 'styles/globals.css'
import { JiraProvider } from 'providers/jiraAuth'
import dynamic from 'next/dynamic'

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
