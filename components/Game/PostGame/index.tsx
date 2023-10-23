import clsx from 'clsx'
import { FC, ReactNode, useEffect, useState } from 'react'
import { Input, Button, Label } from '@kobandavis/ui'
import { PokerCard } from 'components'
import { useGame } from 'providers/game'
import { Game } from 'types/backend'

const Animation: FC<{ delay: number; children: ReactNode }> = ({ delay, children }) => {
	const [y, setY] = useState(200)

	useEffect(() => {
		setTimeout(() => setY(0), delay + 100)
	}, [delay])

	return (
		<div
			className='absolute transition-all duration-300'
			style={{
				opacity: y === 0 ? 1 : 0,
				transform: `translateY(${-y}px)`,
			}}
		>
			{children}
		</div>
	)
}

const PostGame: FC = ({}) => {
	const { data, socket, self } = useGame()
	const [estimate, setEstimate] = useState(null)

	const saveEstimate = () => {
		const round = Object.assign(
			{},
			data.rounds.find((round) => round.id === data.currentRound)
		)
		round.value = estimate.toString()
		socket.emit('ingame/round', round)
		socket.emit('ingame/cards', [])
		socket.emit('ingame/currentRound', null)
		socket.emit('ingame/state', Game.State.PREGAME)
	}

	const revote = () => {
		socket.emit('ingame/cards', [])
		socket.emit('ingame/state', Game.State.INGAME)
	}

	const values = (data.cards.map((card) => card.value) as number[]).filter((value) => value && Number.isFinite(Number(value))).sort((a, b) => a - b)

	const getMode = () => {
		if (values.length === 0) return '?'
		const map = values.reduce((map, value) => {
			if (map[value]) {
				map[value]++
			} else {
				map[value] = 1
			}
			return map
		}, {} as Record<number, number>)
		console.log(values, map)

		return Object.entries(map)
			.sort(([, a], [, b]) => b - a)[0][0]
			.toString()
	}

	const getMedian = () => {
		if (values.length === 0) return '?'

		const middle = values.length / 2 - 1
		if (Number.isInteger(middle)) {
			// even
			const a = values[middle]
			const b = values[middle + 1]
			return ((a + b) / 2).toString()
		} else {
			return values[Math.round(middle)].toString()
		}
	}

	const getMean = () => {
		if (values.length === 0) return '?'

		const total = values.reduce((total, value) => total + Number(value), 0)
		return (total / values.length).toString()
	}

	const mode = getMode()
	const median = getMedian()
	const mean = getMean()

	return (
		<div className='flex flex-col items-center justify-center w-full h-screen'>
			<div className='w-full flex justify-center scale-75 space-x-2'>
				{data.cards.map((card, i) => (
					<div className='w-56 h-80' key={card.id}>
						<Animation delay={i * 300}>
							<PokerCard isFlipped={true} value={card.value} name={card.name} />
						</Animation>
					</div>
				))}
			</div>
			<div className='flex items-center mt-6 space-x-2'>
				<div className={clsx('flex flex-col space-y-2', self.role === 'owner' ? 'items-end' : 'items-center')}>
					<Label type={estimate === mode ? 'primary' : undefined} onClick={() => setEstimate(mode)} className='cursor-pointer select-none'>
						Common estimate: {mode}
					</Label>
					<Label type={estimate === median ? 'primary' : undefined} onClick={() => setEstimate(median)} className='cursor-pointer select-none'>
						Middle of the deck: {median}
					</Label>
					<Label type={estimate === mean ? 'primary' : undefined} onClick={() => setEstimate(mean)} className='cursor-pointer select-none'>
						Average estimate: {mean}
					</Label>
				</div>
				{self.role === 'owner' ? (
					<div className='flex flex-col space-y-2 items-start'>
						<Input onChange={(e) => setEstimate(e.target.value)} value={estimate} placeholder='Estimate' className='w-full' htmlType='number' />
						<div className='flex space-x-2 items-center'>
							<Button type='primary' disabled={!estimate} onClick={saveEstimate}>
								Save Estimate
							</Button>
							<Button onClick={revote}>Re-vote</Button>
						</div>
					</div>
				) : null}
			</div>
		</div>
	)
}

export default PostGame
