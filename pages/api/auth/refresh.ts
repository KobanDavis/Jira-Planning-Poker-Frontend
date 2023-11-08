import { JiraAPI } from 'lib/jira'
import type { NextApiRequest, NextApiResponse } from 'next'
import { JiraToken } from 'providers/jiraAuth'

export interface ErrorResponse {
	error: string
}

export default async (req: NextApiRequest, res: NextApiResponse<JiraToken | ErrorResponse>) => {
	let refreshToken: string
	if (!req.body.refreshToken) {
		return res.status(400).json({ error: 'Missing `refreshToken` property in body.' })
	} else {
		refreshToken = req.body.refreshToken
	}

	const response: JiraAPI.OAuthResponse | ErrorResponse = await fetch('https://auth.atlassian.com/oauth/token', {
		headers: { 'Content-Type': 'application/json' },
		method: 'POST',
		body: JSON.stringify({
			grant_type: 'refresh_token',
			client_id: process.env.NEXT_PUBLIC_JIRA_CLIENT_ID,
			client_secret: process.env.JIRA_SECRET,
			refresh_token: refreshToken
		})
	}).then((r) => r.json())

	res.status(200).json(
		'error' in response
			? response
			: {
					token: response.access_token,
					refreshToken: response.refresh_token || refreshToken,
					expiry: Date.now() + response.expires_in * 1000
			  }
	)
}
