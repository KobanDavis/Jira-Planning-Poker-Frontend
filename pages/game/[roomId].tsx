import { FC, useEffect, useState } from 'react'

import { Game } from 'types/backend'
import { NotJoined, Lobby, PreGame, PostGame, InGame } from 'components/Game'
import { useRouter } from 'next/router'
import { useGame } from 'providers/game'
import { useJira } from 'providers/jira'
import { LoadingScreen } from '@kobandavis/ui'
import { Cog6ToothIcon, UserIcon, WifiIcon } from '@heroicons/react/24/solid'
import { Modals } from 'components'
import ConnectedPlayers from 'components/ConnectedPlayers'

const Room: FC = () => {
	const router = useRouter()
	const { self, data, socket, updateData } = useGame()
	const jira = useJira()

	const [modalVisibility, setModalVisibility] = useState<boolean>(false)
	const [roomExists, setRoomExists] = useState<boolean>(null)

	const roomId = router.query.roomId as string

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

	const getPage = () => {
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

	return (
		<>
			{getPage()}

			<Cog6ToothIcon
				className='right-2 top-2 absolute h-6 w-6 cursor-pointer transition-transform hover:rotate-45'
				onClick={() => setModalVisibility(true)}
			/>
			<div className='left-2 top-2 absolute group'>
				<div className='pb-2'>
					<UserIcon className='h-6 w-6 cursor-pointer' onClick={() => setModalVisibility(true)} />
				</div>
				<ConnectedPlayers className='absolute transition-all -translate-x-full opacity-0 group-hover:opacity-100 group-hover:translate-x-0' />
			</div>
			{modalVisibility ? <Modals.Settings close={() => setModalVisibility(false)} /> : null}
		</>
	)
}

export default Room
