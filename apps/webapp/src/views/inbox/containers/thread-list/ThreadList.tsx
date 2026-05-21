import { ChartColumn } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { ChannelIcon, MoodFlag, StageFlag, TopicFlag } from '../../components'
import { formatDate, formatShortTime, humanizeValue } from '../../format'
import type { InboxThread } from '../../types'

type ThreadListProps = {
  isLoading: boolean
  onSearchChange: (value: string) => void
  searchValue: string
  selectedThreadId?: string
  threads: Array<InboxThread>
}

const searchableSignalValues = (value?: string | null) => {
  return value ? [value, humanizeValue(value)] : []
}

export const ThreadList = ({
  isLoading,
  onSearchChange,
  searchValue,
  selectedThreadId,
  threads,
}: ThreadListProps) => {
  const normalizedSearch = searchValue.trim().toLowerCase()
  const filteredThreads = useMemo(() => {
    if (!normalizedSearch) {
      return threads
    }

    return threads.filter((thread) => {
      const searchableText = [
        thread.title,
        thread.listing?.name,
        thread.channel.name,
        ...searchableSignalValues(thread.mood),
        ...searchableSignalValues(thread.topic),
        ...searchableSignalValues(thread.booking?.stage),
        thread.lastMessage?.message,
        thread.lastMessage?.sender?.name,
        ...thread.messages.flatMap((message) => [
          message.message,
          message.sender?.name,
        ]),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableText.includes(normalizedSearch)
    })
  }, [normalizedSearch, threads])
  const threadCountLabel = isLoading
    ? 'Syncing conversations'
    : normalizedSearch
      ? `${filteredThreads.length} of ${threads.length} threads`
      : `${threads.length} threads`

  return (
    <div className="min-h-full">
      <div className="sticky top-0 z-10 border-b border-hw-border bg-hw-app px-4 py-3">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2 className="m-0 text-lg font-semibold text-hw-ink">Inbox</h2>
            <p className="m-0 text-xs text-hw-muted">
              {threadCountLabel}
            </p>
          </div>
          <Link
            aria-label="Open inbox stats"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-hw-control border border-hw-border bg-hw-surface text-hw-muted shadow-hw-panel transition-colors hover:border-hw-teal hover:text-hw-teal-dark"
            title="Inbox stats"
            to="/inbox"
          >
            <ChartColumn aria-hidden="true" size={18} strokeWidth={2.25} />
          </Link>
        </div>
        <input
          className="h-9 w-full rounded-hw-control border border-hw-border bg-hw-surface px-3 text-sm text-hw-ink outline-none placeholder:text-hw-faint focus:border-hw-teal"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search guests, listings, topics"
          type="search"
          value={searchValue}
        />
      </div>

      <div className="divide-y divide-hw-border">
        {filteredThreads.map((thread) => {
          const isSelected = selectedThreadId === thread.id
          const lastMessage = thread.lastMessage
          const isUnhandled = thread.isUnanswered
          const preview =
            lastMessage?.senderKind === 'operator'
              ? `${lastMessage.sender?.name ?? 'Operator'}: ${lastMessage.message}`
              : lastMessage?.message

          const titleClassName = isUnhandled
            ? 'font-bold text-hw-ink'
            : 'font-medium text-hw-ink'
          const metaClassName = isUnhandled
            ? 'font-bold text-hw-ink'
            : 'font-medium text-hw-muted'
          const previewClassName = isUnhandled
            ? 'font-bold text-hw-ink'
            : 'font-normal text-hw-muted'
          const timeClassName = isUnhandled
            ? 'font-bold text-hw-ink'
            : 'font-medium text-hw-faint'

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
                  <span className={`shrink-0 text-xs ${timeClassName}`}>
                    {lastMessage ? formatShortTime(lastMessage.sentAt) : formatDate(thread.updatedAt)}
                  </span>
                </span>

                <span className={`mt-0.5 block truncate text-xs ${metaClassName}`}>
                  {thread.listing?.name ?? 'Listing not attached'}
                </span>

                <span className={`mt-1 block truncate text-xs ${previewClassName}`}>
                  {preview ?? 'No messages yet'}
                </span>

                <span className="mt-2 flex min-w-0 flex-wrap gap-1.5">
                  <MoodFlag value={thread.mood} variant="compact" />
                  <StageFlag value={thread.booking?.stage} variant="compact" />
                  <TopicFlag value={thread.topic} variant="compact" />
                </span>
              </span>
            </Link>
          )
        })}
        {filteredThreads.length === 0 ? (
          <p className="m-0 px-4 py-8 text-sm font-medium text-hw-muted">
            No threads match this search.
          </p>
        ) : null}
      </div>
    </div>
  )
}
