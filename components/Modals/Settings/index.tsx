import React, { FC } from 'react'
import { Card, Input, Label, Modal } from '@kobandavis/ui'
import { ThemeButtons } from 'components'
import { useLocalState } from 'hooks'

interface SettingsProps {
	close(): void
}

const Settings: FC<SettingsProps> = ({ close }) => {
	const [baseFontSize, setBaseFontSize] = useLocalState('baseFontSize', '16')
	const [name, setName] = useLocalState('name')

	const handleBaseFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target
		document.documentElement.style.setProperty('font-size', value + 'px')
		setBaseFontSize(value)
	}

	return (
		<Modal close={close}>
			{() => (
				<Card className='h-min min-w-[20rem]' title='Settings'>
					<div className='space-y-4'>
						<div className='flex flex-col space-y-2'>
							<Label type='secondary'>Theme</Label>
							<ThemeButtons />
						</div>
						<div className='flex flex-col space-y-2'>
							<Label type='secondary'>Base font size</Label>
							<Input value={baseFontSize} htmlType='number' onChange={handleBaseFontSizeChange} />
						</div>
						<div className='flex flex-col space-y-2'>
							<div className='flex items-center'>
								<Label type='secondary'>Name</Label>
								<span className='ml-1 text-theme-primary/30 text-sm'>(change will take effect in new games)</span>
							</div>
							<Input value={name} onChange={(e) => setName(e.target.value)} />
						</div>
					</div>
				</Card>
			)}
		</Modal>
	)
}

export default Settings
