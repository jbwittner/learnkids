<script setup lang="ts">
import { T } from '@/theme'

const emit = defineEmits<{ press: [key: string] }>()
const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓']
</script>

<template>
  <div
    :style="{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '0.9rem',
      width: '100%',
    }"
  >
    <button
      v-for="k in keys"
      :key="k"
      :style="{
        padding: '1.6rem',
        fontSize: k === '✓' ? '1.8rem' : '2.2rem',
        fontWeight: 900,
        borderRadius: '1.2rem',
        border: 'none',
        background: k === '✓' ? T.mathColor : k === '⌫' ? '#f0f0f0' : T.mathLight,
        color: k === '✓' ? 'white' : k === '⌫' ? '#666' : T.mathColor,
        cursor: 'pointer',
        fontFamily: 'inherit',
        boxShadow: k === '✓' ? `0 4px 0 ${T.mathColor}88` : '0 3px 0 #ccc',
        WebkitTapHighlightColor: 'transparent',
      }"
      @pointerdown="emit('press', k)"
    >
      {{ k }}
    </button>
  </div>
</template>
