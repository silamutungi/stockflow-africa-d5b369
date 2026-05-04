import { useState, type FormEvent } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { X, AlertCircle } from 'lucide-react'

const SUPPLIERS = [
  'Bidco Africa', 'Unga Group', 'East African Breweries', 'Kenpoly',
  'Chandaria Industries', 'Procter & Gamble EA', 'Unilever Kenya', 'Other'
]
const CURRENCIES = ['KES', 'UGX', 'TZS', 'GHS', 'USD']

interface Props {
  onClose: () => void
  onSuccess: () => void
}

export default function RequestModal({ onClose, onSuccess }: Props) {
  const [supplier, setSupplier] = useState(SUPPLIERS[0])
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('KES')
  const [purpose, setPurpose] = useState('')
  const [weeks, setWeeks] = useState('8')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const amt = parseFloat(amount)
      if (isNaN(amt) || amt <= 0) throw new Error('Enter a valid amount.')
      const weeklyPayment = Math.ceil((amt * 1.12) / parseInt(weeks))

      if (!isSupabaseConfigured) {
        await new Promise(r => setTimeout(r, 800))
        onSuccess()
        onClose()
        return
      }
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')
      const { error: insertError } = await (supabase.from('financing_requests').insert({
        user_id: session.user.id,
        supplier_name: supplier,
        amount: amt,
        currency,
        purpose,
        status: 'pending',
        repayment_weeks: parseInt(weeks),
        weekly_payment: weeklyPayment
      } as any) as any)
      if (insertError) throw insertError
      onSuccess()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <Card className="w-full" style={{ maxWidth: '480px', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle style={{ fontSize: 'var(--text-title-3)', color: 'var(--color-text)' }}>New financing request</CardTitle>
          <button onClick={onClose} aria-label="Close" className="p-1 rounded" style={{ color: 'var(--color-text-secondary)', minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="supplier" className="mb-1.5 block">Supplier</Label>
              <select
                id="supplier"
                value={supplier}
                onChange={e => setSupplier(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
                style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '44px' }}
                disabled={submitting}
              >
                {SUPPLIERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="amount" className="mb-1.5 block">Amount</Label>
                <Input id="amount" type="number" min="1000" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="50000" disabled={submitting} />
              </div>
              <div>
                <Label htmlFor="currency" className="mb-1.5 block">Currency</Label>
                <select
                  id="currency"
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '44px' }}
                  disabled={submitting}
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="purpose" className="mb-1.5 block">Purpose</Label>
              <Input id="purpose" type="text" required value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="e.g. Flour and grains restock" disabled={submitting} />
            </div>
            <div>
              <Label htmlFor="weeks" className="mb-1.5 block">Repayment term</Label>
              <select
                id="weeks"
                value={weeks}
                onChange={e => setWeeks(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
                style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '44px' }}
                disabled={submitting}
              >
                {['4', '8', '12', '16'].map(w => <option key={w} value={w}>{w} weeks</option>)}
              </select>
            </div>
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(220,38,38,0.08)', color: 'var(--color-error)' }}>
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}
            <Button type="submit" className="w-full text-white font-semibold" style={{ background: 'var(--color-primary)', minHeight: '44px' }} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}