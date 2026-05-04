<script setup lang="ts">
import { sfx } from '@/sfx'
const emit = defineEmits<{ click: [] }>()
const onClick = () => {
  sfx.click()
  emit('click')
}
</script>

<template>
  <button
    :style="{
      background: 'rgba(0,0,0,0.06)',
      border: 'none',
      borderRadius: '1rem',
      padding: '0.6rem 1.2rem',
      fontFamily: 'inherit',
      fontSize: '1rem',
      fontWeight: 700,
      cursor: 'pointer',
      color: '#555',
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
    }"
    @click="onClick"
  >
    ← Retour
  </button>
</template>
