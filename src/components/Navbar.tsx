import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const drawerRef = useRef<HTMLDivElement>(null)

  const links = [
    { href: '/pricing', label: 'Pricing' }
  ]

  const isActive = (href: string) => location.pathname === href

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm" style={{ background: 'var(--color-primary)' }}>S</div>
          <span className="font-bold text-white" style={{ fontSize: 'var(--text-headline)' }}>StockFlow Africa</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link
              key={l.href}
              to={l.href}
              className="text-sm font-medium transition-colors"
              style={{ color: isActive(l.href) ? 'white' : 'rgba(255,255,255,0.7)' }}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/login">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-gray-900/10" style={{ minHeight: '44px' }}>Sign in</Button>
          </Link>
          <Link to="/signup">
            <Button className="text-white font-semibold" style={{ background: 'var(--color-primary)', minHeight: '44px' }}>Start free</Button>
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-white"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Backdrop overlay — closes drawer on tap/click outside */}
      <div
        className={`md:hidden fixed top-16 left-0 right-0 bottom-0 z-40 transition-all duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(0,0,0,0.4)' }}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile slide-in drawer */}
      <div
        ref={drawerRef}
        className={`md:hidden fixed top-16 left-0 bottom-0 z-50 w-72 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'var(--color-background, #f8f7f4)', boxShadow: '4px 0 24px rgba(0,0,0,0.18)' }}
        aria-label="Mobile navigation drawer"
      >
        <div className="flex flex-col gap-1 px-5 pt-6 pb-8">
          {links.map(l => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-3 rounded-lg text-sm font-semibold transition-colors"
              style={{
                color: isActive(l.href)
                  ? 'var(--color-primary, #e85d26)'
                  : 'var(--color-text, #1a1a2e)',
                background: isActive(l.href)
                  ? 'rgba(232,93,38,0.08)'
                  : 'transparent'
              }}
            >
              {l.label}
            </Link>
          ))}

          <div className="mt-4 flex flex-col gap-3">
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start font-semibold"
                style={{ color: 'var(--color-text, #1a1a2e)', minHeight: '44px' }}
              >
                Sign in
              </Button>
            </Link>
            <Link to="/signup" onClick={() => setOpen(false)}>
              <Button
                className="w-full text-white font-semibold"
                style={{ background: 'var(--color-primary)', minHeight: '44px' }}
              >
                Start free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
