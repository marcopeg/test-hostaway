import {
  Angry,
  CalendarCheck,
  CalendarClock,
  CircleAlert,
  CircleHelp,
  CreditCard,
  DoorOpen,
  Frown,
  Inbox,
  KeyRound,
  LogOut,
  Meh,
  MessageSquare,
  MessageCircleWarning,
  Scale,
  Send,
  Smile,
  TriangleAlert,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { CountMetric, InboxLabelKind, InboxStats } from '../../types'

type StatsProps = {
  errorMessage?: string
  isLoading: boolean
  onSelectFilter: (value: string) => void
  stats: InboxStats
}

const fallbackSignalClassName: Record<InboxLabelKind, string> = {
  mood: 'border-hw-border bg-hw-surface-muted text-hw-muted',
  stage: 'border-hw-border bg-hw-surface-muted text-hw-muted',
  topic: 'border-hw-border bg-hw-surface-muted text-hw-muted',
}

const signalIcons: Record<InboxLabelKind, Record<string, LucideIcon>> = {
  mood: {
    angry: Angry,
    frustrated: Frown,
    happy: Smile,
    litigious: Scale,
    neutral: Meh,
  },
  stage: {
    booked: CalendarCheck,
    'checked-in': DoorOpen,
    'checked-out': LogOut,
    'pre-booking': CalendarClock,
  },
  topic: {
    'appliance-incident': Wrench,
    'check-in-issue': KeyRound,
    'guest-incident': TriangleAlert,
    'guest-complaint': MessageCircleWarning,
    'payment-issue': CreditCard,
  },
}

const signalClassNames: Record<InboxLabelKind, Record<string, string>> = {
  mood: {
    angry: 'border-red-200 bg-red-50 text-red-700',
    frustrated: 'border-amber-200 bg-amber-50 text-amber-700',
    happy: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    litigious: 'border-purple-200 bg-purple-50 text-purple-700',
    neutral: 'border-slate-200 bg-slate-50 text-slate-600',
  },
  stage: {},
  topic: {
    'appliance-incident': 'border-orange-200 bg-orange-50 text-orange-700',
    'check-in-issue': 'border-sky-200 bg-sky-50 text-sky-700',
    'guest-incident': 'border-red-200 bg-red-50 text-red-700',
    'guest-complaint': 'border-amber-200 bg-amber-50 text-amber-700',
    'payment-issue': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
}

const normalizeSignalValue = (value: string) => {
  return value.trim().toLowerCase().replace(/[_\s]+/g, '-')
}

const CountList = ({
  items,
  kind,
  onSelectFilter,
  title,
}: {
  items: Array<CountMetric>
  kind: InboxLabelKind
  onSelectFilter: (value: string) => void
  title: string
}) => {
  return (
    <section className="rounded-hw-panel border border-hw-border bg-hw-surface p-4 shadow-hw-panel">
      <h3 className="m-0 text-sm font-semibold text-hw-ink">{title}</h3>
      <div className="mt-4 space-y-2">
        {items.length > 0 ? (
          items.map((item) => {
            const signalValue = normalizeSignalValue(item.label)
            const Icon = signalIcons[kind][signalValue] ?? CircleHelp
            const colorClassName =
              signalClassNames[kind][signalValue] ?? fallbackSignalClassName[kind]

            return (
              <button
                key={item.label}
                className="group flex w-full items-center justify-between gap-3 rounded-hw-control border border-transparent px-2 py-2 text-left transition-colors hover:border-hw-teal/30 hover:bg-hw-teal-soft focus-visible:border-hw-teal focus-visible:outline-none"
                onClick={() => onSelectFilter(item.label)}
                type="button"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${colorClassName}`}
                  >
                    <Icon aria-hidden="true" size={15} strokeWidth={2.25} />
                  </span>
                  <span className="truncate text-sm font-medium text-hw-muted group-hover:text-hw-ink">
                    {item.label}
                  </span>
                </span>
                <span className="rounded-full bg-hw-surface-muted px-2.5 py-1 text-xs font-semibold text-hw-ink">
                  {item.count}
                </span>
              </button>
            )
          })
        ) : (
          <p className="m-0 text-sm text-hw-muted">No classified data yet.</p>
        )}
      </div>
    </section>
  )
}

export const Stats = ({
  errorMessage,
  isLoading,
  onSelectFilter,
  stats,
}: StatsProps) => {
  const headlineMetrics = [
    {
      accent: 'border-l-hw-teal',
      icon: MessageSquare,
      label: 'Total messages',
      value: stats.totalMessages,
    },
    {
      accent: 'border-l-hw-warning',
      icon: CircleAlert,
      label: 'Unhandled',
      value: stats.unanswered,
    },
    {
      accent: 'border-l-hw-orange',
      icon: Inbox,
      label: 'Threads',
      value: stats.threads,
    },
    {
      accent: 'border-l-hw-success',
      icon: Send,
      label: 'Pending replies',
      value: stats.pendingMessages,
    },
  ] as const

  return (
    <div className="p-5">
      <div className="rounded-hw-panel border border-hw-border bg-hw-surface p-5 shadow-hw-panel">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="m-0 text-xs font-semibold tracking-[0.08em] text-hw-faint uppercase">
              Situational awareness
            </p>
            <h2 className="m-0 mt-1 text-3xl font-semibold text-hw-ink">
              Inbox Command Center
            </h2>
            <p className="m-0 mt-2 text-sm text-hw-muted">
              Prioritize unhandled guest threads, scan sentiment and booking
              context, then jump straight into the conversation that needs
              attention.
            </p>
          </div>
          {isLoading || errorMessage ? (
            <div className="flex flex-wrap gap-2">
              <span className="rounded-hw-badge border border-hw-border bg-hw-surface-muted px-2.5 py-1 text-xs font-semibold text-hw-muted">
                {isLoading ? 'Syncing data' : 'Data limited'}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {errorMessage ? (
        <div className="mt-4 rounded-hw-control border border-hw-warning/30 bg-hw-warning-soft px-3 py-2 text-sm font-medium text-hw-warning">
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {headlineMetrics.map((metric) => {
          const Icon = metric.icon

          return (
            <section
              key={metric.label}
              className={`rounded-hw-panel border border-l-4 border-hw-border ${metric.accent} bg-hw-surface p-4 shadow-hw-panel`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="m-0 text-xs font-semibold text-hw-muted">
                  {metric.label}
                </p>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-hw-control bg-hw-surface-muted text-hw-muted">
                  <Icon aria-hidden="true" size={17} strokeWidth={2.25} />
                </span>
              </div>
              <p className="m-0 mt-3 text-4xl font-semibold text-hw-ink">
                {metric.value}
              </p>
            </section>
          )
        })}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <CountList
          items={stats.moods}
          kind="mood"
          onSelectFilter={onSelectFilter}
          title="Mood Mix"
        />
        <CountList
          items={stats.bookingStages}
          kind="stage"
          onSelectFilter={onSelectFilter}
          title="Booking Stages"
        />
        <CountList
          items={stats.topics}
          kind="topic"
          onSelectFilter={onSelectFilter}
          title="Topics"
        />
      </div>
    </div>
  )
}
