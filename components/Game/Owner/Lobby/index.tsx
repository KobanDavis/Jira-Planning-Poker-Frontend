import { StarIcon, UserIcon } from '@heroicons/react/24/solid'
import { Game } from 'backend/types'
import clsx from 'clsx'
import { Button, Card, Issue, Label, Loading } from 'components'
import { borderBase } from 'lib/styles'
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
			<Card title={data.name} className='w-[30rem]'>
				<Label className='mb-2' type='secondary'>
					Connected Players
				</Label>
				<div className='bg-theme-secondary shadow-inner rounded-sm p-1 min-h-[10rem] flex flex-wrap content-start'>
					{data.players.map((player) => (
						<div key={player.id} className='flex items-center rounded-sm  bg-theme-primary/5 pr-2 pl-1 m-1 h-min'>
							{player.role === 'owner' ? <StarIcon className='text-yellow-400 w-3 h-3 mr-1' /> : <UserIcon className='w-3 h-3 mr-1' />}
							{player.name}
						</div>
					))}
				</div>
			</Card>
			<Button onClick={startPlanning} type='primary'>
				Start Planning
			</Button>
		</div>
	)
}

export default Lobby
