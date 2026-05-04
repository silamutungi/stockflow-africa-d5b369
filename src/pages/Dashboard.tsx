import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { formatCurrency, formatDate } from '../lib/utils'
import { type FinancingRequest, type Document, type Repayment } from '../types'
import AppNav from '../components/AppNav'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import RequestModal from '../components/RequestModal'
import UploadModal from '../components/UploadModal'
import { TrendingUp, FileText, Calendar, AlertTriangle, RefreshCw } from 'lucide-react'

const SEED_REQUESTS: FinancingRequest[] = [
  { id: '1', user_id: 'demo', supplier_name: 'Bidco Africa', amount: 85000, currency: 'KES', purpose: 'Cooking oil restock', status: 'disbursed', repayment_weeks: 8, weekly_payment: 10625, disbursed_at: '2024-05-01', created_at: '2024-04-28', deleted_at: null },
  { id: '2', user_id: 'demo', supplier_name: 'Unga Group', amount: 120000, currency: 'KES', purpose: 'Flour and grains', status: 'repaying', repayment_weeks: 12, weekly_payment: 10000, disbursed_at: '2024-04-15', created_at: '2024-04-12', deleted_at: null },
  { id: '3', user_id: 'demo', supplier_name: 'East African Breweries', amount: 45000, currency: 'KES', purpose: 'Beverages Q2', status: 'pending', repayment_weeks: 4, weekly_payment: 11250, disbursed_at: null, created_at: '2024-05-10', deleted_at: null }
]

const SEED_DOCS: Document[] = [
  { id: 'd1', user_id: 'demo', name: 'Business Registration Certificate', doc_type: 'business_license', file_url: '#', status: 'verified', created_at: '2024-04-01', deleted_at: null },
  { id: 'd2', user_id: 'demo', name: 'KRA PIN Certificate', doc_type: 'tax_id', file_url: '#', status: 'pending', created_at: '2024-05-10', deleted_at: null }
]

const SEED_REPAYMENTS: Repayment[] = [
  { id: 'r1', user_id: 'demo', financing_id: '2', amount: 10000, currency: 'KES', due_date: '2024-05-15', paid_at: '2024-05-15', status: 'paid', created_at: '2024-04-15' },
  { id: 'r2', user_id: 'demo', financing_id: '2', amount: 10000, currency: 'KES', due_date: '2024-05-22', paid_at: null, status: 'pending', created_at: '2024-04-15' },
  { id: 'r3', user_id: 'demo', financing_id: '1', amount: 10625, currency: 'KES', due_date: '2024-05-20', paid_at: null, status: 'overdue', created_at: '2024-05-01' }
]

function statusColor(status: string) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    disbursed: 'bg-purple-100 text-purple-800',
    repaying: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    verified: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    paid: 'bg-green-100 text-green-800'
  }
  return map[status] ?? 'bg-gray-100 text-gray-800'
}

