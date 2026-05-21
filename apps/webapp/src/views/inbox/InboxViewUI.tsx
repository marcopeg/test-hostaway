import { SplitLayout } from 'components'
import { DetailsPanel, MessageList } from './components'
import { Stats } from './containers/stats'
import { ThreadList } from './containers/thread-list'
import type { InboxStats, InboxThread } from './types'

type InboxViewUIProps = {
  errorMessage?: string
  isLoading: boolean
  isSending: boolean
  onSendReply: (message: string) => void
  selectedThread?: InboxThread
  selectedThreadId?: string
  stats: InboxStats
  threads: Array<InboxThread>
}

export const InboxViewUI = ({
  errorMessage,
  isLoading,
  isSending,
  onSendReply,
  selectedThread,
  selectedThreadId,
  stats,
  threads,
}: InboxViewUIProps) => {
  return (
    <SplitLayout
      center={
        selectedThread ? (
          <MessageList
            isSending={isSending}
            onSendReply={onSendReply}
            thread={selectedThread}
          />
        ) : (
          <Stats
            errorMessage={errorMessage}
            isLoading={isLoading}
            stats={stats}
          />
        )
      }
      left={
        <ThreadList
          isLoading={isLoading}
          selectedThreadId={selectedThreadId}
          threads={threads}
        />
      }
      right={selectedThread ? <DetailsPanel thread={selectedThread} /> : undefined}
    />
  )
}
