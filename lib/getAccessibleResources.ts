export interface AccessibleResource {
	id: string
	url: string
	name: string
	scopes: string[]
	avatarUrl: string
}

export default async function getAccessibleResources(token: string) {
	const url = 'https://api.atlassian.com/oauth/token/accessible-resources'
	const accessibleResources: AccessibleResource[] = await fetch(url, {
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${token}`,
		},
	}).then((r) => r.json())

	return accessibleResources
}
