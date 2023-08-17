import { Game } from 'backend/types'
import { LoadingScreen } from 'components'
import { Owner, NotJoined } from 'components/Game'
import { JiraAPI } from 'lib/jira'
import { useRouter } from 'next/router'
import { useGame } from 'providers/game'
import { useJira } from 'providers/jira'
import { FC, useEffect, useState } from 'react'

const Room: FC = () => {
	const router = useRouter()
	const roomId = router.query.roomId as string
	const { self, data, socket, updateData } = useGame()
	const jira = useJira()
	const [issues, setIssues] = useState<JiraAPI.Issue[]>(null)
	const [roomExists, setRoomExists] = useState<boolean>(null)

	useEffect(() => {
		if (!data.name && roomId) {
			socket.emit('room/exists', roomId, setRoomExists)
			socket.emit('room/name', roomId, (name) => updateData('name', name))
		}
	}, [router.query, data.name])

	const join = (name: string) => {
		socket.emit('room/join', { roomId: roomId.toString(), id: self.id, name }, async (sprintId) => {
			if (!sprintId) return
			const issues = await jira.getIssues(sprintId)
			const rounds = issues.map<Game.Round>((issue) => ({
				id: issue.key,
				title: issue.fields.summary,
				resolution: Game.Resolution.TODO,
				value: issue.fields.customfield_10020?.toString(),
			}))
			socket.emit('ingame/rounds', rounds)
		})
	}

	switch (roomExists) {
		case null: {
			return <LoadingScreen message='Loading room' />
		}
		case false: {
			router.push('/')
			return null
		}
		case true: {
			break
		}
	}

	console.log(self.id)

	switch (data.state) {
		case Game.State.NOT_JOINED: {
			return <NotJoined join={join} />
		}
		case Game.State.LOBBY: {
			return self.role === 'player' ? <div>LOBBY</div> : <Owner.Lobby />
		}
		case Game.State.PREGAME: {
			return self.role === 'player' ? <div>PREGAME</div> : <Owner.PreGame />
		}
		case Game.State.INGAME: {
			return self.role === 'player' ? <div>INGAME</div> : <Owner.InGame />
		}
		case Game.State.POSTGAME: {
			return self.role === 'player' ? <div>POSTGAME</div> : <Owner.PostGame />
		}
		default:
			return <div>Game machine broke :(</div>
	}
}

export default Room
