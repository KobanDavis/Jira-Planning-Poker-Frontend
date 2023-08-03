import { Events, Game } from 'backend/types'
import { Owner, NotJoined } from 'components/Game'
import { useRouter } from 'next/router'
import { useGame } from 'providers/game'
import { FC } from 'react'

const Room: FC = () => {
	const router = useRouter()
	const { self, data, socket } = useGame()
	console.log(useGame())
	const { roomId } = router.query

	const join = (name: string) => {
		socket.emit('room/join', { roomId: roomId.toString(), id: self.id, name }, console.log)
	}

	switch (data.state) {
		case Game.State.NOT_JOINED: {
			return <NotJoined join={join} />
		}
		case Game.State.LOBBY: {
			return self.role === 'player' ? <div>LOBBY</div> : <Owner.Lobby />
		}
		case Game.State.PREGAME: {
			return <div>PREGAME</div>
		}
		case Game.State.INGAME: {
			return <div>INGAME</div>
		}
		case Game.State.POSTGAME: {
			return <div>POSTGAME</div>
		}
		default:
			return <div>Game machine broke :(</div>
	}
}

export default Room
