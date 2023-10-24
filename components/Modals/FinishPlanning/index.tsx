import { FC, useState } from 'react'
import { Button, Loading, Card, Modal } from '@kobandavis/ui'
import { useGame } from 'providers/game'
import { useJira } from 'providers/jira'

interface FinishPlanningProps {
	close(): void
}

const FinishPlanning: FC<FinishPlanningProps> = ({ close }) => {
	const { data } = useGame()
	const jira = useJira()
	const [loading, setLoading] = useState<boolean>(false)

	const estimates = data.rounds.filter((round) => !Number.isNaN(Number(round.value)))
	const totalEffort = estimates.reduce((prev, curr) => {
		if (!Number(curr.value)) {
			return prev
		}
		return prev + Number(curr.value)
	}, 0)

	const finish = async () => {
		setLoading(true)
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
							<span className='font-semibold'>{estimates.length || 'No'}</span> issue
							{estimates.length === 1 ? '' : 's'} will be updated and the total effort value will be{' '}
							<span className='font-semibold'>{totalEffort ?? 0}</span>.
						</div>
						<Button disabled={estimates.length === 0} onClick={finish} className='mt-4 flex justify-center' type='primary'>
							{loading ? <Loading type='primary' size={4} /> : 'Update story points'}
						</Button>
					</div>
				</Card>
			)}
		</Modal>
	)
}

export default FinishPlanning
