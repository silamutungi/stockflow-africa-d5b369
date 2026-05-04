import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)' }}>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-white text-xs" style={{ background: 'var(--color-primary)' }}>S</div>
              <span className="font-bold" style={{ color: 'var(--color-text)', fontSize: 'var(--text-subhead)' }}>StockFlow Africa</span>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-subhead)', lineHeight: '1.6' }}>Inventory financing built for African SMEs. Restock today, pay as you grow.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-3" style={{ color: 'var(--color-text)', fontSize: 'var(--text-subhead)' }}>Product</h3>
            <ul className="space-y-2">
              <li><Link to="/pricing" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-subhead)' }} className="hover:underline">Pricing</Link></li>
              <li><Link to="/signup" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-subhead)' }} className="hover:underline">Get started</Link></li>
              <li><Link to="/login" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-subhead)' }} className="hover:underline">Sign in</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3" style={{ color: 'var(--color-text)', fontSize: 'var(--text-subhead)' }}>Legal</h3>
            <ul className="space-y-2">
              <li><span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-subhead)' }}>Privacy Policy</span></li>
              <li><span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-subhead)' }}>Terms of Service</span></li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-caption)' }}>
            &copy; {new Date().getFullYear()} StockFlow Africa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
