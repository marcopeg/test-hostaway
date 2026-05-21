import { gql } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react'
import { useMemo } from 'react'
import { humanizeValue } from './format'
import { InboxViewUI } from './InboxViewUI'
import type {
  CountMetric,
  InboxBooking,
  InboxMessage,
  InboxStats,
  InboxThread,
} from './types'

type InboxViewProps = {
  threadId?: string
}

const GET_INBOX = gql`
  query GetInbox {
    data_messages_aggregate {
      aggregate {
        count
      }
    }
    data_messages_pending_aggregate {
      aggregate {
        count
      }
    }
    data_threads_aggregate {
      aggregate {
        count
      }
    }
    data_threads(order_by: { updated_at: desc }) {
      booking {
        channel {
          icon
          id
          name
        }
        end_date
        id
        stage
        start_date
      }
      channel {
        icon
        id
        name
      }
      id
      listing {
        id
        name
      }
      messages(order_by: { sent_at: asc }) {
        guest {
          icon
          id
          name
        }
        guest_id
        id
        message
        operator {
          icon
          id
          name
        }
        operator_id
        sent_at
      }
      mood_value
      pending_messages(order_by: { sent_at: asc }) {
        id
        message
        operator {
          icon
          id
          name
        }
        operator_id
        sent_at
      }
      title
      topic_value
      updated_at
    }
  }
`

const SEND_PENDING_MESSAGE = gql`
  mutation SendPendingMessage(
    $message: String!
    $sentAt: timestamptz!
    $threadId: uuid!
  ) {
    insert_data_messages_pending_one(
      object: { message: $message, sent_at: $sentAt, thread_id: $threadId }
    ) {
      id
    }
  }
`

type GraphQLPerson = {
  icon: string
  id: string
  name: string
}

type GraphQLChannel = {
  icon: string
  id: string
  name: string
}

type GraphQLThread = {
  booking: {
    channel: GraphQLChannel
    end_date: string
    id: string
    stage: string
    start_date: string
  } | null
  channel: GraphQLChannel
  id: string
  listing: {
    id: string
    name: string
  } | null
  messages: Array<{
    guest: GraphQLPerson | null
    guest_id: string | null
    id: string
    message: string
    operator: GraphQLPerson | null
    operator_id: string | null
    sent_at: string
  }>
  mood_value: string | null
  pending_messages: Array<{
    id: string
    message: string
    operator: GraphQLPerson | null
    operator_id: string
    sent_at: string
  }>
  title: string
  topic_value: string | null
  updated_at: string
}

type InboxQuery = {
  data_messages_aggregate: { aggregate: { count: number } | null }
  data_messages_pending_aggregate: { aggregate: { count: number } | null }
  data_threads: Array<GraphQLThread>
  data_threads_aggregate: { aggregate: { count: number } | null }
}

type SendPendingMessageMutation = {
  insert_data_messages_pending_one: {
    id: string
  } | null
}

type SendPendingMessageVariables = {
  message: string
  sentAt: string
  threadId: string
}

const countBy = (values: Array<string | null | undefined>): Array<CountMetric> => {
  const counts = values.reduce<Record<string, number>>((accumulator, value) => {
    const label = humanizeValue(value)
    accumulator[label] = (accumulator[label] ?? 0) + 1

    return accumulator
  }, {})

  return Object.entries(counts)
    .map(([label, count]) => ({ count, label }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label))
}

const mapBooking = (booking: GraphQLThread['booking']): InboxBooking | null => {
  if (!booking) {
    return null
  }

  return {
    channel: booking.channel,
    endDate: booking.end_date,
    id: booking.id,
    stage: booking.stage,
    startDate: booking.start_date,
  }
}

const mapThread = (thread: GraphQLThread): InboxThread => {
  const persistedMessages: Array<InboxMessage> = thread.messages.map((message) => {
    const isOperator = Boolean(message.operator_id)

    return {
      id: message.id,
      isPending: false,
      message: message.message,
      sender: isOperator ? message.operator : message.guest,
      senderKind: isOperator ? 'operator' : 'guest',
      sentAt: message.sent_at,
    }
  })

  const pendingMessages: Array<InboxMessage> = thread.pending_messages.map(
    (message) => ({
      id: message.id,
      isPending: true,
      message: message.message,
      sender: message.operator,
      senderKind: 'operator',
      sentAt: message.sent_at,
    }),
  )

  const messages = [...persistedMessages, ...pendingMessages].sort(
    (left, right) => new Date(left.sentAt).getTime() - new Date(right.sentAt).getTime(),
  )
  const lastMessage = messages.at(-1)

  return {
    booking: mapBooking(thread.booking),
    channel: thread.channel,
    id: thread.id,
    isUnanswered: lastMessage?.senderKind === 'guest',
    lastMessage,
    listing: thread.listing,
    messages,
    mood: thread.mood_value,
    title: thread.title,
    topic: thread.topic_value,
    updatedAt: thread.updated_at,
  }
}

const createStats = (data?: InboxQuery): InboxStats => {
  const threads = data?.data_threads.map(mapThread) ?? []
  const pendingMessages = data?.data_messages_pending_aggregate.aggregate?.count ?? 0
  const persistedMessages = data?.data_messages_aggregate.aggregate?.count ?? 0

  return {
    bookingStages: countBy(threads.map((thread) => thread.booking?.stage)),
    moods: countBy(threads.map((thread) => thread.mood)),
    pendingMessages,
    threads: data?.data_threads_aggregate.aggregate?.count ?? threads.length,
    topics: countBy(threads.map((thread) => thread.topic)),
    totalMessages: persistedMessages + pendingMessages,
    unanswered: threads.filter((thread) => thread.isUnanswered).length,
  }
}

export const InboxView = ({ threadId }: InboxViewProps) => {
  const {
    data,
    error,
    loading: isLoading,
    refetch,
  } = useQuery<InboxQuery>(GET_INBOX)
  const [sendPendingMessage, { loading: isSending }] = useMutation<
    SendPendingMessageMutation,
    SendPendingMessageVariables
  >(SEND_PENDING_MESSAGE)

  const threads = useMemo(
    () => data?.data_threads.map(mapThread) ?? [],
    [data?.data_threads],
  )
  const selectedThread = threads.find((thread) => thread.id === threadId)
  const stats = useMemo(() => createStats(data), [data])

  const handleSendReply = (message: string) => {
    if (!threadId) {
      return
    }

    void sendPendingMessage({
      variables: {
        message,
        sentAt: new Date().toISOString(),
        threadId,
      },
    }).then(() => refetch())
  }

  return (
    <InboxViewUI
      errorMessage={error?.message}
      isLoading={isLoading}
      isSending={isSending}
      onSendReply={handleSendReply}
      selectedThread={selectedThread}
      selectedThreadId={threadId}
      stats={stats}
      threads={threads}
    />
  )
}
