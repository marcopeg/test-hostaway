import type { ReactNode } from 'react'

type SplitLayoutProps = {
  center: ReactNode
  left: ReactNode
  right?: ReactNode
}

export const SplitLayout = ({ center, left, right }: SplitLayoutProps) => {
  return (
    <section
      className={`grid h-[calc(100svh-5.5rem)] min-h-0 overflow-hidden bg-hw-app ${
        right
          ? 'grid-cols-1 xl:grid-cols-[21rem_minmax(32rem,1fr)_21rem]'
          : 'grid-cols-1 xl:grid-cols-[21rem_minmax(0,1fr)]'
      }`}
    >
      <aside className="min-h-0 overflow-y-auto border-r border-hw-border bg-hw-app">
        {left}
      </aside>

      <div className="min-h-0 overflow-hidden bg-hw-app px-3 pt-3">
        <main className="h-full min-h-0 overflow-y-auto rounded-t-hw-panel border-x border-t border-hw-border bg-hw-surface shadow-hw-panel">
          {center}
        </main>
      </div>

      {right ? (
        <aside className="hidden min-h-0 overflow-y-auto border-l border-hw-border bg-hw-app xl:block">
          {right}
        </aside>
      ) : null}
    </section>
  )
}
