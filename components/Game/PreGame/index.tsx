import { Game } from 'types/backend'
import clsx from 'clsx'
import { Button, Card, Label, Modals } from 'components'
import { useGame } from 'providers/game'
import { FC, useState } from 'react'
import { borderBase } from 'lib/styles'
import { PlusIcon } from '@heroicons/react/24/solid'

interface SectionProps {
	title: string
	rounds: Game.Round[]
	selectedRoundId: string
	setSelectedRoundId(id: string): void
	openPreview(): void
}

const Section: FC<SectionProps> = ({ rounds, title, selectedRoundId, setSelectedRoundId, openPreview }) => {
	const handlePreview = (id: string) => {
		setSelectedRoundId(id)
		openPreview()
	}

	return rounds.length ? (
		<>
			<Label type='secondary'>{title}</Label>
			<div className='flex flex-col bg-theme-secondary rounded p-1 pr-0 overflow-y-scroll max-h-[10rem] pb-0'>
				{rounds?.map((round) => (
					<div
						onClick={() => setSelectedRoundId(round.id === selectedRoundId ? null : round.id)}
						className={clsx(
							'select-none justify-between flex items-center text-xs py-px px-1 mb-1 rounded-sm',
							round.id === selectedRoundId ? 'bg-theme-primary/15' : 'bg-theme-primary/5 hover:bg-theme-primary/10'
						)}
						key={round.id}
					>
						<div className='flex items-center truncate'>
							<Label
								type={!round.id.endsWith('???') ? 'primary' : 'secondary'}
								className={clsx('mr-1.5', !round.id.endsWith('???') && 'cursor-pointer')}
								onClick={(e) => {
									e.stopPropagation()
									if (!round.id.endsWith('???')) {
										handlePreview(round.id)
									}
								}}
							>
								{round.id}
							</Label>
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

	const [issueModalVisibility, setIssueModalVisibility] = useState<boolean>(false)
	const [roundModalVisibility, setRoundModalVisibility] = useState<boolean>(false)
	const [finishModalVisibility, setFinishModalVisibility] = useState<boolean>(false)

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

	const handleNewIssue = ({}) => {}

	const vote = (roundId: string) => {
		socket.emit('ingame/currentRound', roundId)
		socket.emit('ingame/state', Game.State.INGAME)
	}

	const openPreview = () => setIssueModalVisibility(true)
	const isNewIssue = selectedRoundId?.endsWith('???')
	return (
		<div className='flex flex-col space-y-2 items-center justify-center h-screen'>
			<Card
				title={
					<div className={clsx(borderBase, 'border-0 border-b', 'flex justify-between items-center py-2 px-4 font-semibold text-lg')}>
						<span>{data.name}</span>
						<PlusIcon onClick={() => setRoundModalVisibility(true)} className='h-6 w-6 cursor-pointer' />
					</div>
				}
			>
				<div className='space-y-2'>
					{Object.entries(sections).map(([resolution, rounds]) => (
						<Section
							openPreview={openPreview}
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
				<Button disabled={selectedRoundId === null || isNewIssue} onClick={openPreview}>
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
			{issueModalVisibility ? <Modals.Issue close={() => setIssueModalVisibility(false)} issueId={selectedRoundId} /> : null}
			{roundModalVisibility ? <Modals.NewIssue close={() => setRoundModalVisibility(false)} /> : null}

			<Button onClick={() => setFinishModalVisibility(true)} type='primary' className='fixed bottom-4 right-4'>
				Finish Planning
			</Button>
			{finishModalVisibility ? <Modals.FinishPlanning close={() => setFinishModalVisibility(false)} /> : null}
		</div>
	)
}

export default PreGame
