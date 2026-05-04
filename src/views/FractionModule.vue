<script setup lang="ts">
import { ref } from 'vue'
import { T } from '@/theme'
import { sfx } from '@/sfx'
import BackBtn from '@/components/BackBtn.vue'
import Btn from '@/components/Btn.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import FracShape from '@/components/FracShape.vue'
import BarFrac from '@/components/BarFrac.vue'
import ResultScreen from './ResultScreen.vue'

type Mode = 'recognize' | 'color' | 'vf'
type Shape = 'circle' | 'rect'

interface RecogQ {
  mode: 'recognize'
  frac: string
  shape: Shape
  opts: string[]
}
interface ColorQ {
  mode: 'color'
  frac: string
  shape: Shape
  barParts: number
  correctFilled: number
}
interface VfQ {
  mode: 'vf'
  frac: string
  shape: Shape
  shownFrac: string
  isTrue: boolean
}
type FracQ = RecogQ | ColorQ | VfQ

const FRAC_LABELS: Record<string, string> = {
  '1/2': 'un demi',
  '1/3': 'un tiers',
  '1/4': 'un quart',
  '2/3': 'deux tiers',
  '2/4': 'deux quarts',
  '3/4': 'trois quarts',
  '3/3': 'trois tiers',
  '4/4': 'quatre quarts',
}
const FRAC_LIST = ['1/2', '1/3', '1/4', '2/3', '3/4']

const parseFrac = (f: string) => {
  const [n, d] = f.split('/').map(Number)
  return { n: n ?? 0, d: d ?? 1 }
}

const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)] as T

function genFracQuestion(): FracQ {
  const frac = pick(FRAC_LIST)
  const shape: Shape = Math.random() < 0.5 ? 'circle' : 'rect'
  const roll = Math.random()
  const mode: Mode = roll < 0.4 ? 'recognize' : roll < 0.7 ? 'color' : 'vf'
  const { n, d } = parseFrac(frac)

  if (mode === 'recognize') {
    const distractors = FRAC_LIST.filter((f) => f !== frac)
    const opts = [frac, ...distractors.sort(() => Math.random() - 0.5).slice(0, 3)].sort(
      () => Math.random() - 0.5,
    )
    return { mode, frac, shape, opts }
  } else if (mode === 'color') {
    return { mode, frac, shape, barParts: d, correctFilled: n }
  } else {
    const fake = Math.random() < 0.5
    let shownFrac = frac
    if (fake) {
      const o = FRAC_LIST.filter((f) => f !== frac)
      shownFrac = pick(o)
    }
    return { mode, frac, shape, shownFrac, isTrue: !fake }
  }
}

const props = defineProps<{ /* unused but keeps signature */ }>()
void props
const emit = defineEmits<{ back: [] }>()

const SESSION = 8
const fracColor = '#C04040'
const fracLight = '#FFF0F0'

const q = ref<FracQ>(genFracQuestion())
const score = ref(0)
const streak = ref(0)
const total = ref(0)
const feedback = ref<'correct' | 'wrong' | null>(null)
const selectedBar = ref(0)
const done = ref(false)

const next = () => {
  q.value = genFracQuestion()
  feedback.value = null
  selectedBar.value = 0
}

const submit = (correct: boolean) => {
  if (feedback.value) return
  feedback.value = correct ? 'correct' : 'wrong'
  if (correct) {
    score.value += 1
    streak.value += 1
  } else {
    streak.value = 0
  }
  total.value += 1
  if (correct) sfx.correct()
  else sfx.wrong()
  if (total.value >= SESSION) setTimeout(() => (done.value = true), 900)
  else setTimeout(next, 900)
}

const onBarToggle = (i: number) => {
  if (!feedback.value) selectedBar.value = i + 1
}

const retry = () => {
  score.value = 0
  streak.value = 0
  total.value = 0
  done.value = false
  feedback.value = null
  q.value = genFracQuestion()
}
</script>

