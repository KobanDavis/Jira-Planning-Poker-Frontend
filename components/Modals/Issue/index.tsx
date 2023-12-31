import React, { FC, useEffect, useState } from 'react'
import clsx from 'clsx'
import formatLinks from 'lib/formatLinks'
import Head from 'next/head'
import { Card, Modal } from '@kobandavis/ui'
import { Comment } from 'components'
import { JiraAPI } from 'lib/jira'
import { useJira } from 'providers/jiraAuth'
import { ArrowTopRightOnSquareIcon, XMarkIcon } from '@heroicons/react/24/outline'

import styles from 'styles/jira.module.css'

interface IssueProps {
	issueId: string
	close(): void
}

const Issue: FC<IssueProps> = ({ issueId, close }) => {
	const { jira, auth } = useJira()
	const [issue, setIssue] = useState<JiraAPI.Issue>(null)

	useEffect(() => {
		setIssue(null)
		if (issueId) {
			jira.getIssue(issueId).then(setIssue)
		}
	}, [issueId])

	const onIssueClick = () => {
		const url = jira.getIssueUrl(issue.key)
		window.open(url, '_blank')
	}

	return (
		<Modal close={close} loading={!issue}>
			{() => (
				<>
					<Head>
						<title>
							[{issue.key}] {issue.fields.summary}
						</title>
						<link rel='icon' type='image/x-icon' href={issue.fields.issuetype.iconUrl} />
					</Head>
					<Card
						className='h-min min-w-[30rem] max-w-[80rem]'
						title={
							<div className={clsx('flex flex-col text-lg w-full p-4 border-b border-theme-primary/15')}>
								<div className='flex justify-between'>
									<div>
										<div className='flex'>
											<img className='mr-1 h-5 m-1 inline' src={issue.fields?.issuetype.iconUrl} />
											<div className='flex items-center cursor-pointer' onClick={onIssueClick}>
												<span className='font-bold'>[{issue.key}]</span>
												<ArrowTopRightOnSquareIcon className='h-5 w-5 m-1' />
											</div>
										</div>
									</div>
									<div className='flex items-center justify-center'>
										<div className='text-center text-sm px-[5px] w-min h-5 min-w-[20px] m-1 rounded bg-theme-primary text-theme-secondary'>
											{issue.fields.customfield_10020 ?? '?'}
										</div>
										<XMarkIcon className='w-5 h-5 m-1 cursor-pointer' onClick={close} />
									</div>
								</div>
								<div className='mx-1'>{issue.fields?.summary}</div>
							</div>
						}
					>
						{issue.fields.description || issue.fields.customfield_10057 ? (
							<div className='flex w-full space-x-2'>
								{issue.fields.description ? (
									<div className='flex flex-col my-2 flex-1'>
										<span className='font-bold mb-1'>Description</span>
										<div
											className={clsx(styles.issue, 'resize text-sm bg-theme-secondary rounded p-2 min-h-[15rem]')}
											dangerouslySetInnerHTML={{
												__html: formatLinks(issue.renderedFields.description, auth.resourceURL)
											}}
										/>
									</div>
								) : null}
								{issue.fields.customfield_10057 !== null ? (
									<div className='flex flex-col my-2 flex-1'>
										<span className='font-bold mb-1'>Acceptance Criteria</span>
										<div
											className={clsx(styles.issue, 'text-sm bg-theme-secondary rounded p-2 min-h-[15rem]')}
											dangerouslySetInnerHTML={{
												__html: formatLinks(issue.renderedFields.customfield_10057, auth.resourceURL)
											}}
										/>
									</div>
								) : null}
							</div>
						) : null}
						{issue.renderedFields.comment?.comments.length ? (
							<div className='flex flex-col my-2'>
								<span className='font-bold mb-1'>Comments</span>
								<div className='flex flex-col bg-theme-secondary shadow-inner rounded p-2 pr-0 overflow-y-scroll pb-0 max-h-80'>
									{issue.renderedFields.comment.comments
										.map((comment, i) => (
											<Comment key={comment.id} comment={comment} timestamp={issue.fields.comment.comments[i].created} />
										))
										.reverse()}
								</div>
							</div>
						) : null}
					</Card>
				</>
			)}
		</Modal>
	)
}

export default Issue
