type UserInfoUIProps = {
  errorMessage?: string
  isLoading: boolean
  role: string
  userId: string
  username: string
}

export const UserInfoUI = ({
  errorMessage,
  isLoading,
  role,
  userId,
  username,
}: UserInfoUIProps) => {
  const statusClassName = errorMessage
    ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-300/35 dark:bg-red-400/10 dark:text-red-200'
    : 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-300/35 dark:bg-emerald-400/10 dark:text-emerald-200'

  return (
    <>
      <section className="flex items-start justify-between gap-6 rounded-lg border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30 max-[700px]:flex-col max-[700px]:p-6">
        <div>
          <span className="mb-2 block text-[13px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Current user
          </span>
          <h1 className="mb-3.5 text-[44px] leading-[1.04] font-medium text-slate-950 max-lg:text-[34px] dark:text-slate-50">
            {isLoading ? 'Loading user' : username}
          </h1>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              Role
              <code className="font-mono text-[13px] text-slate-950 dark:text-slate-50">
                {role}
              </code>
            </span>
            <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              User ID
              <code className="font-mono text-[13px] text-slate-950 dark:text-slate-50">
                {userId}
              </code>
            </span>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full border px-3 py-2 text-sm leading-none font-bold ${statusClassName}`}
        >
          {errorMessage ? 'Session error' : 'Ready'}
        </span>
      </section>

      {errorMessage ? (
        <p className="m-0 rounded-lg border border-red-300 bg-red-50 px-3.5 py-3 text-red-700 dark:border-red-300/35 dark:bg-red-400/10 dark:text-red-200">
          {errorMessage}
        </p>
      ) : null}
    </>
  )
}
