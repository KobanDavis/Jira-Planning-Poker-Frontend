import { JiraAPI } from 'lib/jira'
import { FC } from 'react'

interface IssueProps extends React.HTMLAttributes<HTMLDivElement> {
	issue: JiraAPI.Issue
}

const Issue: FC<IssueProps> = ({ issue, ...rest }) => {
	return (
		<div className='flex items-center justify-between bg-theme-primary/5 text-xs p-1 mb-2 group cursor-pointer' {...rest}>
			<div className='flex items-center truncate'>
				<img className='mx-1 w-4 h-4' src={issue.fields.issuetype.iconUrl} />
				<span className='group-hover:text-theme mr-1'>[{issue.key}]</span>
				<span>{issue.fields.summary}</span>
			</div>
			<div className='flex items-center justify-center text-xs self-baseline px-[5px] h-4 m-1 ml-2 rounded bg-theme-primary text-theme-secondary shrink-0'>
				{issue.fields.customfield_10020 ?? '?'}
			</div>
		</div>
	)
}

export default Issue
