<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Solicitudes de Verificacion</h1>
      <p class="mt-1 text-sm text-gray-600">Gestiona las solicitudes de verificacion KYC</p>
    </div>

    <!-- Filtros -->
    <div class="card mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label class="label">Buscar</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre o email..."
            class="input"
            @input="handleSearch"
          />
        </div>
        <div class="w-full sm:w-48">
          <label class="label">Estado</label>
          <select v-model="statusFilter" class="input" @change="handleFilterChange">
            <option value="">Todos</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="APROBADA">Aprobada</option>
            <option value="RECHAZADA">Rechazada</option>
            <option value="REQUIERE_INFORMACION">Requiere Info</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading  -->
    <div v-if="store.loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
      <p class="mt-2 text-gray-600">Cargando solicitudes...</p>
    </div>

    <!-- Vista para errores -->
    <div v-else-if="store.error" class="card bg-red-50 border border-red-200">
      <p class="text-red-700">{{ store.error }}</p>
      <button @click="loadVerifications" class="btn btn-secondary mt-4">
        Reintentar
      </button>
    </div>

    <!-- sin solicitudes -->
    <div v-else-if="!store.hasVerifications" class="card text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No hay solicitudes</h3>
      <p class="mt-1 text-sm text-gray-500">Comienza creando una nueva solicitud de verificacion.</p>
      <div class="mt-6">
        <router-link to="/verifications/new" class="btn btn-primary">
          Nueva Solicitud
        </router-link>
      </div>
    </div>

    <!-- tabla -->
    <div v-else class="card overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pais
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Riesgo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="verification in store.verifications"
              :key="verification.id"
              class="hover:bg-gray-50 cursor-pointer"
              @click="goToDetail(verification.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ verification.fullName }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ verification.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ verification.country }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <StatusBadge :status="verification.status" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <RiskBadge :level="verification.riskLevel" :score="verification.riskScore" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(verification.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click.stop="goToDetail(verification.id)"
                  class="text-primary-600 hover:text-primary-900"
                >
                  Ver detalle
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="changePage(store.pagination.page - 1)"
            :disabled="store.pagination.page === 1"
            class="btn btn-secondary"
          >
            Anterior
          </button>
          <button
            @click="changePage(store.pagination.page + 1)"
            :disabled="store.pagination.page >= store.pagination.totalPages"
            class="btn btn-secondary"
          >
            Siguiente
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Mostrando
              <span class="font-medium">{{ startItem }}</span>
              a
              <span class="font-medium">{{ endItem }}</span>
              de
              <span class="font-medium">{{ store.pagination.total }}</span>
              resultados
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="changePage(store.pagination.page - 1)"
                :disabled="store.pagination.page === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                {{ store.pagination.page }} / {{ store.pagination.totalPages }}
              </span>
              <button
                @click="changePage(store.pagination.page + 1)"
                :disabled="store.pagination.page >= store.pagination.totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVerificationStore } from '@/stores/verification'
import StatusBadge from '@/components/StatusBadge.vue'
import RiskBadge from '@/components/RiskBadge.vue'
import type { RequestStatus } from '@/types'

const router = useRouter()
const store = useVerificationStore()

const searchQuery = ref('')
const statusFilter = ref<RequestStatus | ''>('')

let searchTimeout: ReturnType<typeof setTimeout>

const startItem = computed(() => {
  return (store.pagination.page - 1) * store.pagination.limit + 1
})

const endItem = computed(() => {
  return Math.min(store.pagination.page * store.pagination.limit, store.pagination.total)
})

function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    store.setFilters({ search: searchQuery.value, page: 1 })
    store.fetchVerifications()
  }, 300)
}

function handleFilterChange() {
  store.setFilters({
    status: statusFilter.value || undefined,
    page: 1,
  })
  store.fetchVerifications()
}

function changePage(page: number) {
  store.setFilters({ page })
  store.fetchVerifications()
}

function goToDetail(id: string) {
  router.push(`/verifications/${id}`)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function loadVerifications() {
  store.clearError()
  store.fetchVerifications()
}

onMounted(() => {
  loadVerifications()
})
</script>
