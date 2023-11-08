import { JiraAuth, hasExpired, refreshAccessToken } from 'providers/jiraAuth'

type RecursivePartial<T> = {
	[P in keyof T]?: RecursivePartial<T[P]>
}

class Jira {
	private _baseUrl: string

	private _headers = new Headers()
	constructor(private _auth: JiraAuth) {
		this._baseUrl = `https://api.atlassian.com/ex/jira/${this._auth.cloudId}/rest`

		this._headers.append('Accept', 'application/json')
		this._updateTokenInHeader(this._auth.token)
	}

	private _updateTokenInHeader(token: string) {
		this._headers.set('Authorization', `Bearer ${token}`)
	}

	private async _checkToken(): Promise<void> {
		if (hasExpired(this._auth)) {
			console.log('token expired')
			Object.assign(this._auth, await refreshAccessToken(this._auth.refreshToken))
			this._updateTokenInHeader(this._auth.token)
		}
	}

	private async _request<T = any>(url: string, method?: string, body?: string, noJsonPlz: boolean = false): Promise<T> {
		await this._checkToken()
		return fetch(this._baseUrl + url, { method, headers: this._headers, body }).then((r) => (noJsonPlz ? r : r.json()))
	}

	public async getAttachment(attachment: any): Promise<string> {
		const res = await fetch(attachment.content, { headers: this._headers })

		const blob = await res.blob()
		return URL.createObjectURL(blob)
	}

	public async getBoards(): Promise<JiraAPI.Board[]> {
		const res = await this._request('/agile/1.0/board?type=scrum&orderBy=name')
		return res.values
	}

	public async getSprints(boardId: string): Promise<JiraAPI.Sprint[]> {
		const res = await this._request(`/agile/1.0/board/${boardId}/sprint?state=active,future`)
		return res.values.sort((a, b) => a.name.localeCompare(b.name))
	}

	public async getIssues(sprintId: string): Promise<JiraAPI.Issue[]> {
		const res = await this._request(`/agile/1.0/sprint/${sprintId}/issue`)
		return res.issues
	}

	public async getIssue(key: string): Promise<JiraAPI.Issue> {
		const res = await this._request(`/api/2/issue/${key}?expand=renderedFields`)
		return res
	}

	public getIssueUrl(key: string): string {
		return `${this._auth.resourceURL}/browse/${key}`
	}

	public async editIssueStoryPoints(issueId: string, value: number | null) {
		// name of the story point field is customfield_10020
		const body = { fields: { customfield_10020: value } }
		this._headers.append('Content-Type', 'application/json')
		const res = this._request(`/api/3/issue/${issueId}`, 'PUT', JSON.stringify(body), true)
		this._headers.delete('Content-Type')
		return res
	}

	public async getFieldTypes(): Promise<JiraAPI.IssueType[]> {
		return this._request('/api/2/field')
	}

	public async getIssueTypes(): Promise<JiraAPI.IssueType[]> {
		return this._request('/api/2/issuetype')
	}

	public async getProjects(): Promise<JiraAPI.Project[]> {
		return this._request<JiraAPI.Project[]>('/api/2/project').then((projects) => projects.sort((a, b) => a.name.localeCompare(b.name)))
	}

	public async getCreateMeta(): Promise<JiraAPI.CreateMeta[]> {
		const res = await this._request('/api/2/issue/createmeta')
		return res.projects
	}

	public async createNewIssue(issueTypeId: string, projectId: string, summary: string, description?: string): Promise<any> {
		const body: RecursivePartial<JiraAPI.Issue> = {
			fields: {
				issuetype: { id: issueTypeId },
				project: { id: projectId },
				summary,
				description
			}
		}
		this._headers.append('Content-Type', 'application/json')
		const res = this._request('/api/2/issue', 'POST', JSON.stringify(body))
		this._headers.delete('Content-Type')
		return res
	}
}

export default Jira

export namespace JiraAPI {
	export interface AccessibleResource {
		id: string
		url: string
		name: string
		scopes: string[]
		avatarUrl: string
	}

	export interface OAuthResponse {
		access_token: string
		refresh_token?: string
		expires_in: number
		scope: string
	}

	export interface AvatarURLs {
		'48x48': string
		'24x24': string
		'16x16': string
		'32x32': string
	}

