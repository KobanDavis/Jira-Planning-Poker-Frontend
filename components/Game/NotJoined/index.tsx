import Button from 'components/Button'
import Input from 'components/Input'
import { FC, useState } from 'react'

interface NotJoinedProps {
	join(name: string): void
}

const NotJoined: FC<NotJoinedProps> = ({ join }) => {
	const [name, setName] = useState<string>(window.localStorage.getItem('name'))

	return (
		<div className='flex items-center justify-center w-screen h-screen'>
			<Input value={name} onChange={(e) => setName(e.target.value)} />
			<Button onClick={() => join(name)} className='ml-2' type='primary'>
				Join
			</Button>
		</div>
	)
}

export default NotJoined
