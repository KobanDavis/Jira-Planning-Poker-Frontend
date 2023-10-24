import { FC } from 'react'
import { Card, Label, Modal } from '@kobandavis/ui'

import ThemeButtons from 'components/ThemeButtons'

interface SettingsProps {
	close(): void
}

const Settings: FC<SettingsProps> = ({ close }) => {
	return (
		<Modal close={close}>
			{() => (
				<Card className='h-min min-w-[20rem]' title='Settings'>
					<div className='space-y-4'>
						<div className='flex flex-col space-y-2'>
							<Label type='secondary'>Theme</Label>
							<ThemeButtons />
						</div>
					</div>
				</Card>
			)}
		</Modal>
	)
}

export default Settings
