import { useGame } from 'providers/game'
import { FC, useEffect, useState } from 'react'
import { Button, IssueModal, Label, PokerCard } from 'components'
import clsx from 'clsx'
import { Game } from 'types/backend'

interface InGameProps {}
const FlyInCard: FC<{ isStraight: boolean }> = ({ isStraight }) => {
	const initX = window.innerWidth / 2 + 300
	const initDeg = Math.floor(Math.random() * 20) - 10
	const { data } = useGame()
	const [deg, setDeg] = useState(initDeg)
	const [x, setX] = useState(initX)

	useEffect(() => {
		setTimeout(() => setX(0), 100)
	}, [])

	useEffect(() => {
		if (isStraight) {
			setDeg(0)
		}
	}, [isStraight])

	return (
		<div
			className='absolute transition-all duration-500'
			style={{
				transform: `translateX(${x}px) rotate(${deg}deg)`,
			}}
		>
			<PokerCard />
		</div>
	)
}

const Owner: FC<InGameProps> = ({}) => {
	const { data, socket } = useGame()
	const [isReady, setIsReady] = useState<boolean>(false)
	const [flyout, setFlyout] = useState<boolean>(false)
	const [modalVisibility, setModalVisibility] = useState<boolean>(false)

	const cancelVote = () => {
		socket.emit('ingame/state', Game.State.PREGAME)
		socket.emit('ingame/cards', [])
	}

	const finishVote = () => {
		setIsReady(true)
		setTimeout(() => {
			setFlyout(true)
			setTimeout(() => {
				socket.emit('ingame/state', Game.State.POSTGAME)
			}, 500)
		}, 500)
	}

	const round = data.rounds.find((round) => round.id === data.currentRound)
	return (
		<div className='select-none overflow-hidden w-full h-screen flex flex-col items-center justify-center'>
			<Label
				type='primary'
				onClick={() => setModalVisibility(true)}
				className={clsx('mb-8 cursor-pointer transition-opacity normal-case', isReady ? 'opacity-0' : 'opacity-100')}
			>
				<span className='mr-1'>[{round?.id}]</span>
				<span className='transition-colors'>{round?.title}</span>
			</Label>
			<div
				className={clsx(
					'flex items-center justify-center transition-all duration-500 relative rounded shrink-0 h-[21rem] w-[15rem] border-4',
					data.cards.length === data.players.length ? 'border-solid border-theme-primary' : 'border-dashed border-theme-primary/15',
					flyout ? 'opacity-0' : 'delay-500 opacity-100'
				)}
			>
				<div
					className='flex items-center justify-center w-full h-full absolute transition-all duration-500'
					style={{ transform: flyout ? `translateY(-${window.innerHeight / 2 + 320}px)` : 'translateY(0px)', opacity: flyout ? 0 : 1 }}
				>
					{data.cards.map((card) => (
						<FlyInCard key={card.id} isStraight={isReady} />
					))}
				</div>
			</div>
			<span className={clsx('my-4 transition-opacity', isReady ? 'opacity-0' : 'opacity-100')}>
				<span
					className={clsx('transition-colors font-bold', data.cards.length === data.players.length ? 'text-theme-primary' : 'text-theme-primary/15')}
				>
					{data.cards.length} / {data.players.length} cards
				</span>
			</span>
			<div className={clsx('transition-opacity space-x-2', flyout ? 'opacity-0' : 'opacity-100')}>
				<Button disabled={isReady} onClick={cancelVote}>
					Cancel
				</Button>
				<Button type={data.cards.length === data.players.length ? 'primary' : undefined} onClick={finishVote} disabled={data.cards.length === 0}>
					Flip
				</Button>
			</div>
			{modalVisibility ? <IssueModal close={() => setModalVisibility(false)} issueId={data.currentRound} /> : null}
		</div>
	)
}

export default Owner
