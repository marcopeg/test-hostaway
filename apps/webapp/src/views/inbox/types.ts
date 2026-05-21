export type SenderKind = 'guest' | 'operator'

export type InboxLabelKind = 'mood' | 'stage' | 'topic'

export type InboxChannel = {
  icon: string
  id: string
  name: string
}

export type InboxPerson = {
  icon: string
  id: string
  name: string
}

export type InboxListing = {
  id: string
  name: string
}

export type InboxBooking = {
  channel?: InboxChannel | null
  endDate: string
  id: string
  stage: string
  startDate: string
}

export type InboxMessage = {
  id: string
  isPending: boolean
  message: string
  sender?: InboxPerson | null
  senderKind: SenderKind
  sentAt: string
}

export type InboxThread = {
  booking?: InboxBooking | null
  channel: InboxChannel
  id: string
  isUnanswered: boolean
  lastMessage?: InboxMessage
  listing?: InboxListing | null
  messages: Array<InboxMessage>
  mood?: string | null
  title: string
  topic?: string | null
  updatedAt: string
}

export type CountMetric = {
  count: number
  label: string
}

export type InboxStats = {
  bookingStages: Array<CountMetric>
  moods: Array<CountMetric>
  pendingMessages: number
  threads: number
  topics: Array<CountMetric>
  totalMessages: number
  unanswered: number
}
