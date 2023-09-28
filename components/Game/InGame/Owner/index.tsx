import { useGame } from 'providers/game'
import { FC, useEffect, useState } from 'react'
import { Button, Input, Label, Modals, PokerCard } from 'components'
import clsx from 'clsx'
import { Game } from 'types/backend'
import { EyeIcon, EyeSlashIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid'

interface InGameProps {}
const FlyInCard: FC<{ isStraight: boolean }> = ({ isStraight }) => {
	const initX = window.innerWidth / 2 + 300
	const initDeg = Math.floor(Math.random() * 20) - 10
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
	const { data, socket, self } = useGame()
	const [isReady, setIsReady] = useState<boolean>(false)
	const [flyout, setFlyout] = useState<boolean>(false)
	const [modalVisibility, setModalVisibility] = useState<boolean>(false)
	const [value, setValue] = useState<string>('')
	const [voteIsVisible, setVoteIsVisible] = useState<boolean>(false)

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

	const submit = () => {
		const card: Game.Card = {
			id: self.id,
			name: self.name,
			value,
		}
		socket.emit('ingame/card', card)
	}

	const round = data.rounds.find((round) => round.id === data.currentRound)
	const hasSubmittedCard = data.cards.some((card) => card.id === self.id)
	return (
		<div className='select-none overflow-hidden w-full h-screen flex flex-col items-center justify-center'>
			<div className={clsx('flex items-center mb-8 space-x-2 transition-opacity', isReady ? 'opacity-0' : 'opacity-100')}>
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
			<div className={clsx('flex flex-col items-center transition-opacity space-y-2', flyout ? 'opacity-0' : 'opacity-100')}>
				<div className='flex flex-col transition-opacity mt-2'>
					{hasSubmittedCard === false ? (
						<>
							<div className='flex items-center space-x-2 cursor-pointer' onClick={() => setVoteIsVisible(!voteIsVisible)}>
								<Label>Estimate</Label>
								{voteIsVisible ? <EyeIcon className='h-4 w-4' /> : <EyeSlashIcon className='h-4 w-4' />}
							</div>
							<div className='flex mt-2'>
								<Input
									className='rounded-r-none'
									htmlType={voteIsVisible ? 'text' : 'password'}
									onChange={(e) => setValue((e.target as any).value)}
								/>
								<Button
									type='primary'
									disabled={Number(value) < 0 || value.length === 0}
									className=' rounded-l-none border-l-0'
									onClick={submit}
								>
									<PaperAirplaneIcon className='w-4 h-4' />
								</Button>
							</div>
						</>
					) : null}
				</div>

				<div className='flex space-x-2'>
					<Button disabled={isReady} onClick={cancelVote}>
						Cancel
					</Button>
					<Button type={data.cards.length === data.players.length ? 'primary' : undefined} onClick={finishVote} disabled={data.cards.length === 0}>
						Flip
					</Button>
				</div>
			</div>
			{modalVisibility ? <Modals.Issue close={() => setModalVisibility(false)} issueId={data.currentRound} /> : null}
		</div>
	)
}

export default Owner
