import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { LayoutDashboard, Settings, LogOut, Menu, X } from 'lucide-react'
import { Button } from './ui/button'

export default function AppNav() {
  const [open, setOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (open && drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [open])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <nav className="sticky top-0 z-50" style={{ background: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)' }}>
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
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

      {/* Mobile slide-in drawer overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          aria-hidden="true"
        />
      )}

      {/* Mobile slide-in drawer */}
      <div
        ref={drawerRef}
        className="md:hidden fixed top-0 right-0 h-full z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out"
        style={{
          width: '72vw',
          maxWidth: '300px',
          background: 'var(--color-bg-surface)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          borderLeft: '1px solid var(--color-border)'
        }}
        aria-hidden={!open}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between px-5 h-16"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <span className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>Menu</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-lg"
            style={{ color: 'var(--color-text)', minHeight: '44px', minWidth: '44px' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Drawer nav links */}
        <div className="flex flex-col px-4 py-4 gap-1 flex-1">
          {links.map(l => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: isActive(l.href) ? 'var(--color-primary)' : 'var(--color-text)',
                background: isActive(l.href) ? 'rgba(30,126,74,0.10)' : 'transparent',
                fontWeight: isActive(l.href) ? 600 : 500
              }}
            >
              <span style={{ color: isActive(l.href) ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>
                {l.icon}
              </span>
              {l.label}
              {isActive(l.href) && (
                <span
                  className="ml-auto w-2 h-2 rounded-full"
                  style={{ background: 'var(--color-primary)' }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Drawer footer: logout */}
        <div className="px-4 pb-6" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
          <button
            onClick={() => { setOpen(false); handleLogout() }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium w-full text-left transition-colors"
            style={{ color: 'var(--color-text-secondary)', minHeight: '44px' }}
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </div>
    </nav>
  )
}
