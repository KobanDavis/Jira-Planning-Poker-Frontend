import { JiraAPI } from './jira'

export default async function getAccessibleResources(token: string) {
	const url = 'https://api.atlassian.com/oauth/token/accessible-resources'
	const accessibleResources: JiraAPI.AccessibleResource[] = await fetch(url, {
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${token}`
		}
	}).then((r) => r.json())

	return accessibleResources
}
