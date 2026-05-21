import { Link } from '@tanstack/react-router'
import { ChannelIcon, SignalBadge } from '../../components'
import { formatDate, formatShortTime } from '../../format'
import type { InboxThread } from '../../types'

type ThreadListProps = {
  isLoading: boolean
  selectedThreadId?: string
  threads: Array<InboxThread>
}

export const ThreadList = ({
  isLoading,
  selectedThreadId,
  threads,
}: ThreadListProps) => {
  return (
    <div className="min-h-full">
      <div className="sticky top-0 z-10 border-b border-hw-border bg-hw-app px-4 py-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="m-0 text-lg font-semibold text-hw-ink">Inbox</h2>
            <p className="m-0 text-xs text-hw-muted">
              {isLoading ? 'Syncing conversations' : `${threads.length} threads`}
            </p>
          </div>
          <button
            className="h-8 rounded-hw-control bg-hw-teal px-3 text-xs font-semibold text-white shadow-hw-panel"
            type="button"
          >
            Reply queue
          </button>
        </div>
        <input
          className="h-9 w-full rounded-hw-control border border-hw-border bg-hw-surface px-3 text-sm text-hw-ink outline-none placeholder:text-hw-faint focus:border-hw-teal"
          placeholder="Search guests, listings, topics"
          type="search"
        />
      </div>

      <div className="divide-y divide-hw-border">
        {threads.map((thread) => {
          const isSelected = selectedThreadId === thread.id
          const titleClassName = thread.isUnanswered
            ? 'font-bold text-hw-ink'
            : 'font-semibold text-hw-ink'
          const lastMessage = thread.lastMessage

          return (
            <Link
              key={thread.id}
              className={`flex min-h-24 gap-3 px-4 py-3 transition-colors hover:bg-hw-surface ${
                isSelected ? 'bg-hw-surface' : 'bg-hw-app'
              }`}
              params={{ threadId: thread.id }}
              to="/inbox/$threadId"
            >
              <ChannelIcon channel={thread.channel} />
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-3">
                  <span className={`truncate text-sm ${titleClassName}`}>
                    {thread.title}
                  </span>
                  <span className="shrink-0 text-xs text-hw-faint">
                    {lastMessage ? formatShortTime(lastMessage.sentAt) : formatDate(thread.updatedAt)}
                  </span>
                </span>

                <span className="mt-0.5 block truncate text-xs font-medium text-hw-muted">
                  {thread.listing?.name ?? 'Listing not attached'}
                </span>

                <span
                  className={`mt-1 block truncate text-xs ${
                    thread.isUnanswered ? 'font-semibold text-hw-ink' : 'text-hw-muted'
                  }`}
                >
                  {lastMessage?.message ?? 'No messages yet'}
                </span>

                <span className="mt-2 flex min-w-0 flex-wrap gap-1.5">
                  <SignalBadge kind="mood" value={thread.mood} />
                  <SignalBadge kind="stage" value={thread.booking?.stage} />
                  <SignalBadge kind="topic" value={thread.topic} />
                </span>
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
