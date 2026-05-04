<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { T } from '@/theme'

const props = defineProps<{ duration: number; running: boolean }>()

const elapsed = ref(0)
let intervalId: ReturnType<typeof setInterval> | null = null

const stop = () => {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
}

watch(
  () => [props.running, props.duration],
  () => {
    elapsed.value = 0
    stop()
    if (props.running) {
      intervalId = setInterval(() => {
        elapsed.value += 0.1
      }, 100)
    }
  },
  { immediate: true },
)

onBeforeUnmount(stop)

const pct = computed(() => Math.min((elapsed.value / props.duration) * 100, 100))
const secs = computed(() => Math.floor(elapsed.value))
const urgent = computed(() => elapsed.value >= props.duration * 0.75)
const C = 2 * Math.PI * 20
</script>

<template>
  <div
    :style="{
      display: 'flex',
      alignItems: 'center',
      gap: '0.7rem',
      width: '100%',
      maxWidth: '400px',
    }"
  >
    <div :style="{ position: 'relative', width: '48px', height: '48px', flexShrink: 0 }">
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="20" fill="none" stroke="#e0e8f4" stroke-width="4" />
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          :stroke="urgent ? T.warnColor : T.mathColor"
          stroke-width="4"
          :stroke-dasharray="C"
          :stroke-dashoffset="C * (1 - pct / 100)"
          stroke-linecap="round"
          transform="rotate(-90 24 24)"
          :style="{ transition: 'stroke-dashoffset 0.1s linear, stroke 0.3s' }"
        />
      </svg>
      <div
        :style="{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.85rem',
          fontWeight: 900,
          color: urgent ? T.warnColor : T.mathColor,
          transition: 'color 0.3s',
        }"
      >
        {{ secs }}s
      </div>
    </div>
    <div
      :style="{
        flex: 1,
        height: '8px',
        background: '#e0e8f4',
        borderRadius: '99px',
        overflow: 'hidden',
      }"
    >
      <div
        :style="{
          height: '100%',
          borderRadius: '99px',
          width: `${pct}%`,
          background: urgent ? T.warnColor : T.mathColor,
          transition: 'width 0.1s linear, background 0.3s',
        }"
      />
    </div>
  </div>
</template>
