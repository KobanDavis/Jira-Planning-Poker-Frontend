import { Button, Input } from '@kobandavis/ui'
import { useLocalState } from 'hooks'
import { useGame } from 'providers/game'
import { FC } from 'react'

interface NotJoinedProps {
	join(name: string): void
}

const NotJoined: FC<NotJoinedProps> = ({ join }) => {
	const [name, setName] = useLocalState('name')
	const { data } = useGame()
	return (
		<div className='flex flex-col items-center justify-center w-screen h-screen'>
			<span className='font-semibold mb-4'>{data.name}</span>
			<div className='flex'>
				<Input className='rounded-r-none border-r-0' value={name} onChange={(e) => setName(e.target.value)} />
				<Button className='rounded-l-none' onClick={() => join(name)} type='primary'>
					Join
				</Button>
			</div>
		</div>
	)
}

export default NotJoined
