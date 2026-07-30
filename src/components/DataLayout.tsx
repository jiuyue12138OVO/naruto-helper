import { Outlet } from 'react-router-dom'
import { DataProvider, useData } from '@/contexts/DataContext'

function LoadingBar() {
  const { loadingCount } = useData()

  if (loadingCount === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, loadingCount * 20)}%` }}
      />
    </div>
  )
}

export default function DataLayout() {
  return (
    <DataProvider>
      <LoadingBar />
      <Outlet />
    </DataProvider>
  )
}