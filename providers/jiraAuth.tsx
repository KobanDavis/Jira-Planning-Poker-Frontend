import { LoadingScreen } from '@kobandavis/ui'
import { useLocalState } from 'hooks'
import { getQS } from 'lib/qs'
import Jira, { JiraAPI } from 'lib/jira'
import { useRouter } from 'next/router'
import { useContext, createContext, useEffect } from 'react'
import type { FC, ReactNode } from 'react'

export interface JiraToken {
	token: string
	refreshToken: string
	expiry: number
}

export interface JiraAuth extends JiraToken {
	cloudId: string
	resourceURL: string
}

interface JiraContext {
	jira: Jira
	auth: JiraAuth
}

export const refreshAccessToken = async (refreshToken: string): Promise<JiraAPI.OAuthResponse> => {
	const res = await fetch('/api/auth/refresh', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ refreshToken })
	})
	return res.json()
}

const exchangeCode = async (code: string): Promise<JiraAuth> => {
	const res = await fetch('/api/auth/exchange', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ code })
	})
	return res.json()
}

export const hasExpired = (auth: JiraAuth) => {
	if (auth === null) return false
	return Date.now() > (auth?.expiry ?? 0)
}

const allowedRoutes = ['/login', '/callback']
const JiraProvider: FC<{ children: ReactNode }> = (props) => {
	const router = useRouter()
	const [localAuth, setLocalAuth] = useLocalState('jiraAuth')
	const auth: JiraAuth = JSON.parse(localAuth)

	const updateAuth = (auth: JiraAuth) => setLocalAuth(JSON.stringify(auth))

	useEffect(() => {
		const init = async () => {
			if (auth === null) {
				if (!allowedRoutes.includes(router.pathname)) {
					router.push('/login')
				} else if (router.pathname === '/callback') {
					const qs = getQS<'code'>()
					const newAuth = await exchangeCode(qs.code)
					updateAuth(newAuth)
					router.push('/')
				}
			} else if (hasExpired(auth)) {
				const newAuth = await refreshAccessToken(auth.refreshToken)
				updateAuth({ ...auth, ...newAuth })
			} else if (allowedRoutes.includes(router.pathname)) {
				router.push('/')
			}
		}

		init()
	}, [])

	const noAuthAndNotLoginPage = !auth && router.pathname !== '/login'
	const authenticatedButOnAuthRoute = auth && allowedRoutes.includes(router.pathname)

	console.log(hasExpired(auth), noAuthAndNotLoginPage, authenticatedButOnAuthRoute)
	if (hasExpired(auth) || noAuthAndNotLoginPage || authenticatedButOnAuthRoute) {
		return <LoadingScreen />
	}

	const jira = auth ? new Jira(auth) : null

	return <Context.Provider value={{ jira, auth }} {...props} />
}

const Context = createContext<JiraContext>(null)

const useJira = () => useContext(Context)

export { JiraProvider, useJira }
