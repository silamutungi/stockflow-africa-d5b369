import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Button } from '../components/ui/button'
import { CheckCircle } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    description: 'For businesses just getting started with inventory financing.',
    limit: 'Up to KES 50,000 per request',
    features: [
      'Instant credit scoring',
      'Up to 2 active financing requests',
      'Access to approved supplier network',
      '4-week repayment terms',
      'Basic document verification'
    ],
    cta: 'Start free',
    href: '/signup',
    highlighted: false
  },
  {
    name: 'Growth',
    price: 'KES 1,500',
    period: '/month',
    description: 'For growing businesses that need higher limits and faster processing.',
    limit: 'Up to KES 500,000 per request',
    features: [
      'Everything in Starter',
      'Up to 10 active financing requests',
      'Multi-currency supplier payments',
      'Up to 16-week repayment terms',
      'Priority document verification (24 hrs)',
      'Repayment automation',
      'Email support'
    ],
    cta: 'Start free trial',
    href: '/signup',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large distributors and chains with complex sourcing needs.',
    limit: 'Unlimited financing requests',
    features: [
      'Everything in Growth',
      'Dedicated underwriter',
      'Custom repayment structures',
      'API integration for ERP/POS',
      'Investor portfolio dashboard',
      'Admin risk assessment tools',
      'SLA-backed support'
    ],
    cta: 'Contact sales',
    href: '/signup',
    highlighted: false
  }
]

const faqs = [
  { q: 'How does inventory financing work?', a: 'You apply for financing against a supplier invoice. We pay the supplier directly, and you repay us in fixed weekly installments as you sell your inventory.' },
  { q: 'How fast is the credit decision?', a: 'Our algorithm scores your business in under 60 seconds using your business registration, trading history, and mobile money data. No waiting days for approval.' },
  { q: 'Which currencies do you support?', a: 'We support KES, UGX, TZS, GHS, NGN, USD, and ZAR. Supplier payments are settled in the supplier\'s local currency within one business day.' },
  { q: 'Are there penalties for early repayment?', a: 'Never. Pay off your financing early at any time with zero penalties. We believe in rewarding responsible businesses.' },
  { q: 'Do I need collateral?', a: 'No physical collateral required. Your business trading history and document verification are sufficient for most financing requests.' }
]

export default function Pricing() {
  return (
    <div style={{ background: 'var(--color-bg)' }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="font-bold mb-4" style={{ fontSize: 'var(--text-title-1)', color: 'var(--color-text)' }}>Simple, transparent pricing</h1>
          <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>No hidden fees. No lock-in. Pay only for what your business needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map(plan => (
            <div
              key={plan.name}
              className="rounded-2xl p-8"
              style={{
                border: plan.highlighted ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                background: 'var(--color-bg-surface)',
                position: 'relative'
              }}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: 'var(--color-primary)' }}>Most popular</div>
              )}
              <h2 className="font-bold mb-1" style={{ fontSize: 'var(--text-title-3)', color: 'var(--color-text)' }}>{plan.name}</h2>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-bold" style={{ fontSize: 'var(--text-title-1)', color: 'var(--color-text)' }}>{plan.price}</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>{plan.period}</span>
              </div>
              <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>{plan.description}</p>
              <p className="text-sm font-medium mb-6" style={{ color: 'var(--color-primary)' }}>{plan.limit}</p>
              <Link to={plan.href}>
                <Button
                  className="w-full font-semibold mb-6"
                  style={{
                    background: plan.highlighted ? 'var(--color-primary)' : 'transparent',
                    color: plan.highlighted ? 'white' : 'var(--color-primary)',
                    border: plan.highlighted ? 'none' : '1px solid var(--color-primary)',
                    minHeight: '44px'
                  }}
                >
                  {plan.cta}
                </Button>
              </Link>
              <ul className="space-y-3">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--color-success)' }} />
                    <span className="text-sm" style={{ color: 'var(--color-text)' }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <h2 className="font-bold mb-8 text-center" style={{ fontSize: 'var(--text-title-2)', color: 'var(--color-text)' }}>Frequently asked questions</h2>
          <div className="space-y-6">
            {faqs.map(faq => (
              <div key={faq.q} className="p-6 rounded-xl border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-surface)' }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text)', fontSize: 'var(--text-headline)' }}>{faq.q}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-subhead)', lineHeight: '1.6' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
