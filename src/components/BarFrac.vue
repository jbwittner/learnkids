<script setup lang="ts">
import { computed } from 'vue'

const FC = '#E07070'
const FE = '#F5E6E6'
const FS = '#C04040'

const props = withDefaults(
  defineProps<{ parts: number; filled: number; interactive?: boolean; size?: number }>(),
  { interactive: false, size: 44 },
)

const emit = defineEmits<{ toggle: [index: number] }>()

const totalW = computed(() => props.parts * props.size)
const h = computed(() => props.size * 0.7)

const cells = computed(() =>
  Array.from({ length: props.parts }, (_, i) => ({
    x: i * props.size + 1,
    fill: i < props.filled ? FC : FE,
  })),
)
</script>

<template>
  <svg
    :width="totalW"
    :height="h + 4"
    :viewBox="`0 0 ${totalW} ${h + 4}`"
  >
    <rect
      v-for="(c, i) in cells"
      :key="i"
      :x="c.x"
      :y="2"
      :width="props.size - 2"
      :height="h"
      :fill="c.fill"
      :stroke="FS"
      stroke-width="1.5"
      rx="3"
      :style="{ cursor: props.interactive ? 'pointer' : 'default' }"
      @click="props.interactive && emit('toggle', i)"
    />
  </svg>
</template>
