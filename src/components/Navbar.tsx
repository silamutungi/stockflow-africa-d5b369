import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const links = [
    { href: '/pricing', label: 'Pricing' }
  ]

  const isActive = (href: string) => location.pathname === href

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

      {open && (
        <div className="md:hidden px-6 pb-6 space-y-3" style={{ background: 'rgba(15,23,42,0.97)' }}>
          {links.map(l => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium"
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/login" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full text-white/80 justify-start" style={{ minHeight: '44px' }}>Sign in</Button>
          </Link>
          <Link to="/signup" onClick={() => setOpen(false)}>
            <Button className="w-full text-white font-semibold" style={{ background: 'var(--color-primary)', minHeight: '44px' }}>Start free</Button>
          </Link>
        </div>
      )}
    </nav>
  )
}
