<script setup lang="ts">
import { computed, ref } from 'vue'
import { T } from '@/theme'
import { sfx } from '@/sfx'
import BackBtn from '@/components/BackBtn.vue'

export type ExerciseId = 'math_ops' | 'math_frac' | 'french'

interface Exercise {
  id: ExerciseId
  icon: string
  label: string
  sub: string
}
interface Family {
  id: string
  icon: string
  label: string
  color: string
  light: string
  exercises: Exercise[]
}

const FAMILIES: Family[] = [
  {
    id: 'math',
    icon: '🧮',
    label: 'Mathématiques',
    color: T.mathColor,
    light: T.mathLight,
    exercises: [
      {
        id: 'math_ops',
        icon: '➕',
        label: 'Tables & Opérations',
        sub: 'Addition, soustraction, multiplication',
      },
      { id: 'math_frac', icon: '🍕', label: 'Fractions', sub: 'Demi, tiers, quart…' },
    ],
  },
  {
    id: 'french',
    icon: '📖',
    label: 'Français',
    color: T.frColor,
    light: T.frLight,
    exercises: [
      { id: 'french', icon: '✏️', label: 'Dictée', sub: 'Dictée parent-enfant avec listes de mots' },
    ],
  },
]

const props = defineProps<{ classe: string }>()
const emit = defineEmits<{ select: [id: ExerciseId]; back: [] }>()

const openFamily = ref<string | null>(null)
const family = computed(() => FAMILIES.find((f) => f.id === openFamily.value) ?? null)

const onSelectExercise = (id: ExerciseId) => {
  sfx.click()
  emit('select', id)
}
const onSelectFamily = (id: string) => {
  sfx.click()
  openFamily.value = id
}

const onCardEnter = (e: MouseEvent, color: string) => {
  const t = e.currentTarget as HTMLElement
  t.style.transform = 'translateY(-2px)'
  t.style.boxShadow = `0 8px 28px ${color}28`
}
const onCardLeave = (e: MouseEvent) => {
  const t = e.currentTarget as HTMLElement
  t.style.transform = ''
  t.style.boxShadow = T.shadow
}
</script>

<template>
  <!-- Family list -->
  <div
    v-if="!family"
    :style="{
      minHeight: '100dvh',
      background: T.bg,
      fontFamily: T.font,
      display: 'flex',
      flexDirection: 'column',
    }"
  >
    <div
      :style="{
        padding: '1.2rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        borderBottom: '1.5px solid #ede8df',
      }"
    >
      <BackBtn @click="emit('back')" />
      <h2
        :style="{
          flex: 1,
          textAlign: 'center',
          fontWeight: 900,
          fontSize: '1.3rem',
          color: '#222',
          margin: 0,
        }"
      >
        Classe {{ props.classe }}
      </h2>
      <div :style="{ width: '80px' }"></div>
    </div>

    <div
      :style="{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.2rem',
        padding: '2rem 1.5rem',
      }"
    >
      <p
        :style="{
          color: '#aaa',
          fontWeight: 700,
          fontSize: '0.95rem',
          margin: '0 0 0.4rem',
          textAlign: 'center',
        }"
      >
        Choisissez une matière
      </p>
      <button
        v-for="f in FAMILIES"
        :key="f.id"
        :style="{
          display: 'flex',
          alignItems: 'center',
          gap: '1.4rem',
          background: T.card,
          borderRadius: T.radius,
          border: `2.5px solid ${f.color}22`,
          padding: '1.8rem 2rem',
          width: '100%',
          maxWidth: '480px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          boxShadow: T.shadow,
          transition: 'transform 0.12s, box-shadow 0.12s',
        }"
        @click="onSelectFamily(f.id)"
        @mouseenter="(e) => onCardEnter(e, f.color)"
        @mouseleave="onCardLeave"
      >
        <div
          :style="{
            width: '64px',
            height: '64px',
            borderRadius: '1.2rem',
            background: f.light,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.2rem',
            flexShrink: 0,
            boxShadow: `0 4px 14px ${f.color}22`,
          }"
        >
          {{ f.icon }}
        </div>
        <div :style="{ flex: 1, textAlign: 'left' }">
          <div :style="{ fontWeight: 900, fontSize: '1.3rem', color: f.color }">{{ f.label }}</div>
          <div
            :style="{
              fontSize: '0.85rem',
              color: '#aaa',
              marginTop: '0.25rem',
              fontWeight: 600,
            }"
          >
            {{ f.exercises.map((e) => e.label).join(' · ') }}
          </div>
        </div>
        <div :style="{ fontSize: '1.5rem', color: f.color, opacity: 0.3 }">›</div>
      </button>
    </div>
  </div>

  <!-- Exercise list inside a family -->
  <div
    v-else
    :style="{
      minHeight: '100dvh',
      background: family.light,
      fontFamily: T.font,
      display: 'flex',
      flexDirection: 'column',
    }"
  >
    <div
      :style="{
        padding: '1.2rem 1.5rem',
        background: family.color,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }"
    >
      <BackBtn @click="openFamily = null" />
      <h2
        :style="{
          flex: 1,
          textAlign: 'center',
          fontWeight: 900,
          fontSize: '1.3rem',
          margin: 0,
        }"
      >
        {{ family.icon }} {{ family.label }}
      </h2>
      <div :style="{ width: '80px' }"></div>
    </div>

    <div
      :style="{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.1rem',
        padding: '2rem 1.5rem',
      }"
    >
      <button
        v-for="ex in family.exercises"
        :key="ex.id"
        :style="{
          display: 'flex',
          alignItems: 'center',
          gap: '1.4rem',
          background: T.card,
          borderRadius: T.radius,
          border: `2.5px solid ${family.color}22`,
          padding: '1.6rem 1.8rem',
          width: '100%',
          maxWidth: '480px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          boxShadow: T.shadow,
          transition: 'transform 0.12s, box-shadow 0.12s',
        }"
        @click="onSelectExercise(ex.id)"
        @mouseenter="(e) => onCardEnter(e, family!.color)"
        @mouseleave="onCardLeave"
      >
        <div
          :style="{
            width: '60px',
            height: '60px',
            borderRadius: '1.1rem',
            background: family.light,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            flexShrink: 0,
            boxShadow: `0 4px 12px ${family.color}20`,
          }"
        >
          {{ ex.icon }}
        </div>
        <div :style="{ flex: 1, textAlign: 'left' }">
          <div :style="{ fontWeight: 900, fontSize: '1.2rem', color: family.color }">
            {{ ex.label }}
          </div>
          <div
            :style="{
              fontSize: '0.85rem',
              color: '#aaa',
              marginTop: '0.2rem',
              fontWeight: 600,
            }"
          >
            {{ ex.sub }}
          </div>
        </div>
        <div :style="{ fontSize: '1.4rem', color: family.color, opacity: 0.35 }">›</div>
      </button>
    </div>
  </div>
</template>
