import { humanizeValue } from '../format'
import type { InboxLabelKind } from '../types'

type SignalBadgeProps = {
  kind: InboxLabelKind
  value?: string | null
}

const kindClassName: Record<InboxLabelKind, string> = {
  mood: 'border-hw-warning/30 bg-hw-warning-soft text-hw-warning',
  stage: 'border-hw-teal/30 bg-hw-teal-soft text-hw-teal-dark',
  topic: 'border-hw-border bg-hw-surface-muted text-hw-muted',
}

export const SignalBadge = ({ kind, value }: SignalBadgeProps) => {
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-hw-badge border px-2 py-0.5 text-[11px] font-semibold ${kindClassName[kind]}`}
    >
      <span className="truncate">{humanizeValue(value)}</span>
    </span>
  )
}
