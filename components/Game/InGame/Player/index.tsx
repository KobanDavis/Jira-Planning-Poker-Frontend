import { PokerCard, Button, Input, Label } from 'components'
import { FC, useState } from 'react'
import clsx from 'clsx'
import { Game } from 'types/backend'
import { useGame } from 'providers/game'

const Player: FC = () => {
	const [value, setValue] = useState<string>('')
	const [isFlipped, setIsFlipped] = useState(true)
	const [flyout, setFlyout] = useState(false)
	const { socket, self, data } = useGame()

	const submit = () => {
		setIsFlipped(false)
		setTimeout(() => {
			setFlyout(true)
			setTimeout(() => {
				const card: Game.Card = {
					id: self.id,
					name: self.name,
					value,
				}
				socket.emit('ingame/card', card)
			}, 300)
		}, 500)
	}

	const selfCard = data.cards.find((card) => card.id === self.id)

	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			{!selfCard ? (
				<>
					<div
						className='transition-all duration-300'
						style={{
							transform: flyout ? `translateX(-${window.innerWidth}px)` : 'translateX(-0px)',
							opacity: Number(!flyout),
						}}
					>
						<PokerCard isFlipped={isFlipped} value={value} className='relative flex justify-center' />
					</div>
					<div className={clsx('flex flex-col transition-opacity mt-2', isFlipped ? 'opacity-100' : 'opacity-0')}>
						<Label>Estimate</Label>
						<Input className='mt-2' value={value} onChange={(e) => setValue((e.target as any).value)} />
						<Button disabled={Number(value) < 0 || value.length === 0} className='mt-2' onClick={submit}>
							Submit
						</Button>
					</div>
				</>
			) : (
				<div className='flex flex-col items-center space-y-2'>
					<span className='font-bold text-xl'>Card submitted</span>
					<span>
						You voted <span className='font-bold'>{selfCard.value}</span>
					</span>
				</div>
			)}
		</div>
	)
}

export default Player
