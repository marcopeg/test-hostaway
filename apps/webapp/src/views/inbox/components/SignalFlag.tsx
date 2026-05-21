import {
  Angry,
  CalendarCheck,
  CalendarClock,
  CircleHelp,
  CreditCard,
  DoorOpen,
  Frown,
  KeyRound,
  LogOut,
  Meh,
  MessageCircleWarning,
  Scale,
  Smile,
  TriangleAlert,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { humanizeValue, isClassifiedValue } from '../format'
import type { InboxLabelKind } from '../types'

type FlagVariant = 'compact' | 'normal'

type SignalFlagProps = {
  kind: InboxLabelKind
  value?: string | null
  variant?: FlagVariant
}

type SpecificFlagProps = {
  value?: string | null
  variant?: FlagVariant
}

const kindLabel: Record<InboxLabelKind, string> = {
  mood: 'Mood',
  stage: 'Stage',
  topic: 'Topic',
}

const fallbackClassName: Record<InboxLabelKind, string> = {
  mood: 'border-hw-border bg-hw-surface-muted text-hw-muted',
  stage: 'border-hw-border bg-hw-surface-muted text-hw-muted',
  topic: 'border-hw-border bg-hw-surface-muted text-hw-muted',
}

const moodIconByValue: Record<string, LucideIcon> = {
  angry: Angry,
  frustrated: Frown,
  happy: Smile,
  litigious: Scale,
  neutral: Meh,
}

const stageIconByValue: Record<string, LucideIcon> = {
  booked: CalendarCheck,
  'checked-in': DoorOpen,
  'checked-out': LogOut,
  'pre-booking': CalendarClock,
}

const topicIconByValue: Record<string, LucideIcon> = {
  'appliance-incident': Wrench,
  'check-in-issue': KeyRound,
  'guest-incident': TriangleAlert,
  'guest-complaint': MessageCircleWarning,
  'payment-issue': CreditCard,
}

const moodClassNameByValue: Record<string, string> = {
  angry: 'border-red-200 bg-red-50 text-red-700',
  frustrated: 'border-amber-200 bg-amber-50 text-amber-700',
  happy: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  litigious: 'border-purple-200 bg-purple-50 text-purple-700',
  neutral: 'border-slate-200 bg-slate-50 text-slate-600',
}

const topicClassNameByValue: Record<string, string> = {
  'appliance-incident': 'border-orange-200 bg-orange-50 text-orange-700',
  'check-in-issue': 'border-sky-200 bg-sky-50 text-sky-700',
  'guest-incident': 'border-red-200 bg-red-50 text-red-700',
  'guest-complaint': 'border-amber-200 bg-amber-50 text-amber-700',
  'payment-issue': 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

const classNameByKind: Record<InboxLabelKind, Record<string, string>> = {
  mood: moodClassNameByValue,
  stage: {},
  topic: topicClassNameByValue,
}

const iconByKind: Record<InboxLabelKind, Record<string, LucideIcon>> = {
  mood: moodIconByValue,
  stage: stageIconByValue,
  topic: topicIconByValue,
}

const normalizeSignalValue = (value: string) => {
  return value.trim().toLowerCase().replace(/[_\s]+/g, '-')
}

export const SignalFlag = ({
  kind,
  value,
  variant = 'normal',
}: SignalFlagProps) => {
  if (!isClassifiedValue(value)) {
    return null
  }

  const flagValue = value ?? ''
  const normalizedValue = normalizeSignalValue(flagValue)
  const Icon = iconByKind[kind][normalizedValue] ?? CircleHelp
  const colorClassName =
    classNameByKind[kind][normalizedValue] ?? fallbackClassName[kind]
  const valueLabel = humanizeValue(flagValue)
  const tooltipLabel = `${kindLabel[kind]}: ${valueLabel}`

  if (variant === 'compact') {
    return (
      <span className="group relative inline-flex">
        <span
          aria-label={tooltipLabel}
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full border ${colorClassName}`}
          tabIndex={0}
        >
          <Icon aria-hidden="true" size={15} strokeWidth={2.25} />
        </span>
        <span
          className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-hw-control bg-hw-ink px-2 py-1 text-xs font-semibold text-white shadow-hw-popover group-hover:block group-focus-within:block"
          role="tooltip"
        >
          {tooltipLabel}
        </span>
      </span>
    )
  }

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-hw-badge border px-2.5 py-1 text-xs font-semibold ${colorClassName}`}
    >
      <Icon aria-hidden="true" className="shrink-0" size={14} strokeWidth={2.25} />
      <span className="truncate">{valueLabel}</span>
    </span>
  )
}

export const MoodFlag = ({ value, variant }: SpecificFlagProps) => (
  <SignalFlag kind="mood" value={value} variant={variant} />
)

export const StageFlag = ({ value, variant }: SpecificFlagProps) => (
  <SignalFlag kind="stage" value={value} variant={variant} />
)

export const TopicFlag = ({ value, variant }: SpecificFlagProps) => (
  <SignalFlag kind="topic" value={value} variant={variant} />
)
