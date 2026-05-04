<script setup lang="ts">
const props = defineProps<{
  presets: number[]
  value: number
  color: string
  light: string
  format?: (n: number) => string
}>()
const emit = defineEmits<{ select: [value: number] }>()
</script>

<template>
  <div
    :style="{
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: '0.8rem',
    }"
  >
    <button
      v-for="p in props.presets"
      :key="p"
      :style="{
        padding: '0.35rem 0.9rem',
        borderRadius: '99px',
        border: `2px solid ${props.value === p ? props.color : '#ddd'}`,
        background: props.value === p ? props.light : 'white',
        color: props.value === p ? props.color : '#aaa',
        fontFamily: 'inherit',
        fontWeight: 700,
        fontSize: '0.88rem',
        cursor: 'pointer',
      }"
      @click="emit('select', p)"
    >
      {{ props.format ? props.format(p) : p }}
    </button>
  </div>
</template>
