export type LoanStatus = 'pending' | 'approved' | 'disbursed' | 'repaying' | 'completed' | 'rejected'

export type DocumentStatus = 'pending' | 'verified' | 'rejected'

export interface FinancingRequest {
  id: string
  user_id: string
  supplier_name: string
  amount: number
  currency: string
  purpose: string
  status: LoanStatus
  repayment_weeks: number
  weekly_payment: number
  disbursed_at: string | null
  created_at: string
  deleted_at: string | null
}

export interface Document {
  id: string
  user_id: string
  name: string
  doc_type: string
  file_url: string
  status: DocumentStatus
  created_at: string
  deleted_at: string | null
}

export interface Profile {
  id: string
  user_id: string
  full_name: string
  business_name: string
  phone: string
  country: string
  currency: string
  credit_score: number
  credit_limit: number
  created_at: string
}

export interface Repayment {
  id: string
  user_id: string
  financing_id: string
  amount: number
  currency: string
  due_date: string
  paid_at: string | null
  status: 'pending' | 'paid' | 'overdue'
  created_at: string
}
