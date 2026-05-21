type UserInfoUIProps = {
  errorMessage?: string
  icon?: string
  isLoading: boolean
  role: string
  tenantId: string
  userId: string
  username: string
}

export const UserInfoUI = ({
  errorMessage,
  icon,
  isLoading,
  role,
  tenantId,
  userId,
  username,
}: UserInfoUIProps) => {
  return (
    <header className="flex min-h-16 items-center justify-between border-b border-hw-border bg-hw-surface px-4 sm:px-5 lg:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-hw-control border border-hw-border bg-hw-surface text-lg font-semibold text-hw-muted shadow-hw-panel lg:hidden"
          type="button"
          aria-label="Open navigation"
        >
          =
        </button>
        <div className="min-w-0">
          <p className="m-0 text-[11px] font-semibold tracking-[0.08em] text-hw-faint uppercase">
            Guest operations
          </p>
          <h1 className="m-0 truncate text-xl font-semibold text-hw-ink sm:text-2xl">
            Unified inbox
          </h1>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-1 rounded-hw-control border border-hw-border bg-hw-surface-muted p-1 md:flex">
          {['Inbox', 'Today', 'Escalations'].map((label, index) => (
            <button
              key={label}
              className={`h-8 rounded-hw-control px-3 text-xs font-semibold ${
                index === 0
                  ? 'bg-hw-surface text-hw-teal-dark shadow-hw-panel'
                  : 'text-hw-muted hover:text-hw-ink'
              }`}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        {errorMessage ? (
          <span className="hidden rounded-hw-badge border border-hw-warning/30 bg-hw-warning-soft px-3 py-1 text-xs font-semibold text-hw-warning sm:inline-flex">
            User fallback
          </span>
        ) : (
          <span className="hidden rounded-hw-badge border border-hw-success/30 bg-hw-success-soft px-3 py-1 text-xs font-semibold text-hw-success sm:inline-flex">
            {isLoading ? 'Syncing' : 'Live'}
          </span>
        )}

        <div className="hidden text-right sm:block">
          <p className="m-0 text-sm font-semibold text-hw-ink">
            {isLoading ? 'Loading user' : username}
          </p>
          <p className="m-0 text-xs text-hw-muted">
            {tenantId} / {role} / {userId}
          </p>
        </div>

        {icon ? (
          <img
            alt=""
            className="h-10 w-10 rounded-full bg-hw-orange object-cover shadow-hw-panel"
            src={icon}
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-hw-orange text-lg font-semibold italic text-white shadow-hw-panel">
            H
          </div>
        )}
      </div>
    </header>
  )
}
