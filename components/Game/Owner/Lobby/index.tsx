import { StarIcon, UserIcon } from '@heroicons/react/24/solid'
import { Game } from 'backend/types'
import Button from 'components/Button'
import Card from 'components/Card'
import { useGame } from 'providers/game'
import { FC } from 'react'

interface LobbyProps {}

const Lobby: FC<LobbyProps> = ({}) => {
	const { data, socket } = useGame()

	const startPlanning = () => {
		socket.emit('ingame/state', Game.State.PREGAME)
	}

	return (
		<div className='flex flex-col space-y-2 items-center justify-center h-screen'>
			<Card title='Planning Poker 🃏' className='w-max'>
				{data.players.map((player) => (
					<div key={player.id} className='flex items-center font-semibold'>
						{player.role === 'owner' ? <StarIcon className='w-4 h-4 mr-1' /> : <UserIcon className='w-4 h-4 mr-1' />}
						{player.name}
					</div>
				))}
			</Card>
			<Button onClick={startPlanning} type='primary'>
				Start Planning
			</Button>
		</div>
	)
}

export default Lobby
