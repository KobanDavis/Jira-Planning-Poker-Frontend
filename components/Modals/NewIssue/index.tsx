import clsx from 'clsx'
import { Button, Card, Dropdown, Label, Modal } from 'components'
import { JiraAPI } from 'lib/jira'
import { backgroundSecondaryHover, borderHover } from 'lib/styles'
import { useGame } from 'providers/game'
import { useJira } from 'providers/jira'
import { FC, useEffect, useState } from 'react'
import { Game } from 'types/backend'

interface NewIssueProps {
	close(): void
}

const NewIssue: FC<NewIssueProps> = ({ close }) => {
	const jira = useJira()
	const { socket } = useGame()

	const [meta, setMeta] = useState<JiraAPI.CreateMeta[]>(null)
	console.log(meta)
	const [projectId, setProjectId] = useState<string>(null)
	const [issueTypeId, setIssueTypeId] = useState<string>(null)
	const [summary, setSummary] = useState<string>(null)

	useEffect(() => {
		jira.getCreateMeta().then(setMeta)
	}, [])

	const selectedProject = meta?.find((project) => project.id === projectId)

	const createIssue = () => {
		const projectKey = selectedProject.key
		socket.emit('ingame/round', { id: projectKey + '-???', resolution: Game.Resolution.TODO, title: summary, value: null })
		close()
	}

	return (
		<Modal close={close}>
			{() => (
				<Card className='h-min min-w-[20rem]' title='Create new issue'>
					<div className='space-y-4'>
						<div className='flex flex-col space-y-2'>
							<Label type='secondary'>Project</Label>
							<Dropdown
								onChange={(id) => {
									setIssueTypeId(null)
									setProjectId(id)
								}}
								selectedItemId={projectId}
								placeholder='Select project'
								loading={meta === null}
								items={meta?.map((project) => ({ id: project.id, label: project.name, icon: Object.values(project.avatarUrls)[0] }))}
							/>
						</div>
						<div className='flex flex-col space-y-2'>
							<Label type='secondary'>Type</Label>
							<Dropdown
								onChange={(id) => setIssueTypeId(id)}
								selectedItemId={issueTypeId}
								placeholder='Select issue type'
								disabled={selectedProject === null}
								items={selectedProject?.issuetypes.map((type) => ({ id: type.id, label: type.name, icon: type.iconUrl }))}
							/>
						</div>
						<div className='flex flex-col space-y-2'>
							<div className='flex space-x-2'>
								<Label type='secondary'>Summary</Label>
							</div>
							<div className={clsx('flex items-center px-2 py-1 space-x-2 rounded-sm', borderHover, backgroundSecondaryHover)}>
								{selectedProject ? <Label type='primary'>{selectedProject.key}-???</Label> : null}
								<input className='bg-white/0 outline-none w-full text-sm font-semibold' onChange={(e) => setSummary(e.target.value)} />
							</div>
						</div>
						<Button className='w-full' disabled={!projectId || !issueTypeId || !summary} onClick={createIssue} type='primary'>
							Create issue
						</Button>
					</div>
				</Card>
			)}
		</Modal>
	)
}

export default NewIssue