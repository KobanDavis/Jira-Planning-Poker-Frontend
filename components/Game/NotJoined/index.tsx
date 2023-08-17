import Button from 'components/Button'
import Input from 'components/Input'
import { useGame } from 'providers/game'
import { FC, useState } from 'react'

interface NotJoinedProps {
	join(name: string): void
}

const NotJoined: FC<NotJoinedProps> = ({ join }) => {
	const [name, setName] = useState<string>(window.localStorage.getItem('name'))
	const { data } = useGame()
	return (
		<div className='flex flex-col items-center justify-center w-screen h-screen'>
			<span className='font-semibold mb-4'>{data.name}</span>
			<div className='flex'>
				<Input value={name} onChange={(e) => setName(e.target.value)} />
				<Button onClick={() => join(name)} className='ml-2' type='primary'>
					Join
				</Button>
			</div>
		</div>
	)
}

export default NotJoined
