<template>
  <div>
    <div class="mb-6">
      <router-link to="/verifications" class="text-primary-600 hover:text-primary-800 text-sm flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver a solicitudes
      </router-link>
      <h1 class="text-2xl font-bold text-gray-900 mt-2">Nueva Solicitud de Verificacion</h1>
      <p class="mt-1 text-sm text-gray-600">Ingresa los datos del solicitante para crear una nueva verificacion KYC</p>
    </div>

    <form @submit.prevent="handleSubmit" class="card max-w-2xl">
      <!-- Personal Info -->
      <div class="space-y-6">
        <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Informacion Personal</h3>

        <div>
          <label for="fullName" class="label">Nombre Completo *</label>
          <input
            id="fullName"
            v-model="form.fullName"
            type="text"
            class="input"
            :class="{ 'input-error': errors.fullName }"
            placeholder="Ej: Juan Perez Garcia"
          />
          <p v-if="errors.fullName" class="mt-1 text-sm text-red-600">{{ errors.fullName }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="email" class="label">Correo Electronico *</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="input"
              :class="{ 'input-error': errors.email }"
              placeholder="correo@ejemplo.com"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <label for="phone" class="label">Telefono *</label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="input"
              :class="{ 'input-error': errors.phone }"
              placeholder="+52 55 1234 5678"
            />
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
          </div>
        </div>

        <div>
          <label for="country" class="label">Pais *</label>
          <select
            id="country"
            v-model="form.country"
            class="input"
            :class="{ 'input-error': errors.country }"
          >
            <option value="">Selecciona un pais</option>
            <option v-for="country in countries" :key="country" :value="country">
              {{ country }}
            </option>
          </select>
          <p v-if="errors.country" class="mt-1 text-sm text-red-600">{{ errors.country }}</p>
        </div>
      </div>

      <!-- Document Info -->
      <div class="space-y-6 mt-8">
        <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Informacion del Documento</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="documentType" class="label">Tipo de Documento *</label>
            <select
              id="documentType"
              v-model="form.documentType"
              class="input"
              :class="{ 'input-error': errors.documentType }"
            >
              <option value="">Selecciona tipo</option>
              <option value="INE">INE</option>
              <option value="PASAPORTE">Pasaporte</option>
              <option value="LICENCIA">Licencia de Conducir</option>
            </select>
            <p v-if="errors.documentType" class="mt-1 text-sm text-red-600">{{ errors.documentType }}</p>
          </div>

          <div>
            <label for="documentNumber" class="label">Numero de Documento *</label>
            <input
              id="documentNumber"
              v-model="form.documentNumber"
              type="text"
              class="input"
              :class="{ 'input-error': errors.documentNumber }"
              placeholder="Ej: 1234567890123"
            />
            <p v-if="errors.documentNumber" class="mt-1 text-sm text-red-600">{{ errors.documentNumber }}</p>
          </div>
        </div>

        <div>
          <label for="imageUrl" class="label">URL de Imagen (Documento o Selfie)</label>
          <input
            id="imageUrl"
            v-model="form.imageUrl"
            type="url"
            class="input"
            :class="{ 'input-error': errors.imageUrl }"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          <p class="mt-1 text-xs text-gray-500">Proporciona una URL de imagen del documento de identidad o selfie</p>
          <p v-if="errors.imageUrl" class="mt-1 text-sm text-red-600">{{ errors.imageUrl }}</p>
        </div>
      </div>

      <!-- Submit -->
      <div class="mt-8 flex justify-end space-x-4">
        <router-link to="/verifications" class="btn btn-secondary">
          Cancelar
        </router-link>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="btn btn-primary"
        >
          <span v-if="isSubmitting">Creando...</span>
          <span v-else>Crear Solicitud</span>
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="submitError" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700">{{ submitError }}</p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useVerificationStore } from '@/stores/verification'
import type { CreateVerificationInput, DocumentType } from '@/types'

const router = useRouter()
const store = useVerificationStore()
const toast = useToast()

const countries = [
  'Mexico',
  'Estados Unidos',
  'Canada',
  'Espana',
  'Argentina',
  'Colombia',
  'Chile',
  'Peru',
  'Brasil',
  'Venezuela',
  'Cuba',
]

const form = reactive<CreateVerificationInput>({
  fullName: '',
  email: '',
  phone: '',
  country: '',
  documentType: '' as DocumentType,
  documentNumber: '',
  imageUrl: '',
})

const errors = reactive<Record<string, string>>({})
const isSubmitting = ref(false)
const submitError = ref('')

function validateForm(): boolean {
 //limpia errores
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  let isValid = true

  if (!form.fullName || form.fullName.length < 2) {
    errors.fullName = 'El nombre debe tener al menos 2 caracteres'
    isValid = false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email || !emailRegex.test(form.email)) {
    errors.email = 'Ingresa un correo electronico valido'
    isValid = false
  }

  const phoneRegex = /^[\d\s\-+()]{10,}$/
  if (!form.phone || !phoneRegex.test(form.phone)) {
    errors.phone = 'Ingresa un telefono valido (minimo 10 digitos)'
    isValid = false
  }

  if (!form.country) {
    errors.country = 'Selecciona un pais'
    isValid = false
  }

  if (!form.documentType) {
    errors.documentType = 'Selecciona un tipo de documento'
    isValid = false
  }

  if (!form.documentNumber || form.documentNumber.length < 5) {
    errors.documentNumber = 'El numero de documento debe tener al menos 5 caracteres'
    isValid = false
  }

  if (form.imageUrl && !isValidUrl(form.imageUrl)) {
    errors.imageUrl = 'Ingresa una URL valida'
    isValid = false
  }

  return isValid
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

async function handleSubmit() {
  submitError.value = ''

  if (!validateForm()) {
    toast.error('Por favor corrige los errores en el formulario')
    return
  }

  isSubmitting.value = true

  try {
    const data: CreateVerificationInput = {
      ...form,
      imageUrl: form.imageUrl || null,
    }

    await store.createVerification(data)
    toast.success('Solicitud creada exitosamente')
    router.push('/verifications')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error al crear la solicitud'
    submitError.value = errorMessage
    toast.error(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}
</script>
