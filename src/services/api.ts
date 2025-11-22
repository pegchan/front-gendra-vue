import axios from 'axios'
import type {
  VerificationRequest,
  VerificationDetail,
  CreateVerificationInput,
  ApiResponse,
  QueryParams,
  RequestStatus,
  PaginationInfo
} from '@/types'

const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export interface GetVerificationsResponse {
  data: VerificationRequest[]
  pagination: PaginationInfo
}

// El backend ahora usa imageUrl directamente
interface BackendVerification {
  id: string
  fullName: string
  email: string
  phone: string
  country: string
  documentType: string
  documentNumber: string
  imageUrl: string | null
  status: string
  riskScore: number
  riskLevel: string
  createdAt: string
  updatedAt: string
  riskAssessment?: { score: number; level: string; factors: string[] }
}

function mapBackendToFrontend(data: BackendVerification): VerificationRequest {
  return data as unknown as VerificationRequest
}

export const verificationApi = {
  async getAll(params: QueryParams = {}): Promise<GetVerificationsResponse> {
    const queryParams = new URLSearchParams()

    if (params.search) queryParams.append('search', params.search)
    if (params.status) queryParams.append('status', params.status)
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())

    const response = await apiClient.get<ApiResponse<BackendVerification[]> & { pagination: PaginationInfo }>(
      `/verifications?${queryParams.toString()}`
    )

    return {
      data: (response.data.data || []).map(mapBackendToFrontend),
      pagination: response.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
    }
  },

  async getById(id: string): Promise<VerificationDetail | null> {
    const response = await apiClient.get<ApiResponse<BackendVerification & { riskAssessment: { score: number; level: string; factors: string[] } }>>(`/verifications/${id}`)
    if (!response.data.data) return null
    return mapBackendToFrontend(response.data.data) as unknown as VerificationDetail
  },

  async create(data: CreateVerificationInput): Promise<VerificationDetail> {
    const response = await apiClient.post<ApiResponse<BackendVerification>>('/verifications', data)
    if (!response.data.data) {
      throw new Error(response.data.error || 'Error creating verification')
    }
    return mapBackendToFrontend(response.data.data) as unknown as VerificationDetail
  },

  async updateStatus(id: string, status: RequestStatus): Promise<VerificationRequest> {
    const response = await apiClient.patch<ApiResponse<BackendVerification>>(
      `/verifications/${id}/status`,
      { status }
    )
    if (!response.data.data) {
      throw new Error(response.data.error || 'Error updating status')
    }
    return mapBackendToFrontend(response.data.data)
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/verifications/${id}`)
  },
}

export default apiClient
