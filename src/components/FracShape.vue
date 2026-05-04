<script setup lang="ts">
import { computed } from 'vue'

const FC = '#E07070'
const FE = '#F5E6E6'
const FS = '#C04040'

const props = withDefaults(
  defineProps<{ frac: string; shape: 'circle' | 'rect'; size?: number }>(),
  { size: 80 },
)

const parsed = computed(() => {
  const [n, d] = props.frac.split('/').map(Number)
  return { n: n ?? 0, d: d ?? 1 }
})

const circleSlices = computed(() => {
  const { d, n } = parsed.value
  const cx = props.size / 2
  const cy = props.size / 2
  const r = props.size * 0.42
  return Array.from({ length: d }, (_, i) => {
    const a1 = (i / d) * 2 * Math.PI - Math.PI / 2
    const a2 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2
    const x1 = cx + r * Math.cos(a1)
    const y1 = cy + r * Math.sin(a1)
    const x2 = cx + r * Math.cos(a2)
    const y2 = cy + r * Math.sin(a2)
    const large = a2 - a1 > Math.PI ? 1 : 0
    return {
      d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`,
      fill: i < n ? FC : FE,
    }
  })
})

const rectParts = computed(() => {
  const { d, n } = parsed.value
  const w = props.size * 0.9
  const h = props.size * 0.55
  const ox = props.size * 0.05
  const oy = props.size * 0.22
  const sw = w / d
  return Array.from({ length: d }, (_, i) => ({
    x: ox + i * sw,
    y: oy,
    width: sw,
    height: h,
    fill: i < n ? FC : FE,
  }))
})

const stroke = FS
</script>

<template>
  <svg
    :width="props.size"
    :height="props.size"
    :viewBox="`0 0 ${props.size} ${props.size}`"
  >
    <template v-if="props.shape === 'circle'">
      <path
        v-for="(s, i) in circleSlices"
        :key="i"
        :d="s.d"
        :fill="s.fill"
        :stroke="stroke"
        stroke-width="1.5"
      />
    </template>
    <template v-else>
      <rect
        v-for="(r, i) in rectParts"
        :key="i"
        :x="r.x"
        :y="r.y"
        :width="r.width"
        :height="r.height"
        :fill="r.fill"
        :stroke="stroke"
        stroke-width="1.5"
      />
    </template>
  </svg>
</template>