<template>
  <ResultScreen
    v-if="done"
    :score="score"
    :total="SESSION"
    :color="fracColor"
    :light="fracLight"
    @back="emit('back')"
    @retry="retry"
  />
  <div
    v-else
    :style="{
      minHeight: '100dvh',
      background: fracLight,
      fontFamily: T.font,
      display: 'flex',
      flexDirection: 'column',
    }"
  >
    <div
      :style="{
        padding: '1rem 1.5rem',
        background: fracColor,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }"
    >
      <BackBtn @click="emit('back')" />
      <div :style="{ flex: 1, textAlign: 'center', fontWeight: 900 }">
        Fractions — {{ total }}/{{ SESSION }}
      </div>
      <div :style="{ fontWeight: 700, fontSize: '0.9rem' }">{{ score }} pts 🔥{{ streak }}</div>
    </div>
    <div :style="{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '0.8rem 1rem 0' }">
      <ProgressBar :value="total" :max="SESSION" :color="fracColor" />
    </div>
    <div
      :style="{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        gap: '1.5rem',
        position: 'relative',
      }"
    >
      <!-- Recognize -->
      <template v-if="q.mode === 'recognize'">
        <div
          :style="{
            background: T.card,
            borderRadius: T.radius,
            boxShadow: T.shadow,
            padding: '2.5rem 3rem',
            textAlign: 'center',
            width: '100%',
            maxWidth: '560px',
          }"
        >
          <div
            :style="{
              fontSize: '0.85rem',
              color: '#bbb',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '1.2rem',
            }"
          >
            Quelle fraction est représentée ?
          </div>
          <FracShape :frac="q.frac" :shape="q.shape" :size="160" />
        </div>
        <div
          :style="{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.2rem',
            width: '100%',
            maxWidth: '520px',
          }"
        >
          <button
            v-for="opt in q.opts"
            :key="opt"
            :disabled="!!feedback"
            :style="{
              padding: '1.4rem',
              borderRadius: '1.5rem',
              border: `2.5px solid ${feedback ? (opt === q.frac ? T.successColor : '#e0e0e0') : '#e0e0e0'}`,
              background: feedback ? (opt === q.frac ? T.successLight : 'white') : 'white',
              fontFamily: 'inherit',
              fontWeight: 800,
              fontSize: '1.4rem',
              color: opt === q.frac && feedback ? T.successColor : '#333',
              cursor: feedback ? 'default' : 'pointer',
              transition: 'all 0.15s',
            }"
            @click="submit(opt === q.frac)"
          >
            {{ FRAC_LABELS[opt] }}
          </button>
        </div>
      </template>

      <!-- Color -->
      <template v-else-if="q.mode === 'color'">
        <div
          :style="{
            background: T.card,
            borderRadius: T.radius,
            boxShadow: T.shadow,
            padding: '2.5rem 3rem',
            textAlign: 'center',
            width: '100%',
            maxWidth: '560px',
          }"
        >
          <div
            :style="{
              fontSize: '0.85rem',
              color: '#bbb',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '1rem',
            }"
          >
            Colorie la bonne quantité
          </div>
          <div
            :style="{
              fontSize: '2.8rem',
              fontWeight: 900,
              color: fracColor,
              marginBottom: '1.5rem',
            }"
          >
            {{ FRAC_LABELS[q.frac] }}
          </div>
          <div :style="{ display: 'flex', justifyContent: 'center' }">
            <BarFrac
              :parts="q.barParts"
              :filled="feedback ? q.correctFilled : selectedBar"
              :interactive="!feedback"
              :size="80"
              @toggle="onBarToggle"
            />
          </div>
          <div
            v-if="!feedback"
            :style="{ fontSize: '0.9rem', color: '#bbb', marginTop: '0.8rem' }"
          >
            Touche les cases pour colorier
          </div>
        </div>
        <Btn
          v-if="!feedback"
          :color="fracColor"
          :light="fracLight"
          :style="{ fontSize: '1.6rem', padding: '1.4rem 3rem', borderRadius: '2rem' }"
          @click="submit(selectedBar === q.correctFilled)"
        >
          Valider ✓
        </Btn>
      </template>

      <!-- Vrai / Faux -->
      <template v-else-if="q.mode === 'vf'">
        <div
          :style="{
            background: T.card,
            borderRadius: T.radius,
            boxShadow: T.shadow,
            padding: '2.5rem 3rem',
            textAlign: 'center',
            width: '100%',
            maxWidth: '560px',
          }"
        >
          <div
            :style="{
              fontSize: '0.85rem',
              color: '#bbb',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '1.2rem',
            }"
          >
            Vrai ou Faux ?
          </div>
          <FracShape :frac="q.frac" :shape="q.shape" :size="160" />
          <div
            :style="{
              fontSize: '2.2rem',
              fontWeight: 900,
              color: fracColor,
              marginTop: '1.2rem',
            }"
          >
            = {{ FRAC_LABELS[q.shownFrac] }}
          </div>
        </div>
        <div :style="{ display: 'flex', gap: '1.5rem' }">
          <Btn
            :color="T.successColor"
            :light="T.successLight"
            :style="{ fontSize: '1.8rem', padding: '1.6rem 2.8rem', borderRadius: '2rem' }"
            @click="submit(q.isTrue)"
          >
            ✅ Vrai
          </Btn>
          <Btn
            :color="T.warnColor"
            :light="T.warnLight"
            :style="{ fontSize: '1.8rem', padding: '1.6rem 2.8rem', borderRadius: '2rem' }"
            @click="submit(!q.isTrue)"
          >
            ❌ Faux
          </Btn>
        </div>
      </template>

      <div
        v-if="feedback"
        :style="{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: feedback === 'correct' ? T.successColor + '28' : T.warnColor + '28',
          pointerEvents: 'none',
        }"
      >
        <div :style="{ fontSize: '5rem', animation: 'bounce 0.4s ease' }">
          {{ feedback === 'correct' ? '⭐' : '💪' }}
        </div>
      </div>
    </div>
  </div>
</template>
