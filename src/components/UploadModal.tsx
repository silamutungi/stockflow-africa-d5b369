import { useState, type FormEvent } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { X, AlertCircle } from 'lucide-react'

const DOC_TYPES = [
  { value: 'business_license', label: 'Business License / Registration' },
  { value: 'tax_id', label: 'Tax ID / KRA PIN' },
  { value: 'bank_statement', label: 'Bank Statement (3 months)' },
  { value: 'id_document', label: 'National ID / Passport' },
  { value: 'other', label: 'Other' }
]

interface Props {
  onClose: () => void
  onSuccess: () => void
}

export default function UploadModal({ onClose, onSuccess }: Props) {
  const [docName, setDocName] = useState('')
  const [docType, setDocType] = useState(DOC_TYPES[0].value)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      if (!isSupabaseConfigured) {
        await new Promise(r => setTimeout(r, 700))
        onSuccess()
        onClose()
        return
      }
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')
      const { error: insertError } = await (supabase.from('documents').insert({
        user_id: session.user.id,
        name: docName,
        doc_type: docType,
        file_url: 'pending_upload',
        status: 'pending'
      } as any) as any)
      if (insertError) throw insertError
      onSuccess()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <Card className="w-full" style={{ maxWidth: '440px', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle style={{ fontSize: 'var(--text-title-3)', color: 'var(--color-text)' }}>Upload document</CardTitle>
          <button onClick={onClose} aria-label="Close" className="p-1 rounded" style={{ color: 'var(--color-text-secondary)', minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="docType" className="mb-1.5 block">Document type</Label>
              <select
                id="docType"
                value={docType}
                onChange={e => setDocType(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
                style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '44px' }}
                disabled={submitting}
              >
                {DOC_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="docName" className="mb-1.5 block">Document name</Label>
              <Input
                id="docName"
                type="text"
                required
                value={docName}
                onChange={e => setDocName(e.target.value)}
                placeholder="e.g. KRA PIN Certificate 2024"
                disabled={submitting}
              />
            </div>
            <div>
              <Label className="mb-1.5 block">File</Label>
              <div
                className="w-full rounded-lg border-2 border-dashed px-4 py-8 text-center text-sm"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
              >
                File upload available after database connection.
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(220,38,38,0.08)', color: 'var(--color-error)' }}>
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}
            <Button type="submit" className="w-full text-white font-semibold" style={{ background: 'var(--color-primary)', minHeight: '44px' }} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit document'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}