import { PokerCard, Button, Input, Label, Modals } from 'components'
import { FC, useState } from 'react'
import clsx from 'clsx'
import { Game } from 'types/backend'
import { useGame } from 'providers/game'

const Player: FC = () => {
	const { socket, self, data } = useGame()
	const [value, setValue] = useState<string>('')
	const [isFlipped, setIsFlipped] = useState<boolean>(true)
	const [flyout, setFlyout] = useState<boolean>(false)
	const [modalVisibility, setModalVisibility] = useState<boolean>(false)

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
	const round = data.rounds.find((round) => round.id === data.currentRound)
	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<div className={clsx('flex items-center mb-8 space-x-2 transition-opacity', 'opacity-100')}>
				<Label
					type={!round.id.endsWith('???') ? 'primary' : 'secondary'}
					onClick={() => {
						if (!round.id.endsWith('???')) {
							setModalVisibility(true)
						}
					}}
					className={clsx('normal-case', !round.id.endsWith('???') && 'cursor-pointer')}
				>
					[{round?.id}]
				</Label>
				<span className='transition-colors font-semibold'>{round?.title}</span>
			</div>
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
			{modalVisibility ? <Modals.Issue close={() => setModalVisibility(false)} issueId={data.currentRound} /> : null}
		</div>
	)
}

export default Player
