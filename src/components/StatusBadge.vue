<template>
  <span :class="badgeClasses">
    {{ statusLabel }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RequestStatus } from '@/types'

const props = withDefaults(defineProps<{
  status: RequestStatus
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md'
})

const statusLabel = computed(() => {
  const labels: Record<RequestStatus, string> = {
    PENDIENTE: 'Pendiente',
    APROBADA: 'Aprobada',
    RECHAZADA: 'Rechazada',
    REQUIERE_INFORMACION: 'Requiere Info',
  }
  return labels[props.status] || props.status
})

const statusColorClass = computed(() => {
  const colors: Record<RequestStatus, string> = {
    PENDIENTE: 'badge-pending',
    APROBADA: 'badge-approved',
    RECHAZADA: 'badge-rejected',
    REQUIERE_INFORMACION: 'badge-info',
  }
  return colors[props.status] || 'badge-pending'
})

const sizeClass = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  }
  return sizes[props.size] || sizes.md
})

const badgeClasses = computed(() => [
  'badge',
  statusColorClass.value,
  sizeClass.value,
])
</script>