export default function Dashboard() {
  const [requests, setRequests] = useState<FinancingRequest[]>([])
  const [docs, setDocs] = useState<Document[]>([])
  const [repayments, setRepayments] = useState<Repayment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [creditLimit] = useState(250000)

  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      if (!isSupabaseConfigured) {
        await new Promise(r => setTimeout(r, 700))
        setRequests(SEED_REQUESTS)
        setDocs(SEED_DOCS)
        setRepayments(SEED_REPAYMENTS)
        return
      }
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const uid = session.user.id
      const [rRes, dRes, repRes] = await Promise.all([
        (supabase.from('financing_requests').select('*').eq('user_id', uid).is('deleted_at', null).order('created_at', { ascending: false }) as any),
        (supabase.from('documents').select('*').eq('user_id', uid).is('deleted_at', null).order('created_at', { ascending: false }) as any),
        (supabase.from('repayments').select('*').eq('user_id', uid).order('due_date', { ascending: true }) as any)
      ])
      if (rRes.error) throw rRes.error
      if (dRes.error) throw dRes.error
      if (repRes.error) throw repRes.error
      setRequests(rRes.data ?? [])
      setDocs(dRes.data ?? [])
      setRepayments(repRes.data ?? [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const activeAmount = requests.filter(r => ['disbursed', 'repaying'].includes(r.status)).reduce((s, r) => s + r.amount, 0)
  const overdueCount = repayments.filter(r => r.status === 'overdue').length
  const nextPayment = repayments.find(r => r.status === 'pending')

  if (loading) {
    return (
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
        <AppNav />
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[1, 2, 3].map(i => <div key={i} className="h-28 rounded-xl animate-pulse" style={{ background: 'var(--color-border)' }} />)}
          </div>
          <div className="h-64 rounded-xl animate-pulse" style={{ background: 'var(--color-border)' }} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
        <AppNav />
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <AlertTriangle size={40} className="mx-auto mb-4" style={{ color: 'var(--color-error)' }} />
          <h2 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Failed to load dashboard</h2>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>{error}</p>
          <Button onClick={fetchData} style={{ background: 'var(--color-primary)', color: 'white' }}>
            <RefreshCw size={16} className="mr-2" /> Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <AppNav />
      {!isSupabaseConfigured && (
        <div className="text-center py-2 text-sm" style={{ background: 'rgba(14,165,233,0.1)', color: 'var(--color-info)' }}>
          Viewing sample data — connect your database to go live.
        </div>
      )}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-bold" style={{ fontSize: 'var(--text-title-2)', color: 'var(--color-text)' }}>Dashboard</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-subhead)' }}>Your financing overview</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowUploadModal(true)} variant="outline" style={{ minHeight: '44px' }}>
              <FileText size={16} className="mr-2" /> Upload doc
            </Button>
            <Button onClick={() => setShowRequestModal(true)} className="text-white font-semibold" style={{ background: 'var(--color-primary)', minHeight: '44px' }}>
              + New request
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <Card style={{ border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)' }}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Credit Limit</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="font-bold text-2xl" style={{ color: 'var(--color-text)' }}>{formatCurrency(creditLimit)}</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full" style={{ background: 'var(--color-border)' }}>
                <div className="h-1.5 rounded-full" style={{ background: 'var(--color-primary)', width: `${Math.min((activeAmount / creditLimit) * 100, 100)}%` }} />
              </div>
              <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>{formatCurrency(activeAmount)} used</p>
            </CardContent>
          </Card>
          <Card style={{ border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)' }}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Active Financing</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp size={20} style={{ color: 'var(--color-primary)' }} />
                <span className="font-bold text-2xl" style={{ color: 'var(--color-text)' }}>{requests.filter(r => ['disbursed', 'repaying'].includes(r.status)).length}</span>
              </div>
              <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>{requests.length} total requests</p>
            </CardContent>
          </Card>
          <Card style={{ border: overdueCount > 0 ? '1px solid var(--color-error)' : '1px solid var(--color-border)', background: 'var(--color-bg-surface)' }}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Next Payment</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar size={20} style={{ color: overdueCount > 0 ? 'var(--color-error)' : 'var(--color-primary)' }} />
                <span className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>
                  {nextPayment ? formatCurrency(nextPayment.amount, nextPayment.currency) : 'None due'}
                </span>
              </div>
              {nextPayment && <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>Due {formatDate(nextPayment.due_date)}</p>}
              {overdueCount > 0 && <p className="mt-1 text-xs font-medium" style={{ color: 'var(--color-error)' }}>{overdueCount} overdue payment{overdueCount > 1 ? 's' : ''}</p>}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="font-semibold mb-4" style={{ fontSize: 'var(--text-headline)', color: 'var(--color-text)' }}>Financing Requests</h2>
            {requests.length === 0 ? (
              <div className="text-center py-12 rounded-xl border" style={{ borderColor: 'var(--color-border)' }}>
                <p className="mb-3" style={{ color: 'var(--color-text-secondary)' }}>No financing requests yet.</p>
                <Button onClick={() => setShowRequestModal(true)} className="text-white" style={{ background: 'var(--color-primary)', minHeight: '44px' }}>Make your first request</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map(r => (
                  <div key={r.id} className="p-4 rounded-xl border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-surface)' }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium" style={{ color: 'var(--color-text)' }}>{r.supplier_name}</p>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{r.purpose}</p>
                      </div>
                      <Badge className={statusColor(r.status)}>{r.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{formatCurrency(r.amount, r.currency)}</span>
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{formatDate(r.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="font-semibold mb-4" style={{ fontSize: 'var(--text-headline)', color: 'var(--color-text)' }}>Documents</h2>
            {docs.length === 0 ? (
              <div className="text-center py-12 rounded-xl border" style={{ borderColor: 'var(--color-border)' }}>
                <p className="mb-3" style={{ color: 'var(--color-text-secondary)' }}>No documents uploaded yet.</p>
                <Button onClick={() => setShowUploadModal(true)} variant="outline" style={{ minHeight: '44px' }}>Upload your first document</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {docs.map(d => (
                  <div key={d.id} className="p-4 rounded-xl border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-surface)' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium" style={{ color: 'var(--color-text)' }}>{d.name}</p>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{d.doc_type.replace('_', ' ')}</p>
                      </div>
                      <Badge className={statusColor(d.status)}>{d.status}</Badge>
                    </div>
                    <p className="mt-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>Uploaded {formatDate(d.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="font-semibold mb-4" style={{ fontSize: 'var(--text-headline)', color: 'var(--color-text)' }}>Repayment Schedule</h2>
          {repayments.length === 0 ? (
            <div className="text-center py-10 rounded-xl border" style={{ borderColor: 'var(--color-border)' }}>
              <p style={{ color: 'var(--color-text-secondary)' }}>No repayments scheduled — get your first financing to see your schedule here.</p>
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Due date</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Amount</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {repayments.map(rep => (
                    <tr key={rep.id} style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-surface)' }}>
                      <td className="px-4 py-3" style={{ color: 'var(--color-text)' }}>{formatDate(rep.due_date)}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-text)' }}>{formatCurrency(rep.amount, rep.currency)}</td>
                      <td className="px-4 py-3"><Badge className={statusColor(rep.status)}>{rep.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 rounded-xl border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-surface)' }}>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Need to update your profile or business details?{' '}
            <Link to="/settings" className="font-medium" style={{ color: 'var(--color-primary)' }}>Go to Settings</Link>
          </p>
        </div>
      </main>

      {showRequestModal && <RequestModal onClose={() => setShowRequestModal(false)} onSuccess={fetchData} />}
      {showUploadModal && <UploadModal onClose={() => setShowUploadModal(false)} onSuccess={fetchData} />}
    </div>
  )
}
