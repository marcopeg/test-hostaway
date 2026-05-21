type WorkInProgressViewProps = {
  title: string
}

export const WorkInProgressView = ({ title }: WorkInProgressViewProps) => {
  return (
    <section className="flex min-h-[calc(100svh-8rem)] items-start justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-hw-panel border border-hw-border bg-hw-surface p-8 shadow-hw-panel">
        <p className="m-0 text-xs font-semibold tracking-[0.08em] text-hw-faint uppercase">
          Work in progress
        </p>
        <h2 className="m-0 mt-2 text-2xl font-semibold text-hw-ink">{title}</h2>
        <p className="m-0 mt-3 max-w-xl text-sm text-hw-muted">
          This section is registered in the application navigation and will be
          implemented in a later workflow.
        </p>
      </div>
    </section>
  )
}
