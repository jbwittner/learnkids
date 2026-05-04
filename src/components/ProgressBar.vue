<script setup lang="ts">
const props = defineProps<{ value: number; max: number; color: string }>()
</script>

<template>
  <div :style="{ background: '#e8e8e8', borderRadius: '99px', height: '10px', overflow: 'hidden' }">
    <div
      :style="{
        width: `${Math.round((props.value / props.max) * 100)}%`,
        background: props.color,
        height: '100%',
        borderRadius: '99px',
        transition: 'width 0.4s ease',
      }"
    />
  </div>
</template>
