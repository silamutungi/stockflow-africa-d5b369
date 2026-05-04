import { useState, useEffect, type FormEvent } from 'react'
import AppNav from '../components/AppNav'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { CheckCircle, AlertCircle } from 'lucide-react'

const CURRENCIES = ['KES', 'UGX', 'TZS', 'GHS', 'NGN', 'USD', 'ZAR']
const COUNTRIES = ['Kenya', 'Uganda', 'Tanzania', 'Ghana', 'Nigeria', 'South Africa', 'Rwanda', 'Ethiopia']

export default function Settings() {
  const [fullName, setFullName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('Kenya')
  const [currency, setCurrency] = useState('KES')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        if (!isSupabaseConfigured) {
          setFullName('Jane Mwangi')
          setBusinessName('Mwangi General Store')
          setPhone('+254 712 345 678')
          setLoading(false)
          return
        }
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return
        const { data } = await (supabase.from('profiles').select('*').eq('user_id', session.user.id).single() as any)
        if (data) {
          setFullName(data.full_name ?? '')
          setBusinessName(data.business_name ?? '')
          setPhone(data.phone ?? '')
          setCountry(data.country ?? 'Kenya')
          setCurrency(data.currency ?? 'KES')
        }
      } catch {
        setError('Failed to load profile.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      if (!isSupabaseConfigured) {
        await new Promise(r => setTimeout(r, 600))
        setSuccess(true)
        return
      }
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')
      const { error: upsertError } = await (supabase.from('profiles').upsert({ user_id: session.user.id, full_name: fullName, business_name: businessName, phone, country, currency } as any).eq('user_id', session.user.id) as any)
      if (upsertError) throw upsertError
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <AppNav />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-bold mb-8" style={{ fontSize: 'var(--text-title-2)', color: 'var(--color-text)' }}>Settings</h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-12 rounded-lg animate-pulse" style={{ background: 'var(--color-border)' }} />)}
          </div>
        ) : (
          <Card style={{ border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)' }}>
            <CardHeader>
              <CardTitle style={{ fontSize: 'var(--text-title-3)', color: 'var(--color-text)' }}>Business Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="mb-1.5 block">Full name</Label>
                    <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required disabled={saving} />
                  </div>
                  <div>
                    <Label htmlFor="biz" className="mb-1.5 block">Business name</Label>
                    <Input id="biz" value={businessName} onChange={e => setBusinessName(e.target.value)} required disabled={saving} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone" className="mb-1.5 block">Phone number</Label>
                  <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254 700 000 000" disabled={saving} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country" className="mb-1.5 block">Country</Label>
                    <select
                      id="country"
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      disabled={saving}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-surface)', color: 'var(--color-text)', minHeight: '44px' }}
                    >
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="currency" className="mb-1.5 block">Preferred currency</Label>
                    <select
                      id="currency"
                      value={currency}
                      onChange={e => setCurrency(e.target.value)}
                      disabled={saving}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-surface)', color: 'var(--color-text)', minHeight: '44px' }}
                    >
                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                {success && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(22,163,74,0.08)', color: 'var(--color-success)' }}>
                    <CheckCircle size={16} />
                    <span className="text-sm">Profile saved successfully.</span>
                  </div>
                )}
                {error && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(220,38,38,0.08)', color: 'var(--color-error)' }}>
                    <AlertCircle size={16} />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
                <Button type="submit" className="text-white font-semibold" style={{ background: 'var(--color-primary)', minHeight: '44px' }} disabled={saving}>
                  {saving ? 'Saving...' : 'Save changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="mt-8" style={{ border: '1px solid var(--color-error)', background: 'var(--color-bg-surface)' }}>
          <CardHeader>
            <CardTitle style={{ fontSize: 'var(--text-headline)', color: 'var(--color-error)' }}>Danger zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>Deleting your account is permanent. All financing history and documents will be removed. This cannot be undone.</p>
            <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50" style={{ minHeight: '44px' }} disabled>
              Delete account
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}