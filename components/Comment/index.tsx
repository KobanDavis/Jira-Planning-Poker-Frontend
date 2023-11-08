import formatLinks from 'lib/formatLinks'
import { JiraAPI } from 'lib/jira'
import moment from 'moment'
import { useJira } from 'providers/jiraAuth'
import { FC } from 'react'

interface CommentProps {
	timestamp: string
	comment: JiraAPI.Issue['fields']['comment']['comments'][number]
}

const Comment: FC<CommentProps> = ({ comment, timestamp }) => {
	const { auth } = useJira()
	return (
		<div className='flex bg-theme-primary/5 text-sm p-2 mb-2'>
			<img className='mr-2 h-8 w-8 rounded-full' src={comment.author.avatarUrls['48x48']} />
			<div className='flex flex-col w-full'>
				<div className='items-center justify-between'>
					<span className='font-semibold mr-2'>{comment.author.displayName}</span>
					<span className='text-theme-primary/30 text-xs mr-2'>{moment(timestamp).format('MMMM Do, YYYY [at] h:mm A')}</span>
				</div>
				<div className='py-1 pr-2' dangerouslySetInnerHTML={{ __html: formatLinks(comment.body, auth.resourceURL) }} />
			</div>
		</div>
	)
}

export default Comment
