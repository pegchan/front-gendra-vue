import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { verificationApi } from '@/services/api'
import type {
  VerificationRequest,
  VerificationDetail,
  CreateVerificationInput,
  QueryParams,
  RequestStatus,
  PaginationInfo
} from '@/types'

export const useVerificationStore = defineStore('verification', () => {
  // State
  const verifications = ref<VerificationRequest[]>([])
  const currentVerification = ref<VerificationDetail | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const filters = ref<QueryParams>({
    search: '',
    status: undefined,
    page: 1,
    limit: 10,
  })

  // Getters
  const hasVerifications = computed(() => verifications.value.length > 0)
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  // Actions
  async function fetchVerifications(params?: QueryParams) {
    loading.value = true
    error.value = null

    try {
      const queryParams = { ...filters.value, ...params }
      const response = await verificationApi.getAll(queryParams)
      verifications.value = response.data
      pagination.value = response.pagination
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar solicitudes'
      console.error('Error fetching verifications:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchVerificationById(id: string) {
    loading.value = true
    error.value = null

    try {
      currentVerification.value = await verificationApi.getById(id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar solicitud'
      console.error('Error fetching verification:', e)
    } finally {
      loading.value = false
    }
  }

  async function createVerification(data: CreateVerificationInput) {
    loading.value = true
    error.value = null

    try {
      const newVerification = await verificationApi.create(data)
      await fetchVerifications()
      return newVerification
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al crear solicitud'
      console.error('Error creating verification:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateStatus(id: string, status: RequestStatus) {
    loading.value = true
    error.value = null

    try {
      const updated = await verificationApi.updateStatus(id, status)

      // Actualizar en la lista
      const index = verifications.value.findIndex(v => v.id === id)
      if (index !== -1) {
        verifications.value[index] = updated
      }

      // Actualizar el detalle actual si es el mismo
      if (currentVerification.value?.id === id) {
        currentVerification.value = { ...currentVerification.value, ...updated }
      }

      return updated
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al actualizar estado'
      console.error('Error updating status:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteVerification(id: string) {
    loading.value = true
    error.value = null

    try {
      await verificationApi.delete(id)
      await fetchVerifications()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al eliminar solicitud'
      console.error('Error deleting verification:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters: Partial<QueryParams>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function clearFilters() {
    filters.value = {
      search: '',
      status: undefined,
      page: 1,
      limit: 10,
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    verifications,
    currentVerification,
    loading,
    error,
    pagination,
    filters,
    // Getters
    hasVerifications,
    isLoading,
    hasError,
    // Actions
    fetchVerifications,
    fetchVerificationById,
    createVerification,
    updateStatus,
    deleteVerification,
    setFilters,
    clearFilters,
    clearError,
  }
})
