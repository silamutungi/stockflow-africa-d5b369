import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { AlertCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function Signup() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (!isSupabaseConfigured) {
        await new Promise(r => setTimeout(r, 800))
        navigate('/dashboard')
        return
      }
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, business_name: businessName } }
      })
      if (signupError) throw signupError
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Signup failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex items-center justify-center px-6 py-16" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Card className="w-full" style={{ maxWidth: '440px', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
          <CardHeader className="pb-4">
            <CardTitle style={{ fontSize: 'var(--text-title-2)', color: 'var(--color-text)' }}>Start for free</CardTitle>
            <CardDescription style={{ color: 'var(--color-text-secondary)' }}>Get your inventory financing limit in 60 seconds</CardDescription>
          </CardHeader>
          <CardContent>
            {!isSupabaseConfigured && (
              <div className="mb-4 px-3 py-2 rounded-lg text-sm" style={{ background: 'rgba(14,165,233,0.1)', color: 'var(--color-info)', border: '1px solid rgba(14,165,233,0.2)' }}>
                Demo mode — connect your database to go live.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="mb-1.5 block">Full name</Label>
                <Input id="fullName" type="text" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Jane Mwangi" disabled={loading} />
              </div>
              <div>
                <Label htmlFor="businessName" className="mb-1.5 block">Business name</Label>
                <Input id="businessName" type="text" required value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Mwangi General Store" disabled={loading} />
              </div>
              <div>
                <Label htmlFor="email" className="mb-1.5 block">Email address</Label>
                <Input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@business.com" disabled={loading} />
              </div>
              <div>
                <Label htmlFor="password" className="mb-1.5 block">Password</Label>
                <Input id="password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" disabled={loading} />
              </div>
              {error && (
                <div className="flex items-start gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(220,38,38,0.08)', color: 'var(--color-error)' }}>
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              <Button type="submit" className="w-full text-white font-semibold" style={{ background: 'var(--color-primary)', minHeight: '44px' }} disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>
            <p className="text-center mt-5 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-medium" style={{ color: 'var(--color-primary)' }}>Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}