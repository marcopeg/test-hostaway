import type { InboxChannel } from '../types'

type ChannelIconProps = {
  channel: InboxChannel
  size?: 'md' | 'sm'
}

const sizeClassName = {
  md: 'h-9 w-9',
  sm: 'h-6 w-6',
}

export const ChannelIcon = ({ channel, size = 'md' }: ChannelIconProps) => {
  return (
    <span
      className={`${sizeClassName[size]} flex shrink-0 items-center justify-center rounded-full border border-hw-border bg-hw-surface shadow-hw-panel`}
      title={channel.name}
    >
      <img
        alt=""
        className="h-2/3 w-2/3 rounded-full object-contain"
        src={channel.icon}
      />
    </span>
  )
}
