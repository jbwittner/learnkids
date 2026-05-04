<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { T } from '@/theme'
import { sfx } from '@/sfx'
import BackBtn from '@/components/BackBtn.vue'
import Btn from '@/components/Btn.vue'
import NumPad from '@/components/NumPad.vue'
import QuestionTimer from '@/components/QuestionTimer.vue'
import ResultScreen from './ResultScreen.vue'
import type { MathSettings } from './MathConfig.vue'

type Mode = 'qcm' | 'vf' | 'numpad'
interface Question {
  a: number
  b: number
  correct: number
  symbol: string
}

const props = defineProps<{ mathSettings: MathSettings }>()
const emit = defineEmits<{ back: [] }>()

const SESSION = computed(() => props.mathSettings.opCount)

const question = ref<Question | null>(null)
const mode = ref<Mode | null>(null)
const answer = ref('')
// QCM options (numbers); VF stores [shownValue, isFake]
const qcmOptions = ref<number[]>([])
const vfShown = ref(0)
const vfFake = ref(false)
const feedback = ref<'correct' | 'wrong' | null>(null)
const score = ref(0)
const streak = ref(0)
const total = ref(0)
const sessionDone = ref(false)
const questionKey = ref(0)

const pickFrom = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)] as T

const genQuestion = () => {
  const { tables, ops } = props.mathSettings
  const op = pickFrom(ops)
  let a: number, b: number, correct: number, symbol: string
  if (op === 'add') {
    a = pickFrom(tables)
    b = Math.floor(Math.random() * 10) + 1
    correct = a + b
    symbol = '+'
  } else if (op === 'sub') {
    a = pickFrom(tables)
    b = Math.floor(Math.random() * a) + 1
    correct = a - b
    symbol = '−'
  } else {
    a = pickFrom(tables)
    b = Math.floor(Math.random() * 10) + 1
    correct = a * b
    symbol = '×'
  }
  const m: Mode = pickFrom(['qcm', 'vf', 'numpad'] as const)
  mode.value = m
  question.value = { a, b, correct, symbol }
  answer.value = ''
  feedback.value = null
  questionKey.value += 1

  if (m === 'qcm') {
    const opts = new Set<number>([correct])
    while (opts.size < 4) {
      const v = correct + Math.floor(Math.random() * 7) - 3
      if (v >= 0 && v !== correct) opts.add(v)
    }
    qcmOptions.value = [...opts].sort(() => Math.random() - 0.5)
  } else if (m === 'vf') {
    const fake = Math.random() < 0.5
    let shown = correct
    if (fake) {
      let d = Math.floor(Math.random() * 4) + 1
      shown = correct + (Math.random() < 0.5 ? d : -d)
      if (shown < 0) shown = correct + d
    }
    vfShown.value = shown
    vfFake.value = fake
  }
}

watch(() => props.mathSettings, genQuestion, { immediate: true })

const submit = (ans: number | string) => {
  if (feedback.value) return
  const q = question.value
  if (!q) return
  let isCorrect = false
  if (mode.value === 'qcm') isCorrect = ans === q.correct
  else if (mode.value === 'vf') isCorrect = (ans === 'vrai') === !vfFake.value
  else isCorrect = parseInt(String(ans), 10) === q.correct

  feedback.value = isCorrect ? 'correct' : 'wrong'
  if (isCorrect) {
    score.value += 1
    streak.value += 1
  } else {
    streak.value = 0
  }
  total.value += 1
  if (isCorrect) sfx.correct()
  else sfx.wrong()
  if (total.value >= SESSION.value) {
    setTimeout(() => {
      sfx.complete()
      sessionDone.value = true
    }, 1000)
  } else {
    setTimeout(() => genQuestion(), 1000)
  }
}

const onNumPress = (v: string) => {
  if (v === '⌫') answer.value = answer.value.slice(0, -1)
  else if (v === '✓') {
    if (answer.value) submit(answer.value)
  } else answer.value = (answer.value + v).slice(0, 3)
}

const retry = () => {
  score.value = 0
  streak.value = 0
  total.value = 0
  sessionDone.value = false
  genQuestion()
}
</script>

