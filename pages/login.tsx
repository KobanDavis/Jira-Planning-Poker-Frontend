import { FC } from 'react'
import { Button, Card } from 'components'
import { signIn, ClientSafeProvider, getProviders, getSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'

interface LoginProps {
	atlassian: ClientSafeProvider
}

const Login: FC<LoginProps> = ({ atlassian }) => {
	return (
		<div className='flex items-center justify-center min-h-screen bg-theme-secondary text-theme-primary'>
			<Card title='Planning Poker'>
				<Button onClick={() => signIn(atlassian.id)}>Log in with {atlassian.name}</Button>
			</Card>
		</div>
	)
}

export const getServerSideProps: GetServerSideProps<LoginProps> = async (context) => {
	const { req } = context
	const session = await getSession({ req })

	if (session) {
		return {
			redirect: { destination: '/' },
			props: { atlassian: null },
		}
	}

	return { props: await getProviders() }
}

export default Login
