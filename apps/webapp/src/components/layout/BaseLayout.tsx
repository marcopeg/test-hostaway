import { Outlet } from '@tanstack/react-router'
import { UserInfo } from 'containers'

export const BaseLayout = () => {
  return (
    <main className="relative min-h-svh overflow-hidden bg-slate-50 text-[18px] leading-[1.45] text-slate-600 antialiased dark:bg-slate-950 dark:text-slate-300 max-lg:text-base">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-sky-500/10 to-transparent" />
      <div className="relative mx-auto flex w-[min(920px,calc(100%-40px))] flex-col gap-7 py-14 text-left max-[700px]:w-[min(calc(100%-28px),920px)] max-[700px]:py-8">
        <UserInfo />
        <Outlet />
      </div>
    </main>
  )
}
