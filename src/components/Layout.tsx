import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'
import { Toaster } from 'sonner'
import { useData } from '@/contexts/DataContext'

export function Layout() {
  const { showUpdateMsg } = useData()

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Toaster />

      {/* 版本更新提示覆盖层 */}
      {showUpdateMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-card border border-border/40 rounded-xl px-8 py-6 shadow-2xl text-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-foreground mb-1">数据已更新</p>
            <p className="text-sm text-muted-foreground">正在加载最新数据，请稍候…</p>
          </div>
        </div>
      )}
    </>
  )
}