export type DocumentType = 'INE' | 'PASAPORTE' | 'LICENCIA'
export type RequestStatus = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'REQUIERE_INFORMACION'
export type RiskLevel = 'BAJO' | 'MEDIO' | 'ALTO'

export interface VerificationRequest {
  id: string
  fullName: string
  email: string
  phone: string
  country: string
  documentType: DocumentType
  documentNumber: string
  imageUrl: string | null
  status: RequestStatus
  riskScore: number
  riskLevel: RiskLevel
  createdAt: string
  updatedAt: string
}

export interface RiskAssessment {
  score: number
  level: RiskLevel
  factors: string[]
}

export interface VerificationDetail extends VerificationRequest {
  riskAssessment: RiskAssessment
}

export interface CreateVerificationInput {
  fullName: string
  email: string
  phone: string
  country: string
  documentType: DocumentType
  documentNumber: string
  imageUrl?: string | null
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  details?: unknown
  pagination?: PaginationInfo
}

export interface QueryParams {
  search?: string
  status?: RequestStatus
  page?: number
  limit?: number
}