<template>
  <ResultScreen
    v-if="sessionDone"
    :score="score"
    :total="SESSION"
    :color="T.mathColor"
    :light="T.mathLight"
    @back="emit('back')"
    @retry="retry"
  />
  <div
    v-else-if="question && mode"
    :style="{
      minHeight: '100dvh',
      background: T.mathLight,
      fontFamily: T.font,
      display: 'flex',
      flexDirection: 'column',
    }"
  >
    <!-- Header -->
    <div
      :style="{
        padding: '1rem 1.5rem',
        background: T.mathColor,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }"
    >
      <BackBtn @click="emit('back')" />
      <div
        :style="{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
        }"
      >
        <span :style="{ fontSize: '1.5rem', fontWeight: 900 }">{{ total + 1 }}</span>
        <span :style="{ fontSize: '1rem', opacity: 0.6, fontWeight: 700 }">/ {{ SESSION }}</span>
      </div>
      <div :style="{ fontWeight: 700, fontSize: '0.9rem' }">🔥{{ streak }}</div>
    </div>

    <!-- Progress bar -->
    <div :style="{ height: '5px', background: 'rgba(255,255,255,0.3)' }">
      <div
        :style="{
          height: '100%',
          width: `${Math.round((total / SESSION) * 100)}%`,
          background: 'white',
          transition: 'width 0.4s ease',
        }"
      />
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
      <!-- Per-question timer -->
      <QuestionTimer
        v-if="mathSettings.timerOn"
        :key="questionKey"
        :duration="mathSettings.timerSecs"
        :running="!feedback"
      />

      <!-- Question card -->
      <div
        :style="{
          background: T.card,
          borderRadius: T.radius,
          boxShadow: T.shadow,
          padding: '2.5rem 4rem',
          textAlign: 'center',
          width: '100%',
          maxWidth: '560px',
        }"
      >
        <template v-if="mode === 'vf'">
          <div
            :style="{
              fontSize: '0.85rem',
              color: '#bbb',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.8rem',
            }"
          >
            Vrai ou Faux ?
          </div>
          <div :style="{ fontSize: '3.5rem', fontWeight: 900, color: '#222', lineHeight: 1.2 }">
            {{ question.a }} {{ question.symbol }} {{ question.b }} = {{ vfShown }}
          </div>
        </template>
        <div
          v-else
          :style="{ fontSize: '3.5rem', fontWeight: 900, color: '#222', lineHeight: 1.2 }"
        >
          {{ question.a }} {{ question.symbol }} {{ question.b }} = ?
        </div>
      </div>

      <!-- QCM -->
      <div
        v-if="mode === 'qcm'"
        :style="{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.2rem',
          width: '100%',
          maxWidth: '520px',
        }"
      >
        <button
          v-for="o in qcmOptions"
          :key="o"
          :disabled="!!feedback"
          :style="{
            padding: '1.6rem',
            borderRadius: '1.5rem',
            fontFamily: 'inherit',
            fontWeight: 900,
            fontSize: '2.2rem',
            border: `2.5px solid ${feedback ? (o === question.correct ? T.successColor : '#e0e0e0') : T.mathColor + '40'}`,
            background: feedback
              ? o === question.correct
                ? T.successLight
                : 'white'
              : T.mathLight,
            color: feedback ? (o === question.correct ? T.successColor : '#aaa') : T.mathColor,
            cursor: feedback ? 'default' : 'pointer',
            transition: 'all 0.15s',
          }"
          @click="submit(o)"
        >
          {{ o }}
        </button>
      </div>

      <!-- Vrai / Faux -->
      <div v-if="mode === 'vf'" :style="{ display: 'flex', gap: '1.5rem' }">
        <Btn
          :color="T.successColor"
          :light="T.successLight"
          :style="{
            fontSize: '1.8rem',
            padding: '1.6rem 3rem',
            borderRadius: '2rem',
            minWidth: '160px',
          }"
          @click="submit('vrai')"
          >✅ Vrai</Btn
        >
        <Btn
          :color="T.warnColor"
          :light="T.warnLight"
          :style="{
            fontSize: '1.8rem',
            padding: '1.6rem 3rem',
            borderRadius: '2rem',
            minWidth: '160px',
          }"
          @click="submit('faux')"
          >❌ Faux</Btn
        >
      </div>

      <!-- Numpad -->
      <div
        v-if="mode === 'numpad'"
        :style="{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.2rem',
          width: '100%',
          maxWidth: '440px',
        }"
      >
        <div
          :style="{
            background: T.card,
            borderRadius: '1.2rem',
            padding: '1rem 2rem',
            fontSize: '3.2rem',
            fontWeight: 900,
            color: '#222',
            minWidth: '160px',
            textAlign: 'center',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)',
            minHeight: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }"
        >
          <span v-if="answer">{{ answer }}</span>
          <span v-else :style="{ color: '#ccc' }">?</span>
        </div>
        <NumPad @press="onNumPress" />
      </div>

      <!-- Feedback overlay -->
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
