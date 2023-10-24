import React, { useContext, createContext, FC, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import JiraClient from 'lib/jira'

const JiraProvider: FC<{ children: React.ReactNode }> = (props) => {
	const [jira, setJira] = useState<JiraClient>(null)
	const { data: session, update } = useSession()

	useEffect(() => {
		if (session) {
			setJira(new JiraClient(session, update))
		}
	}, [Boolean(session)])

	if (session && !jira) return null

	return <Jira.Provider value={jira} {...props} />
}

const Jira = createContext<JiraClient>(null)

const useJira = () => useContext(Jira)

export { JiraProvider, useJira }
