import React, { FC } from 'react'
import { Button } from '@kobandavis/ui'

interface VoteButtonsProps {
	submit(value): void
}

const VoteButtons: FC<VoteButtonsProps> = ({ submit }) => {
	const fibonacciSequence = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, '?']
	return (
		<div className='flex mt-2 space-x-2'>
			{fibonacciSequence.map((value) => (
				<Button key={value} onClick={() => submit(value)}>
					{value}
				</Button>
			))}
		</div>
	)
}

export default VoteButtons
