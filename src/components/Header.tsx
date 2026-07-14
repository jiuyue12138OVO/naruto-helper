import { NavLink } from 'react-router-dom'
import { Home, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
  { path: '/', label: '首页', icon: Home },
  { path: '/tier-list', label: '忍者', icon: '🥷🏻' },
  { path: '/scrolls', label: '密卷', icon: '📜' },
  { path: '/summons', label: '通灵兽', icon: '🐶' },
  { path: '/battle-bp', label: '武斗赛', icon: '🏆' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
        {/* Logo：使用网站图标 + 英文名称 */}
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <div className="size-8 rounded-lg bg-linear-to-br from-orange-500 to-red-600 flex items-center justify-center overflow-hidden">
            <img
              src={import.meta.env.BASE_URL + 'naruto-icon.png'}
              alt="Naruto Helper"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-lg font-bold text-foreground hidden sm:block">
            Naruto Helper
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`
                }
              >
                {typeof Icon === 'string' ? (
                  <span className="text-base leading-none">{Icon}</span>
                ) : (
                  <Icon className="size-4" />
                )}
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="菜单"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-md">
          <div className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`
                  }
                >
                  {typeof Icon === 'string' ? (
                    <span className="text-base leading-none">{Icon}</span>
                  ) : (
                    <Icon className="size-4" />
                  )}
                  {item.label}
                </NavLink>
              )
            })}
          </div>
        </nav>
      )}
    </header>
  )
}