	export interface CreateMeta {
		self: string
		id: string
		key: string
		name: string
		avatarUrls: AvatarURLs
		issuetypes: IssueType[]
	}

	export interface Project {
		expand: string
		self: string
		id: string
		key: string
		name: string
		avatarUrls: AvatarURLs
		projectCategory: {
			self: string
			id: string
			name: string
			description: string
		}
		projectTypeKey: string
		simplified: boolean
		style: string
		isPrivate: boolean
		properties: object
	}

	export interface IssueType {
		self: string
		id: string
		description: string
		iconUrl: string
		name: string
		untranslatedName: string
		subtask: boolean
	}

	export interface Board {
		id: number
		self: string
		name: string
		type: string
		location: {
			userId: number
			userAccountId: string
			displayName: string
			avatarURI: string
			name: string
		}
	}
	export interface Sprint {
		id: number
		self: string
		state: string
		name: string
		startDate: string
		endDate: string
		completeDate: string
		originBoardId: number
		goal: string
	}
	export interface Issue {
		expand: string
		id: string
		self: string
		key: string
		renderedFields: Issue['fields']
		fields: {
			statuscategorychangedate: string
			issuetype: {
				self: string
				id: string
				description: string
				iconUrl: string
				name: string
				subtask: boolean
				avatarId: number
				hierarchyLevel: number
			}
			timespent: null
			sprint: {
				id: number
				self: string
				state: string
				name: string
				startDate: string
				endDate: string
				originBoardId: number
				goal: string
			}
			project: {
				self: string
				id: string
				key: string
				name: string
				projectTypeKey: string
				simplified: boolean
				avatarUrls: AvatarURLs
				projectCategory: {
					self: string
					id: number
					description: string
					name: string
				}
			}
			customfield_10032: {
				self: string
				value: string
				id: string
			}
			fixVersions: []
			aggregatetimespent: null
			resolution: null
			resolutiondate: null
			workratio: -1
			lastViewed: string
			watches: {
				self: string
				watchCount: number
				isWatching: boolean
			}
			issuerestriction: {
				issuerestrictions: {}
				shouldDisplay: boolean
			}
			created: string
			customfield_10020: number
			epic: null
			priority: {
				self: string
				iconUrl: string
				name: string
				id: string
			}
			labels: []
			aggregatetimeoriginalestimate: null
			timeestimate: null
			versions: []
			issuelinks: []
			assignee: null
			updated: string
			status: {
				self: string
				description: string
				iconUrl: string
				name: string
				id: string
				statusCategory: {
					self: string
					id: number
					key: string
					colorName: string
					name: string
				}
			}
			components: []
			timeoriginalestimate: null
			description: string
			customfield_10057: string
			customfield_10015: {
				hasEpicLinkFieldDependency: boolean
				showField: boolean
				nonEditableReason: {
					reason: string
					message: string
				}
			}
			timetracking: {}
			security: null
			aggregatetimeestimate: null
			attachment: any[]
			flagged: boolean
			summary: string
			creator: {
				self: string
				accountId: string
				avatarUrls: AvatarURLs
				displayName: string
				active: boolean
				timeZone: string
				accountType: string
			}
			subtasks: []
			reporter: {
				self: string
				accountId: string
				avatarUrls: AvatarURLs
				displayName: string
				active: boolean
				timeZone: string
				accountType: string
			}
			aggregateprogress: {
				progress: number
				total: number
			}
			customfield_10000: string
			environment: null
			duedate: null
			closedSprints: []
			progress: {
				progress: number
				total: number
			}
			comment: {
				comments: {
					self: string
					id: string
					author: {
						self: string
						accountId: string
						avatarUrls: AvatarURLs
						displayName: string
						active: boolean
						timeZone: string
						accountType: string
					}
					body: string
					updateAuthor: {
						self: string
						accountId: string
						avatarUrls: AvatarURLs
						displayName: string
						active: boolean
						timeZone: string
						accountType: string
					}
					created: string
					updated: string
					jsdPublic: boolean
				}[]
				self: string
				maxResults: number
				total: number
				startAt: number
			}
			votes: {
				self: string
				votes: number
				hasVoted: boolean
			}
			worklog: {
				startAt: number
				maxResults: number
				total: number
				worklogs: []
			}
		}
	}
}
