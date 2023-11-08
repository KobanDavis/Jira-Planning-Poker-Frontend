import getAccessibleResources from 'lib/getAccessibleResources'
import { JiraAPI } from 'lib/jira'
import type { NextApiRequest, NextApiResponse } from 'next'
import { JiraAuth } from 'providers/jiraAuth'

export interface ErrorResponse {
	error: string
}

export default async (req: NextApiRequest, res: NextApiResponse<JiraAuth | ErrorResponse>) => {
	let code: string
	if (!req.body.code) {
		return res.status(400).json({ error: 'Missing `code` property in body.' })
	} else {
		code = req.body.code
	}

	const response: JiraAPI.OAuthResponse = await fetch('https://auth.atlassian.com/oauth/token', {
		headers: { 'Content-Type': 'application/json' },
		method: 'POST',
		body: JSON.stringify({
			grant_type: 'authorization_code',
			client_id: process.env.NEXT_PUBLIC_JIRA_CLIENT_ID,
			client_secret: process.env.JIRA_SECRET,
			redirect_uri: 'http://localhost:3000/callback',
			code
		})
	}).then((r) => r.json())

	const resources = await getAccessibleResources(response.access_token)

	const auth: JiraAuth = {
		token: response.access_token,
		refreshToken: response.refresh_token,
		expiry: Date.now() + response.expires_in * 1000,
		cloudId: resources[0].id,
		resourceURL: resources[0].url
	}

	res.status(200).json(auth)
}
