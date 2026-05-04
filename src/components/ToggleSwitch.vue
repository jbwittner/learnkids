<script setup lang="ts">
const props = defineProps<{ on: boolean; color: string }>()
const emit = defineEmits<{ toggle: [] }>()
</script>

<template>
  <button
    :style="{
      width: '52px',
      height: '28px',
      borderRadius: '99px',
      border: 'none',
      background: props.on ? props.color : '#ddd',
      cursor: 'pointer',
      position: 'relative',
      transition: 'background 0.2s',
      padding: 0,
      flexShrink: 0,
    }"
    @click="emit('toggle')"
  >
    <div
      :style="{
        position: 'absolute',
        top: '3px',
        left: props.on ? '27px' : '3px',
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        background: 'white',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        transition: 'left 0.2s',
      }"
    />
  </button>
</template>
