import { Link } from '@tanstack/react-router'
import {
  codeClassName,
  errorClassName,
  errorStatusClassName,
  liveStatusClassName,
  panelClassName,
  statusBaseClassName,
} from 'lib/routeStyles'

type TodoDetailsUIProps = {
  errorMessage?: string
  isLoading: boolean
  notes?: string | null
  title?: string
  todoId: string
}

export const TodoDetailsUI = ({
  errorMessage,
  isLoading,
  notes,
  title,
  todoId,
}: TodoDetailsUIProps) => {
  const statusClassName = errorMessage
    ? errorStatusClassName
    : liveStatusClassName

  return (
    <section className={panelClassName}>
      <header className="flex items-start justify-between gap-5 border-b border-slate-200 px-7 py-6 dark:border-slate-700 max-[700px]:flex-col max-[700px]:px-5">
        <div>
          <span className="mb-2 block text-[13px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Todo notes
          </span>
          <h2 className="mb-2 text-2xl leading-[1.18] font-medium text-slate-950 max-lg:text-xl dark:text-slate-50">
            {isLoading && !title ? 'Loading todo' : title ?? 'Todo not found'}
          </h2>
          <code className={codeClassName}>{todoId}</code>
        </div>
        <span className={`${statusBaseClassName} ${statusClassName}`}>
          {errorMessage ? 'Task unavailable' : isLoading && !title ? 'Loading' : 'Live'}
        </span>
      </header>

      {errorMessage ? <p className={errorClassName}>{errorMessage}</p> : null}

      <div className="grid gap-6 px-7 py-6 max-[700px]:px-5">
        <p className="m-0 text-slate-700 dark:text-slate-300">
          {notes ?? (isLoading ? 'Loading notes...' : 'No notes available.')}
        </p>
        <Link
          to="/"
          className="w-fit rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Back to todos
        </Link>
      </div>
    </section>
  )
}
