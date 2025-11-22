<template>
  <span :class="badgeClasses" :title="`Score: ${score}`">
    {{ riskLabel }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RiskLevel } from '@/types'

const props = withDefaults(defineProps<{
  level: RiskLevel
  score: number
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md'
})

const riskLabel = computed(() => {
  const labels: Record<RiskLevel, string> = {
    BAJO: 'Bajo',
    MEDIO: 'Medio',
    ALTO: 'Alto',
  }
  return labels[props.level] || props.level
})

const riskColorClass = computed(() => {
  const colors: Record<RiskLevel, string> = {
    BAJO: 'badge-low',
    MEDIO: 'badge-medium',
    ALTO: 'badge-high',
  }
  return colors[props.level] || 'badge-low'
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
  riskColorClass.value,
  sizeClass.value,
])
</script>
