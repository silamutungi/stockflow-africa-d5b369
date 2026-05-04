import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { LayoutDashboard, Settings, LogOut, Menu, X } from 'lucide-react'
import { Button } from './ui/button'

export default function AppNav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  async function handleLogout() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
    navigate('/login')
  }

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { href: '/settings', label: 'Settings', icon: <Settings size={18} /> }
  ]

  const isActive = (href: string) => location.pathname === href

  return (
    <nav className="sticky top-0 z-50" style={{ background: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)' }}>
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <div className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-white text-xs" style={{ background: 'var(--color-primary)' }}>S</div>
          <span className="font-bold" style={{ color: 'var(--color-text)', fontSize: 'var(--text-subhead)' }}>StockFlow Africa</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.href}
              to={l.href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: isActive(l.href) ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                background: isActive(l.href) ? 'rgba(30,126,74,0.08)' : 'transparent'
              }}
            >
              {l.icon}{l.label}
            </Link>
          ))}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm"
            style={{ color: 'var(--color-text-secondary)', minHeight: '44px' }}
          >
            <LogOut size={18} /> Log out
          </Button>
        </div>

        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          style={{ minHeight: '44px', minWidth: '44px', color: 'var(--color-text)' }}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-4 space-y-2" style={{ background: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)' }}>
          {links.map(l => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium"
              style={{ color: isActive(l.href) ? 'var(--color-primary)' : 'var(--color-text)' }}
            >
              {l.icon}{l.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium w-full text-left"
            style={{ color: 'var(--color-text-secondary)', minHeight: '44px' }}
          >
            <LogOut size={18} /> Log out
          </button>
        </div>
      )}
    </nav>
  )
}
