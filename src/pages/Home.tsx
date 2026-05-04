import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { CheckCircle, Zap, ShieldCheck, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: '⚡',
    title: 'Instant Credit Scoring',
    description: 'Know your financing limit in under 60 seconds. No paperwork delays, no waiting rooms.'
  },
  {
    icon: '🏪',
    title: 'Approved Supplier Network',
    description: 'Source from 200+ pre-vetted suppliers across East Africa. Buy from anyone you trust.'
  },
  {
    icon: '📅',
    title: 'Transparent Repayments',
    description: 'See your full repayment schedule upfront. Automatic deductions — no surprise calls.'
  },
  {
    icon: '🌍',
    title: 'Multi-Currency Payments',
    description: 'Pay suppliers in KES, UGX, TZS, GHS or USD. Cross-border sourcing, zero friction.'
  },
  {
    icon: '📋',
    title: 'Fast Document Verification',
    description: 'Batch-upload your business license and tax ID once. Verified within 24 hours.'
  },
  {
    icon: '📊',
    title: 'Investor Dashboard',
    description: 'Full portfolio transparency — default risk signals, repayment rates, and returns.'
  }
]

const steps = [
  { step: '01', title: 'Create your account', desc: 'Sign up and complete your business profile in 5 minutes.' },
  { step: '02', title: 'Get your credit limit', desc: 'Our algorithm scores your business and shows your limit immediately.' },
  { step: '03', title: 'Request inventory financing', desc: 'Choose a supplier, submit the amount, and funds move within 24 hours.' },
  { step: '04', title: 'Repay as you sell', desc: 'Fixed weekly payments auto-deducted. No penalties for early repayment.' }
]

export default function Home() {
  return (
    <div style={{ background: 'var(--color-bg)' }}>
      <Navbar />

      <section
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1758876202714-567dad9c5b41?ixid=M3w5MTM0MDN8MHwxfHNlYXJjaHwxfHxBJTIwY29uZmlkZW50JTIwQWZyaWNhbiUyMFNNRSUyMGJ1c2luZXNzJTIwb3duZXIlMjBzdGFuZHMlMjBpbiUyMGElMjB3ZWxsLW9yZ2F8ZW58MHwwfHx8MTc3NzkxMTg1MXww&ixlib=rb-4.1.0&w=1920&h=1080&fit=crop&crop=center&q=80&auto=format)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        className="relative min-h-[100svh] flex items-center overflow-hidden"
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 100%)' }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-32">
          <Badge className="mb-6 text-white border-white/30 bg-gray-900/10 backdrop-blur-sm">
            Inventory Financing for African SMEs
          </Badge>
          <h1 className="text-white font-bold leading-tight mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', maxWidth: '680px' }}>
            Restock today.<br />Pay as your business grows.
          </h1>
          <p className="text-white/85 mb-8 text-lg" style={{ maxWidth: '520px', lineHeight: '1.6' }}>
            Get inventory financing approved in 60 seconds. Source from trusted suppliers. Repay on a schedule that fits your cash flow — no aggressive reminders, ever.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/signup">
              <Button size="lg" className="text-white font-semibold px-8 py-3" style={{ background: 'var(--color-primary)', minHeight: '44px' }}>
                Start free
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="font-semibold px-8 py-3 border-white/50 text-white hover:bg-gray-900/10" style={{ minHeight: '44px' }}>
                See pricing
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 mt-10">
            {['No collateral required', 'Approved in 60 seconds', 'Multi-currency support'].map(item => (
              <div key={item} className="flex items-center gap-2 text-white/80 text-sm">
                <CheckCircle size={16} className="text-green-400" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32" style={{ background: 'var(--color-bg-surface)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-bold mb-4" style={{ fontSize: 'var(--text-title-1)', color: 'var(--color-text)' }}>Everything your business needs to grow</h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto' }}>From instant credit scoring to transparent repayments — built for African SMEs from the ground up.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(f => (
              <div key={f.title} className="p-6 rounded-xl border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}>
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-semibold mb-2" style={{ fontSize: 'var(--text-headline)', color: 'var(--color-text)' }}>{f.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-subhead)', lineHeight: '1.6' }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-bold mb-4" style={{ fontSize: 'var(--text-title-1)', color: 'var(--color-text)' }}>From signup to funded in 24 hours</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(s => (
              <div key={s.step} className="relative">
                <div className="text-4xl font-bold mb-3" style={{ color: 'var(--color-primary)', opacity: 0.3 }}>{s.step}</div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text)', fontSize: 'var(--text-headline)' }}>{s.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-subhead)', lineHeight: '1.6' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24" style={{ background: 'var(--color-bg-surface)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-8 flex-wrap mb-12">
            {[
              { label: 'SMEs funded', value: '4,200+', icon: <TrendingUp size={20} style={{ color: 'var(--color-primary)' }} /> },
              { label: 'Avg. approval time', value: '58 sec', icon: <Zap size={20} style={{ color: 'var(--color-primary)' }} /> },
              { label: 'Repayment rate', value: '94.2%', icon: <ShieldCheck size={20} style={{ color: 'var(--color-primary)' }} /> }
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-center gap-2 p-6 rounded-xl border" style={{ borderColor: 'var(--color-border)', minWidth: '160px' }}>
                {stat.icon}
                <span className="font-bold text-3xl" style={{ color: 'var(--color-text)' }}>{stat.value}</span>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-subhead)' }}>{stat.label}</span>
              </div>
            ))}
          </div>
          <h2 className="font-bold mb-4" style={{ fontSize: 'var(--text-title-1)', color: 'var(--color-text)' }}>Ready to restock your shelves?</h2>
          <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>Join thousands of SMEs already growing with StockFlow Africa.</p>
          <Link to="/signup">
            <Button size="lg" className="text-white font-semibold px-10" style={{ background: 'var(--color-primary)', minHeight: '44px' }}>
              Get started free
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
