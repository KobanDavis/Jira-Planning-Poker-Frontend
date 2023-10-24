import { FC, useEffect, useState } from 'react'

import { Game } from 'types/backend'
import { NotJoined, Lobby, PreGame, PostGame, InGame } from 'components/Game'
import { useRouter } from 'next/router'
import { useGame } from 'providers/game'
import { useJira } from 'providers/jira'
import { LoadingScreen } from '@kobandavis/ui'

const Room: FC = () => {
	const router = useRouter()
	const roomId = router.query.roomId as string
	const { self, data, socket, updateData } = useGame()
	const jira = useJira()
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
			const issues = await jira.getIssues(sprintId.toString())
			const rounds = issues.map<Game.Round>((issue) => ({
				id: issue.key,
				title: issue.fields.summary,
				resolution: Game.Resolution.TODO,
				value: issue.fields.customfield_10020?.toString()
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
			const name = window.localStorage.getItem('name')
			if (name) {
				join(name)
				return <LoadingScreen message='Joining game' />
			}
			return <NotJoined join={join} />
		}
		case Game.State.LOBBY: {
			return <Lobby />
		}
		case Game.State.PREGAME: {
			return <PreGame />
		}
		case Game.State.INGAME: {
			return self.role === 'owner' ? <InGame.Owner /> : <InGame.Player />
		}
		case Game.State.POSTGAME: {
			return <PostGame />
		}
		default:
			return <div>Game machine broke :(</div>
	}
}

export default Room
