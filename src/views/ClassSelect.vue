<script setup lang="ts">
import { CLASSES, T, type Classe } from '@/theme'
import { sfx } from '@/sfx'

const emit = defineEmits<{ select: [classe: Classe] }>()

const classInfo: Record<string, { age: string; emoji: string }> = {
  CP: { age: '6 ans', emoji: '🌱' },
  CE1: { age: '7 ans', emoji: '📚' },
  CE2: { age: '8 ans', emoji: '✏️' },
  CM1: { age: '9 ans', emoji: '🔬' },
  CM2: { age: '10 ans', emoji: '🎓' },
}

const onPick = (c: Classe) => {
  sfx.click()
  emit('select', c)
}

const onEnter = (e: MouseEvent) => {
  const t = e.currentTarget as HTMLElement
  t.style.transform = 'translateY(-2px)'
  t.style.borderColor = T.mathColor
  t.style.boxShadow = '0 8px 24px rgba(74,144,217,0.15)'
}
const onLeave = (e: MouseEvent) => {
  const t = e.currentTarget as HTMLElement
  t.style.transform = ''
  t.style.borderColor = '#ede8df'
  t.style.boxShadow = T.shadow
}
</script>

<template>
  <div
    :style="{
      minHeight: '100dvh',
      background: T.bg,
      fontFamily: T.font,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
    }"
  >
    <div :style="{ width: '100%', maxWidth: '480px' }">
      <div :style="{ textAlign: 'center', marginBottom: '2.5rem' }">
        <div :style="{ fontSize: '3.5rem', marginBottom: '0.6rem' }">🏫</div>
        <h1
          :style="{
            fontSize: '2rem',
            fontWeight: 900,
            color: '#222',
            margin: '0 0 0.4rem',
          }"
        >
          LearnKid
        </h1>
        <p :style="{ color: '#999', margin: 0, fontSize: '1rem', fontWeight: 600 }">
          Choisissez votre classe pour commencer
        </p>
      </div>

      <div :style="{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }">
        <button
          v-for="cls in CLASSES"
          :key="cls"
          :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
            background: T.card,
            borderRadius: T.radius,
            border: '2.5px solid #ede8df',
            padding: '1.2rem 1.6rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: T.shadow,
            transition: 'transform 0.12s, box-shadow 0.12s, border-color 0.12s',
          }"
          @click="onPick(cls)"
          @mouseenter="onEnter"
          @mouseleave="onLeave"
        >
          <div
            :style="{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: T.mathLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              flexShrink: 0,
            }"
          >
            {{ classInfo[cls]?.emoji }}
          </div>
          <div :style="{ flex: 1, textAlign: 'left' }">
            <div :style="{ fontWeight: 900, fontSize: '1.25rem', color: '#222' }">{{ cls }}</div>
            <div :style="{ fontSize: '0.88rem', color: '#aaa', fontWeight: 600 }">
              {{ classInfo[cls]?.age }}
            </div>
          </div>
          <div :style="{ fontSize: '1.3rem', color: '#ccc' }">›</div>
        </button>
      </div>
    </div>
  </div>
</template>
