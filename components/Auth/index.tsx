import { FC } from 'react'

import { getProviders, signIn, signOut, useSession } from 'next-auth/react'
import Router from 'next/router'
import { LoadingScreen } from '@kobandavis/ui'

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
		signOut()
		return <LoadingScreen message='Your session has expired, redirecting back to sign in' />
	}

	return children
}

export default Auth
