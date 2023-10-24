import getAccessibleResources from 'lib/getAccessibleResources'
import refreshAccessToken from 'lib/refreshAccessToken'
import NextAuth, { NextAuthOptions } from 'next-auth'
import AtlassianProvider from 'next-auth/providers/atlassian'

export const authOptions: NextAuthOptions = {
	providers: [
		AtlassianProvider({
			clientId: process.env.JIRA_CLIENT_ID,
			clientSecret: process.env.JIRA_SECRET,
			authorization: {
				params: {
					scope: [
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
				}
			}
		})
	],
	callbacks: {
		async jwt({ token, account, user }) {
			if (account && user) {
				const { access_token, expires_at, refresh_token } = account
				const resources = await getAccessibleResources(access_token)

				token.access_token = access_token
				token.refresh_token = refresh_token
				token.expires_at = expires_at * 1000
				token.cloudId = resources[0].id
				token.resourceUrl = resources[0].url

				delete token.error
				return token
			}

			if (Date.now() < token.expires_at) {
				return token
			}

			return refreshAccessToken(token)
		},
		async session({ session, token }) {
			session.token = token.access_token
			session.cloudId = token.cloudId
			session.resourceUrl = token.resourceUrl
			session.error = token.error
			session.expires = token.expires_at

			return session
		}
	},
	pages: { signIn: '/login' },
	secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)
