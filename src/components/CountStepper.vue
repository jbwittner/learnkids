<script setup lang="ts">
const props = defineProps<{
  value: number
  min: number
  max: number
  color: string
  light: string
}>()
const emit = defineEmits<{ change: [value: number] }>()

const btnStyle = {
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  background: props.light,
  fontSize: '1.4rem',
  fontWeight: 900,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
</script>

<template>
  <div :style="{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }">
    <button
      :style="{ ...btnStyle, border: `2.5px solid ${props.color}40`, color: props.color }"
      @click="emit('change', Math.max(props.min, props.value - 1))"
    >
      −
    </button>
    <div
      :style="{
        fontSize: '2.6rem',
        fontWeight: 900,
        color: props.color,
        minWidth: '52px',
        textAlign: 'center',
      }"
    >
      {{ props.value }}
    </div>
    <button
      :style="{ ...btnStyle, border: `2.5px solid ${props.color}40`, color: props.color }"
      @click="emit('change', Math.min(props.max, props.value + 1))"
    >
      +
    </button>
  </div>
</template>
