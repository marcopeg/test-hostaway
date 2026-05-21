import { SignalBadge } from '../../components'
import type { CountMetric, InboxStats } from '../../types'

type StatsProps = {
  errorMessage?: string
  isLoading: boolean
  stats: InboxStats
}

const CountList = ({
  items,
  title,
}: {
  items: Array<CountMetric>
  title: string
}) => {
  return (
    <section className="rounded-hw-panel border border-hw-border bg-hw-surface p-4 shadow-hw-panel">
      <h3 className="m-0 text-sm font-semibold text-hw-ink">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3">
              <span className="truncate text-sm font-medium text-hw-muted">
                {item.label}
              </span>
              <span className="rounded-hw-badge bg-hw-surface-muted px-2.5 py-1 text-xs font-semibold text-hw-ink">
                {item.count}
              </span>
            </div>
          ))
        ) : (
          <p className="m-0 text-sm text-hw-muted">No classified data yet.</p>
        )}
      </div>
    </section>
  )
}

export const Stats = ({ errorMessage, isLoading, stats }: StatsProps) => {
  const headlineMetrics = [
    ['Total messages', stats.totalMessages],
    ['Unanswered', stats.unanswered],
    ['Threads', stats.threads],
    ['Pending replies', stats.pendingMessages],
  ] as const

  return (
    <div className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-hw-border pb-5">
        <div>
          <p className="m-0 text-xs font-semibold tracking-[0.08em] text-hw-faint uppercase">
            Situational awareness
          </p>
          <h2 className="m-0 mt-1 text-2xl font-semibold text-hw-ink">
            Inbox command center
          </h2>
          <p className="m-0 mt-2 max-w-2xl text-sm text-hw-muted">
            Scan workload, sentiment, booking stage, and conversation topics
            before opening a specific thread.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SignalBadge kind="stage" value={isLoading ? 'syncing' : 'live'} />
          {errorMessage ? <SignalBadge kind="mood" value="data limited" /> : null}
        </div>
      </div>

      {errorMessage ? (
        <div className="mt-4 rounded-hw-control border border-hw-warning/30 bg-hw-warning-soft px-3 py-2 text-sm font-medium text-hw-warning">
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {headlineMetrics.map(([label, value]) => (
          <section
            key={label}
            className="rounded-hw-panel border border-hw-border bg-hw-surface-muted p-4"
          >
            <p className="m-0 text-xs font-semibold text-hw-muted">{label}</p>
            <p className="m-0 mt-2 text-3xl font-semibold text-hw-ink">{value}</p>
          </section>
        ))}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <CountList items={stats.moods} title="Mood mix" />
        <CountList items={stats.bookingStages} title="Booking stages" />
        <CountList items={stats.topics} title="Topics" />
      </div>
    </div>
  )
}
