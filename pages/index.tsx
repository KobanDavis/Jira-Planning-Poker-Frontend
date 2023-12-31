import { FC, useEffect, useState } from 'react'
import { Button, Card, Dropdown, Loading } from '@kobandavis/ui'
import { Issue, Modals } from 'components'
import { JiraAPI } from 'lib/jira'
import { useGame } from 'providers/game'
import { useRouter } from 'next/router'
import { getQS, setQS } from 'lib/qs'
import { useJira } from 'providers/jiraAuth'

type Keys = 'board' | 'sprint'

const App: FC = () => {
	const { jira } = useJira()
	const { socket, self } = useGame()
	const router = useRouter()

	const { board, sprint } = getQS<Keys>()
	const [boards, setBoards] = useState<JiraAPI.Board[]>(null)
	const [selectedBoardId, setSelectedBoardId] = useState<string>(board)

	const [sprints, setSprints] = useState<JiraAPI.Sprint[]>([])
	const [selectedSprintId, setSelectedSprintId] = useState<string>(sprint)

	const [issues, setIssues] = useState<JiraAPI.Issue[]>([])
	const [selectedIssueId, setSelectedIssueId] = useState<string>(null)

	const selectedSprint = sprints?.find((sprint) => sprint.id.toString() === selectedSprintId)

	useEffect(() => {
		const init = async () => {
			jira.getBoards().then(setBoards)

			if (!selectedBoardId) return
			jira.getSprints(selectedBoardId).then(setSprints)

			if (!selectedSprintId) return
			jira.getIssues(selectedSprintId).then(setIssues)
		}

		init()
	}, [])

	useEffect(() => {
		setQS({
			...(selectedBoardId ? { board: selectedBoardId } : {}),
			...(selectedSprintId ? { sprint: selectedSprintId } : {})
		})
	}, [selectedBoardId, selectedSprintId])

	const onBoardChange = async (id: string) => {
		setSprints(null)
		setSelectedSprintId(null)
		setIssues(null)
		setSelectedIssueId(null)
		setSelectedBoardId(id)

		jira.getSprints(id).then(setSprints)
	}

	const onSprintChange = async (id: string) => {
		setIssues(null)
		setSelectedIssueId(null)
		setSelectedSprintId(id)

		jira.getIssues(id).then(setIssues)
	}

	const createGame = () => {
		socket.emit('room/create', { roomName: selectedSprint.name, playerId: self.id, sprintId: Number(selectedSprintId) }, (roomId) => {
			router.push(`/game/${roomId}`)
		})
	}

	return (
		<div className='bg-theme-secondary text-theme-primary'>
			<div className='p-4 flex flex-col items-center w-screen min-h-screen space-y-4'>
				<div className='flex items-center justify-between font-semibold text-3xl my-4'>
					<span>Planning poker 🃏</span>
				</div>
				<Card title='Find planning sprint' className='min-w-[30rem] max-w-[80rem]'>
					<div className='flex flex-col space-y-2'>
						<div className='flex space-x-2'>
							<Dropdown
								loading={boards === null}
								placeholder='Select Board'
								onChange={onBoardChange}
								selectedItemId={selectedBoardId}
								items={boards?.map((board) => ({ label: board.name, id: board.id.toString(), icon: board.location.avatarURI }))}
							/>
							<Dropdown
								disabled={selectedBoardId === null}
								loading={sprints === null}
								placeholder='Select Sprint'
								onChange={onSprintChange}
								selectedItemId={selectedSprintId}
								items={sprints?.map((sprint) => ({ label: sprint.name, id: sprint.id.toString() }))}
							/>
						</div>
						<div className='flex items-center justify-between'>
							<div>
								<span>Issues</span>
								{issues ? <span className='ml-1'>({issues.length})</span> : null}
							</div>
							<div>
								{selectedSprint ? (
									<>
										<span className='mr-1 text-theme-primary'>State:</span>
										{selectedSprint.state === 'active' ? (
											<span className='text-green-400'>Active</span>
										) : (
											<span className='text-sky-400'>Future</span>
										)}
									</>
								) : null}
							</div>
						</div>
						<div className='bg-theme-secondary rounded-sm shadow-inner h-[20rem]'>
							<div className='flex flex-col bg-theme-secondary shadow-inner rounded p-2 pr-0 overflow-y-scroll h-80 pb-0'>
								{issues?.length > 0 ? (
									issues.map((issue) => <Issue key={issue.id} onClick={() => setSelectedIssueId(issue.id)} issue={issue} />)
								) : selectedSprint ? (
									<div className='flex items-center justify-center h-full'>
										<Loading size={8} />
									</div>
								) : (
									<div className='flex items-center justify-center h-full'>
										Select a {selectedBoardId === null ? 'board' : 'sprint'} above
									</div>
								)}
							</div>
						</div>
					</div>
				</Card>
				{issues?.length ? (
					<Button onClick={createGame} type='primary' className='w-max mt-2'>
						Estimate {issues.length} Issues
					</Button>
				) : null}
			</div>
			{selectedIssueId ? <Modals.Issue close={() => setSelectedIssueId(null)} issueId={selectedIssueId} /> : null}
		</div>
	)
}

export default App
