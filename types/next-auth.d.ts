import { DefaultSession } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
	interface Session extends DefaultSession {
		error?: string
		token: string
		cloudId: string
		resourceUrl: string
	}
}

declare module 'next-auth/jwt' {
	interface JWT extends DefaultJWT {
		resourceUrl: string
		access_token: string
		refresh_token: string
		cloudId: string
		expires_at: number
		error?: string
	}
}
