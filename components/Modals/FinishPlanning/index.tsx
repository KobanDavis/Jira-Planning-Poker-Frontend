import Card from 'components/Card'
import Modal from 'components/Modal'
import { useGame } from 'providers/game'
import { useJira } from 'providers/jira'
import { FC, useState } from 'react'
import { Button, Loading } from 'components'

interface FinishPlanningProps {
	close(): void
}

const FinishPlanning: FC<FinishPlanningProps> = ({ close }) => {
	const { data } = useGame()
	const jira = useJira()
	const [state, setState] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(false)

	const newIssues = data.rounds.filter((round) => round.id.endsWith('-???'))
	const estimates = data.rounds.filter((round) => !round.id.endsWith('-???') && !Number.isNaN(Number(round.value)))

	console.log(newIssues, estimates)

	const finish = async () => {
		setLoading(true)
		console.log(estimates)
		// jira.getFieldTypes().then(console.log)
		await Promise.all(estimates.map((estimate) => jira.editIssueStoryPoints(estimate.id, Number(estimate.value))))
		setLoading(false)
		close()
	}

	return (
		<Modal close={close}>
			{() => (
				<Card className='h-min min-w-[20rem]' title='Finish Planning'>
					<div className='flex flex-col'>
						<div>
							{/* TODO */}
							{/* <span className='font-semibold'>{newIssues.length || 'No'}</span> new issue{newIssues.length === 1 ? '' : 's'} will be created. */}
							I haven't bothered to <span className='font-semibold'>create</span> issues yet so make them yourself please.
						</div>
						<div>
							<span className='font-semibold'>{estimates.length || 'No'}</span> issue
							{estimates.length === 1 ? '' : 's'} will be updated.
						</div>
						<Button disabled={estimates.length === 0} onClick={finish} className='mt-4 flex justify-center' type='primary'>
							{loading ? <Loading type='primary' size={4} /> : 'Save changes'}
						</Button>
					</div>
				</Card>
			)}
		</Modal>
	)
}

export default FinishPlanning
