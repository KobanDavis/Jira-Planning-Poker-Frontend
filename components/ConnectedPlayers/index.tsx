import { StarIcon, UserIcon } from '@heroicons/react/24/solid'
import { backgroundSecondaryBase, borderBase } from '@kobandavis/ui'
import clsx from 'clsx'
import { useGame } from 'providers/game'
import { FC } from 'react'

interface ConnectedPlayersProps extends React.HTMLAttributes<HTMLDivElement> {}

const ConnectedPlayers: FC<ConnectedPlayersProps> = ({ className, ...props }) => {
	const { data } = useGame()

	return (
		<div className={clsx(borderBase, backgroundSecondaryBase, className, 'backdrop-blur-lg px-2 py-1 select-none w-max')} {...props}>
			{data.players.map((player) => (
				<div key={player.id} className='flex items-center '>
					{player.role === 'owner' ? <StarIcon className='text-yellow-400 w-3 h-3 mr-1' /> : <UserIcon className='w-3 h-3 mr-1' />}
					{player.name}
				</div>
			))}
		</div>
	)
}

export default ConnectedPlayers
