import { FC, useState } from 'react'
import clsx from 'clsx'

import { Label } from '@kobandavis/ui'
import { PokerCard, Modals, VoteButtons } from 'components'
import { Game } from 'types/backend'
import { useGame } from 'providers/game'

const Player: FC = () => {
	const { socket, self, data } = useGame()
	const [value, setValue] = useState<string>('')
	const [isFlipped, setIsFlipped] = useState<boolean>(true)
	const [flyout, setFlyout] = useState<boolean>(false)
	const [modalVisibility, setModalVisibility] = useState<boolean>(false)

	const submit = (vote) => {
		setValue(vote)
		setIsFlipped(false)
		setTimeout(() => {
			setFlyout(true)
			setTimeout(() => {
				const card: Game.Card = {
					id: self.id,
					name: self.name,
					value: vote
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
				<Label type='primary' onClick={() => setModalVisibility(true)} className='normal-case cursor-pointer'>
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
							opacity: Number(!flyout)
						}}
					>
						<PokerCard isFlipped={isFlipped} value={value} className='relative flex justify-center' />
					</div>
					<div className={clsx('flex flex-col transition-opacity mt-8', isFlipped ? 'opacity-100' : 'opacity-0')}>
						<VoteButtons submit={submit} />
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
