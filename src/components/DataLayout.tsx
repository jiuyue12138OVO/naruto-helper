import { Outlet } from 'react-router-dom'
import { DataProvider } from '@/contexts/DataContext'

export default function DataLayout() {
  return (
    <DataProvider>
      <Outlet />
    </DataProvider>
  )
}