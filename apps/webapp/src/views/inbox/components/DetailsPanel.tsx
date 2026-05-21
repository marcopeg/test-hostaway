import { ChannelIcon, MoodFlag, StageFlag, TopicFlag } from '.'
import { formatDate, formatFullDateTime, getNights } from '../format'
import type { InboxThread } from '../types'

type DetailsPanelProps = {
  thread: InboxThread
}

const imageClassNames = [
  'bg-[linear-gradient(135deg,#dff7f5,#f8fafb_45%,#ffeadb)]',
  'bg-[linear-gradient(135deg,#eef2f7,#ffffff_40%,#dff7f5)]',
  'bg-[linear-gradient(135deg,#fff1e7,#ffffff_45%,#e0f7f5)]',
]

export const DetailsPanel = ({ thread }: DetailsPanelProps) => {
  const booking = thread.booking
  const nights = booking ? getNights(booking.startDate, booking.endDate) : 0

  return (
    <div className="space-y-5 p-5">
      <section>
        <p className="m-0 text-xs font-semibold tracking-[0.08em] text-hw-faint uppercase">
          Conversation context
        </p>
        <h3 className="m-0 mt-1 text-lg font-semibold text-hw-ink">
          {thread.listing?.name ?? 'Listing not attached'}
        </h3>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <MoodFlag value={thread.mood} />
          <TopicFlag value={thread.topic} />
        </div>
      </section>

      <section className="rounded-hw-panel border border-hw-border bg-hw-surface p-4 shadow-hw-panel">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="m-0 text-sm font-semibold text-hw-ink">Listing</h4>
          <ChannelIcon channel={thread.channel} size="sm" />
        </div>
        <div className="flex gap-2 overflow-hidden">
          {imageClassNames.map((className, index) => (
            <div
              key={className}
              className={`h-20 min-w-24 rounded-hw-control border border-hw-border ${className}`}
              title={`Mock listing image ${index + 1}`}
            />
          ))}
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3">
          {[
            ['Listing ID', thread.listing?.id ?? 'n/a'],
            ['Access', 'Smart lock'],
            ['Bedrooms', '2'],
            ['Priority', thread.isUnanswered ? 'Needs reply' : 'Covered'],
            ['Housekeeping', 'Ready by 15:00'],
            ['Parking', 'On-site'],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-semibold text-hw-muted">{label}</dt>
              <dd className="m-0 mt-0.5 text-sm font-medium text-hw-ink">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-hw-panel border border-hw-border bg-hw-surface p-4 shadow-hw-panel">
        <div className="flex items-start justify-between gap-3">
          <h4 className="m-0 text-sm font-semibold text-hw-ink">Booking</h4>
          <StageFlag value={booking?.stage} />
        </div>
        {booking ? (
          <>
            <div className="mt-4 rounded-hw-panel border border-hw-border bg-hw-surface-muted p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="m-0 text-xs font-semibold text-hw-muted">
                    Check-in
                  </p>
                  <p className="m-0 mt-1 text-lg font-semibold text-hw-ink">
                    {formatDate(booking.startDate)}
                  </p>
                </div>
                <div className="h-px flex-1 bg-hw-border" />
                <div className="text-right">
                  <p className="m-0 text-xs font-semibold text-hw-muted">
                    Check-out
                  </p>
                  <p className="m-0 mt-1 text-lg font-semibold text-hw-ink">
                    {formatDate(booking.endDate)}
                  </p>
                </div>
              </div>
              <p className="m-0 mt-3 text-center text-xs font-semibold text-hw-muted">
                {nights} nights
              </p>
            </div>
            <dl className="mt-4 space-y-3">
              {[
                ['Booking ID', booking.id],
                ['Stage', booking.stage],
                ['Start', formatFullDateTime(booking.startDate)],
                ['End', formatFullDateTime(booking.endDate)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-semibold text-hw-muted">
                    {label}
                  </dt>
                  <dd className="m-0 mt-0.5 text-sm font-medium text-hw-ink">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        ) : (
          <p className="m-0 mt-3 text-sm text-hw-muted">
            This thread is not attached to a booking yet.
          </p>
        )}
      </section>
    </div>
  )
}
