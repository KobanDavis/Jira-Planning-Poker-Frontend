import { Game } from 'types/backend'
import clsx from 'clsx'
import { Button, Card, IssueModal, Label } from 'components'
import { useGame } from 'providers/game'
import { FC, useState } from 'react'

interface SectionProps {
	title: string
	rounds: Game.Round[]
	selectedRoundId: string
	setSelectedRoundId: (id: string) => void
}

const Section: FC<SectionProps> = ({ rounds, title, selectedRoundId, setSelectedRoundId }) => {
	return rounds.length ? (
		<>
			<Label type='secondary'>{title}</Label>
			<div className='flex flex-col bg-theme-secondary rounded p-1 pr-0 overflow-y-scroll max-h-[10rem] pb-0'>
				{rounds?.map((round) => (
					<div
						onClick={() => setSelectedRoundId(round.id === selectedRoundId ? null : round.id)}
						className={clsx(
							'select-none justify-between flex items-center text-xs py-0.5 px-1 mb-1 cursor-pointer rounded-sm',
							round.id === selectedRoundId ? 'bg-theme-primary/15' : 'bg-theme-primary/5 hover:bg-theme-primary/10'
						)}
						key={round.id}
					>
						<div className='flex items-center truncate'>
							<span className='mr-1'>[{round.id}]</span>
							<span className='truncate'>{round.title}</span>
						</div>
						<div className='flex items-center justify-center text-xs self-baseline px-[5px] h-4 m-1 ml-2 rounded bg-theme-primary text-theme-secondary shrink-0'>
							{round.value ?? '?'}
						</div>
					</div>
				))}
			</div>
		</>
	) : null
}

const PreGame: FC = () => {
	const { data, socket, self } = useGame()
	const [modalVisibility, setModalVisibility] = useState<boolean>(false)
	const [selectedRoundId, setSelectedRoundId] = useState<string>(null)

	const sections = data.rounds.reduce<Partial<Record<Game.Resolution, Game.Round[]>>>((sections, round) => {
		if (!(round.resolution in sections)) {
			sections[round.resolution] = []
		}
		sections[round.resolution].push(round)
		return sections
	}, {})

	const selectedRound = data.rounds.find((round) => round.id === selectedRoundId)

	const updateResolution = (round: Game.Round, resolution: Game.Resolution) => {
		round.resolution = resolution
		socket.emit('ingame/round', round)
	}

	const vote = (roundId: string) => {
		socket.emit('ingame/currentRound', roundId)
		socket.emit('ingame/state', Game.State.INGAME)
	}

	return (
		<div className='flex flex-col space-y-2 items-center justify-center h-screen'>
			<Card title={data.name}>
				<div className='space-y-2'>
					{Object.entries(sections).map(([resolution, rounds]) => (
						<Section
							setSelectedRoundId={setSelectedRoundId}
							selectedRoundId={selectedRoundId}
							rounds={rounds}
							title={Game.Resolution[resolution]}
							key={resolution}
						/>
					))}
				</div>
			</Card>
			<div className='space-x-2'>
				<Button disabled={selectedRoundId === null} onClick={() => setModalVisibility(true)}>
					Preview
				</Button>
				{self.role === 'owner' ? (
					<>
						<Button
							className='text-red-600'
							disabled={selectedRoundId === null || selectedRound.resolution === Game.Resolution.REJECTED}
							onClick={() => updateResolution(selectedRound, Game.Resolution.REJECTED)}
						>
							Reject
						</Button>
						<Button
							disabled={selectedRoundId === null || selectedRound.resolution === Game.Resolution.ACCEPTED}
							onClick={() => updateResolution(selectedRound, Game.Resolution.ACCEPTED)}
						>
							Accept
						</Button>
						<Button
							type='primary'
							disabled={selectedRoundId === null || selectedRound.resolution !== Game.Resolution.ACCEPTED}
							onClick={() => vote(selectedRoundId)}
						>
							Vote
						</Button>
					</>
				) : null}
			</div>
			{modalVisibility ? <IssueModal close={() => setModalVisibility(false)} issueId={selectedRoundId} /> : null}
		</div>
	)
}

export default PreGame
