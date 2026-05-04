<script setup lang="ts">
import { computed } from 'vue'
import { T } from '@/theme'
import Btn from '@/components/Btn.vue'
import ProgressBar from '@/components/ProgressBar.vue'

const props = defineProps<{
  score: number
  total: number
  color: string
  light: string
}>()
const emit = defineEmits<{ back: []; retry: [] }>()

const pct = computed(() => Math.round((props.score / props.total) * 100))
const stars = computed(() =>
  pct.value >= 90 ? 3 : pct.value >= 60 ? 2 : pct.value >= 30 ? 1 : 0,
)
const msgs = ['Continue comme ça ! 💪', 'Bien joué ! 🎉', 'Super travail ! 🌟', 'Parfait ! 🏆']
const emojis = ['😊', '⭐', '⭐⭐', '⭐⭐⭐']
</script>

<template>
  <div
    :style="{
      minHeight: '100dvh',
      background: props.light,
      fontFamily: T.font,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }"
  >
    <div :style="{ textAlign: 'center', maxWidth: '380px', width: '100%' }">
      <div :style="{ fontSize: '4rem', marginBottom: '0.5rem' }">{{ emojis[stars] }}</div>
      <h2
        :style="{
          fontSize: '1.8rem',
          fontWeight: 900,
          color: props.color,
          margin: '0 0 1.5rem',
        }"
      >
        {{ msgs[stars] }}
      </h2>
      <div
        :style="{
          background: T.card,
          borderRadius: T.radius,
          boxShadow: T.shadow,
          padding: '2rem',
          marginBottom: '2rem',
        }"
      >
        <div :style="{ fontSize: '4rem', fontWeight: 900, color: props.color }">
          {{ props.score }}<span :style="{ fontSize: '1.5rem', color: '#aaa' }"
            >/{{ props.total }}</span
          >
        </div>
        <div
          :style="{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#333',
            marginBottom: '1rem',
          }"
        >
          {{ pct }}%
        </div>
        <ProgressBar :value="props.score" :max="props.total" :color="props.color" />
      </div>
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }">
        <Btn
          :color="props.color"
          :light="props.light"
          :style="{ fontSize: '1.2rem', width: '100%', justifyContent: 'center' }"
          @click="emit('retry')"
          >🔁 Rejouer</Btn
        >
        <Btn
          color="#888"
          light="#f0f0f0"
          variant="outline"
          :style="{ fontSize: '1.1rem', width: '100%', justifyContent: 'center' }"
          @click="emit('back')"
          >Retour au menu</Btn
        >
      </div>
    </div>
  </div>
</template>
