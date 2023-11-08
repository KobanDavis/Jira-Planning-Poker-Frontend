import { FC } from 'react'
import { Button } from '@kobandavis/ui'

const scopes = [
	'offline_access',
	'read:me',
	'read:jira-work',
	'write:jira-work',
	'read:board-scope:jira-software',
	'read:sprint:jira-software',
	'read:jql:jira',
	'read:issue-details:jira',
	'read:issue:jira-software',
	'write:issue:jira-software'
].join(' ')

const Login: FC = () => {
	const getAuthCode = () => {
		const redirectURI = window.location.origin + '/callback'
		const url =
			`https://auth.atlassian.com/authorize` +
			`?audience=api.atlassian.com` +
			`&client_id=${process.env.NEXT_PUBLIC_JIRA_CLIENT_ID}` +
			`&scope=${encodeURIComponent(scopes)}` +
			`&redirect_uri=${redirectURI}` +
			`&state=0` +
			`&response_type=code` +
			`&prompt=consent`

		window.location.assign(url)
	}

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-theme-secondary text-theme-primary'>
			<svg className='fill-current w-12 h-12' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='none'>
				<path d='M10.8356 12.2374C10.6915 12.0788 10.4897 11.9924 10.2879 12.0212C10.1149 12.05 9.95636 12.1797 9.88429 12.3383L3.35484 25.3972C3.2107 25.6855 3.32601 26.017 3.61429 26.1611C3.70077 26.2044 3.78725 26.2188 3.87374 26.2188H12.9688C13.1851 26.2188 13.3868 26.1035 13.4733 25.9017C15.3904 21.9667 14.2084 15.8264 10.8356 12.2374Z' />
				<path d='M29.4726 25.3971C29.3573 25.1521 17.2353 0.90807 16.9326 0.30269C16.8461 0.129724 16.6876 0.0144138 16.5002 0H16.4858C16.2696 0.0144138 16.0822 0.129724 15.9669 0.317104C12.6805 5.52049 12.3058 11.8049 14.9723 17.1236L19.3541 25.9016C19.455 26.1034 19.6424 26.2187 19.873 26.2187H28.9537C29.2708 26.2187 29.5303 25.9593 29.5303 25.6422C29.5303 25.5701 29.5159 25.4836 29.4726 25.3971Z' />
			</svg>
			<Button type='primary' onClick={getAuthCode}>
				Log in with Atlassian
			</Button>
		</div>
	)
}

export default Login
