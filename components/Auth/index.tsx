import { FC } from 'react'

import { getProviders, signIn, useSession } from 'next-auth/react'
import Router from 'next/router'
import { LoadingScreen } from 'components'

interface AuthProps {
	children?: React.ReactElement
}

const Auth: FC<AuthProps> = ({ children }) => {
	const { status, data: session } = useSession()

	if (status === 'loading') return null

	const { pathname } = Router

	if (status === 'unauthenticated') {
		if (pathname === '/login') {
			return children
		} else {
			Router.push('/login')
			return null
		}
	}

	if (session?.error) {
		getProviders().then((providers) => signIn(providers.atlassian.id))
		return <LoadingScreen message='Logging in' />
	}

	return children
}

export default Auth
