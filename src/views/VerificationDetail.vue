<template>
  <div>
    <div class="mb-6">
      <router-link to="/verifications" class="text-primary-600 hover:text-primary-800 text-sm flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver a solicitudes
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
      <p class="mt-2 text-gray-600">Cargando detalle...</p>
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="card bg-red-50 border border-red-200">
      <p class="text-red-700">{{ store.error }}</p>
      <button @click="loadDetail" class="btn btn-secondary mt-4">Reintentar</button>
    </div>

    <!-- Not Found -->
    <div v-else-if="!verification" class="card text-center py-12">
      <p class="text-gray-600">Solicitud no encontrada</p>
      <router-link to="/verifications" class="btn btn-primary mt-4">
        Volver a solicitudes
      </router-link>
    </div>

    <!-- Detail Content -->
    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="card">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ verification.fullName }}</h1>
            <p class="text-sm text-gray-500">ID: {{ verification.id }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <StatusBadge :status="verification.status" size="lg" />
            <RiskBadge :level="verification.riskLevel" :score="verification.riskScore" size="lg" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Personal Info -->
        <div class="lg:col-span-2 space-y-6">
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Informacion Personal</h2>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Nombre Completo</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ verification.fullName }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Correo Electronico</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ verification.email }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Telefono</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ verification.phone }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Pais</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ verification.country }}</dd>
              </div>
            </dl>
          </div>

          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Informacion del Documento</h2>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Tipo de Documento</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ documentTypeLabel }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Numero de Documento</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ verification.documentNumber }}</dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-sm font-medium text-gray-500">URL de Imagen (Documento o Selfie)</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <a
                    v-if="verification.imageUrl"
                    :href="verification.imageUrl"
                    target="_blank"
                    class="text-primary-600 hover:underline break-all"
                  >
                    {{ verification.imageUrl }}
                  </a>
                  <span v-else class="text-gray-400">No proporcionado</span>
                </dd>
              </div>
            </dl>
          </div>

          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Fechas</h2>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Fecha de Creacion</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDateTime(verification.createdAt) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Ultima Actualizacion</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDateTime(verification.updatedAt) }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Risk Assessment & Actions -->
        <div class="space-y-6">
          <!-- Risk Assessment -->
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Evaluacion de Riesgo</h2>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-500">Score</span>
                <span class="text-2xl font-bold" :class="riskScoreColor">
                  {{ verification.riskScore }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-500">Nivel</span>
                <RiskBadge :level="verification.riskLevel" :score="verification.riskScore" />
              </div>

              <!-- Risk Factors -->
              <div v-if="verification.riskAssessment?.factors?.length" class="mt-4">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Factores de Riesgo</h3>
                <ul class="space-y-2">
                  <li
                    v-for="(factor, index) in verification.riskAssessment.factors"
                    :key="index"
                    class="text-sm text-gray-700 flex items-start"
                  >
                    <span class="mr-2" :class="riskIconColor">*</span>
                    {{ factor }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Status Change -->
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Cambiar Estado</h2>
            <div class="space-y-3">
              <button
                v-for="status in availableStatuses"
                :key="status.value"
                @click="changeStatus(status.value)"
                :disabled="verification.status === status.value || isChangingStatus"
                class="w-full btn"
                :class="status.class"
              >
                {{ status.label }}
              </button>
            </div>
            <p v-if="statusError" class="mt-3 text-sm text-red-600">{{ statusError }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useVerificationStore } from '@/stores/verification'
import StatusBadge from '@/components/StatusBadge.vue'
import RiskBadge from '@/components/RiskBadge.vue'
import type { RequestStatus } from '@/types'

const props = defineProps<{
  id: string
}>()

const store = useVerificationStore()
const isChangingStatus = ref(false)
const statusError = ref('')

const verification = computed(() => store.currentVerification)

const documentTypeLabel = computed(() => {
  const labels: Record<string, string> = {
    INE: 'INE (Credencial de Elector)',
    PASAPORTE: 'Pasaporte',
    LICENCIA: 'Licencia de Conducir',
  }
  return labels[verification.value?.documentType || ''] || verification.value?.documentType
})

const riskScoreColor = computed(() => {
  const score = verification.value?.riskScore || 0
  if (score >= 50) return 'text-red-600'
  if (score >= 25) return 'text-yellow-600'
  return 'text-green-600'
})

const riskIconColor = computed(() => {
  const level = verification.value?.riskLevel
  if (level === 'ALTO') return 'text-red-500'
  if (level === 'MEDIO') return 'text-yellow-500'
  return 'text-green-500'
})

const availableStatuses = [
  { value: 'APROBADA' as RequestStatus, label: 'Aprobar', class: 'btn-success' },
  { value: 'RECHAZADA' as RequestStatus, label: 'Rechazar', class: 'btn-danger' },
  { value: 'REQUIERE_INFORMACION' as RequestStatus, label: 'Solicitar Info', class: 'btn-secondary' },
  { value: 'PENDIENTE' as RequestStatus, label: 'Pendiente', class: 'btn-secondary' },
]

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function changeStatus(status: RequestStatus) {
  if (!verification.value || verification.value.status === status) return

  isChangingStatus.value = true
  statusError.value = ''

  try {
    await store.updateStatus(verification.value.id, status)
    // refresca el fetch
    await store.fetchVerificationById(props.id)
  } catch (error) {
    statusError.value = error instanceof Error ? error.message : 'Error al cambiar estado'
  } finally {
    isChangingStatus.value = false
  }
}

function loadDetail() {
  store.clearError()
  store.fetchVerificationById(props.id)
}

onMounted(() => {
  loadDetail()
})
</script>
