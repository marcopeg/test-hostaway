import { useState } from 'react'
import { ChannelIcon, SignalBadge } from '.'
import {
  formatFullDateTime,
  formatShortTime,
  humanizeValue,
} from '../format'
import type { InboxMessage, InboxThread } from '../types'

type MessageListProps = {
  isSending: boolean
  onSendReply: (message: string) => void
  thread: InboxThread
}

const MessageBubble = ({ message }: { message: InboxMessage }) => {
  const isOperator = message.senderKind === 'operator'

  return (
    <article
      className={`flex gap-3 ${isOperator ? 'justify-end pl-14' : 'justify-start pr-14'}`}
    >
      {!isOperator ? (
        <img
          alt=""
          className="mt-1 h-8 w-8 rounded-full bg-hw-surface-muted object-cover ring-1 ring-hw-border"
          src={message.sender?.icon}
        />
      ) : null}

      <div
        className={`max-w-2xl rounded-hw-panel border px-4 py-3 shadow-hw-panel ${
          isOperator
            ? 'border-hw-teal/25 bg-hw-teal-soft'
            : 'border-hw-border bg-hw-surface'
        }`}
      >
        <div className="mb-1 flex items-center justify-between gap-3">
          <p className="m-0 text-xs font-semibold text-hw-ink">
            {message.sender?.name ?? (isOperator ? 'Operator' : 'Guest')}
          </p>
          <time
            className="text-xs font-medium text-hw-faint"
            dateTime={message.sentAt}
            title={formatFullDateTime(message.sentAt)}
          >
            {formatShortTime(message.sentAt)}
          </time>
        </div>
        <p className="m-0 whitespace-pre-wrap text-sm text-hw-ink">
          {message.message}
        </p>
        {message.isPending ? (
          <p className="m-0 mt-2 text-xs font-semibold text-hw-teal-dark">
            Pending send
          </p>
        ) : null}
      </div>

      {isOperator ? (
        <img
          alt=""
          className="mt-1 h-8 w-8 rounded-full bg-hw-teal object-cover ring-1 ring-hw-border"
          src={message.sender?.icon}
        />
      ) : null}
    </article>
  )
}

export const MessageList = ({
  isSending,
  onSendReply,
  thread,
}: MessageListProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [message, setMessage] = useState('')
  const canSend = message.trim().length > 0 && !isSending

  const handleSubmit = () => {
    if (!canSend) {
      return
    }

    onSendReply(message.trim())
    setMessage('')
    setIsExpanded(false)
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 border-b border-hw-border bg-hw-surface px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <ChannelIcon channel={thread.channel} />
          <div className="min-w-0 flex-1">
            <h2 className="m-0 truncate text-xl font-semibold text-hw-ink">
              {thread.title}
            </h2>
            <p className="m-0 truncate text-xs font-medium text-hw-muted">
              {thread.listing?.name ?? 'Listing not attached'} /{' '}
              {thread.channel.name}
            </p>
          </div>
          <div className="hidden flex-wrap justify-end gap-1.5 md:flex">
            <SignalBadge kind="mood" value={thread.mood} />
            <SignalBadge kind="topic" value={thread.topic} />
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-4 px-5 py-5">
        {thread.messages.map((item) => (
          <MessageBubble key={`${item.isPending ? 'pending' : 'sent'}-${item.id}`} message={item} />
        ))}
      </div>

      <div className="sticky bottom-0 border-t border-hw-border bg-hw-surface/95 px-5 py-3 backdrop-blur">
        {isExpanded ? (
          <div className="rounded-hw-panel border border-hw-border bg-hw-surface-muted p-3">
            <textarea
              className="min-h-24 w-full resize-none rounded-hw-control border border-hw-border bg-hw-surface px-3 py-2 text-sm text-hw-ink outline-none placeholder:text-hw-faint focus:border-hw-teal"
              onChange={(event) => setMessage(event.target.value)}
              placeholder={`Reply about ${humanizeValue(thread.topic)}`}
              value={message}
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="m-0 text-xs text-hw-muted">
                Saved to pending messages before delivery.
              </p>
              <div className="flex gap-2">
                <button
                  className="h-9 rounded-hw-control border border-hw-border bg-hw-surface px-3 text-xs font-semibold text-hw-muted"
                  onClick={() => setIsExpanded(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="h-9 rounded-hw-control bg-hw-teal px-4 text-xs font-semibold text-white disabled:opacity-50"
                  disabled={!canSend}
                  onClick={handleSubmit}
                  type="button"
                >
                  {isSending ? 'Sending' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            className="flex h-11 w-full items-center justify-between rounded-hw-control border border-hw-border bg-hw-surface-muted px-4 text-left text-sm font-semibold text-hw-ink hover:border-hw-teal"
            onClick={() => setIsExpanded(true)}
            type="button"
          >
            <span>Reply</span>
            <span className="text-xs font-medium text-hw-muted">
              Add pending operator response
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
