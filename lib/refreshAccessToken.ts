import { JWT } from 'next-auth/jwt'

interface RefreshTokenResponse {
	access_token: string
	refresh_token: string
	expires_in: number
	scope: string
}

export default async function refreshAccessToken(token: JWT) {
	try {
		const response: RefreshTokenResponse = await fetch('https://auth.atlassian.com/oauth/token', {
			headers: { 'Content-Type': 'application/json' },
			method: 'POST',
			body: JSON.stringify({
				grant_type: 'refresh_token',
				client_id: process.env.JIRA_CLIENT_ID,
				client_secret: process.env.JIRA_SECRET,
				refresh_token: token.refresh_token,
			}),
		}).then((r) => r.json())

		token.access_token = response.access_token
		token.refresh_token = response.refresh_token || token.refresh_token
		token.expires_at = Date.now() + response.expires_in * 1000
	} catch (e) {
		console.error('RefreshTokenError', e)
		token.error = 'RefreshTokenError'
	}

	return token
}
