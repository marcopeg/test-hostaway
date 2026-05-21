import { Link } from '@tanstack/react-router'
import {
  codeClassName,
  errorClassName,
  errorStatusClassName,
  liveStatusClassName,
  panelClassName,
  statusBaseClassName,
} from 'lib/routeStyles'

type TodoListItem = {
  id: string
  title: string
}

type TodosListUIProps = {
  errorMessage?: string
  isLoading: boolean
  todos: Array<TodoListItem>
}

export const TodosListUI = ({
  errorMessage,
  isLoading,
  todos,
}: TodosListUIProps) => {
  const todosStatusClassName = errorMessage
    ? errorStatusClassName
    : liveStatusClassName

  return (
    <section className={panelClassName}>
      <header className="flex items-center justify-between gap-5 border-b border-slate-200 px-7 py-6 dark:border-slate-700 max-[700px]:flex-col max-[700px]:items-start max-[700px]:px-5">
        <div>
          <span className="mb-2 block text-[13px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Todos
          </span>
          <h2 className="mb-2 text-2xl leading-[1.18] font-medium text-slate-950 max-lg:text-xl dark:text-slate-50">
            Open tasks
          </h2>
        </div>
        <span className={`${statusBaseClassName} ${todosStatusClassName}`}>
          {errorMessage ? 'Tasks unavailable' : isLoading ? 'Loading' : 'Live'}
        </span>
      </header>

      {errorMessage ? <p className={errorClassName}>{errorMessage}</p> : null}

      <ul className="grid list-none gap-0 p-0">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="border-b border-slate-200 last:border-b-0 dark:border-slate-700"
          >
            <Link
              to="/$todoId"
              params={{ todoId: todo.id }}
              className="flex min-h-16 items-center justify-between gap-5 px-7 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 max-[700px]:flex-col max-[700px]:items-start max-[700px]:px-5"
            >
              <span className="font-semibold text-slate-950 dark:text-slate-50">
                {todo.title}
              </span>
              <code className={codeClassName}>{todo.id}</code>
            </Link>
          </li>
        ))}
        {isLoading && todos.length === 0 ? (
          <li className="flex min-h-16 items-center justify-between gap-5 border-b border-slate-200 px-7 py-3.5 text-slate-500 last:border-b-0 dark:border-slate-700 dark:text-slate-400 max-[700px]:flex-col max-[700px]:items-start max-[700px]:px-5">
            Waiting for todos...
          </li>
        ) : null}
      </ul>
    </section>
  )
}
