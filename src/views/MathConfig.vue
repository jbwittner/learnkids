<script setup lang="ts">
import { ref } from 'vue'
import { T } from '@/theme'
import { sfx } from '@/sfx'
import BackBtn from '@/components/BackBtn.vue'
import Btn from '@/components/Btn.vue'
import SectionLabel from '@/components/SectionLabel.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import CountStepper from '@/components/CountStepper.vue'
import PresetRow from '@/components/PresetRow.vue'

export type Op = 'add' | 'sub' | 'mul'
export interface MathSettings {
  tables: number[]
  ops: Op[]
  opCount: number
  timerOn: boolean
  timerSecs: number
}

const emit = defineEmits<{ start: [settings: MathSettings]; back: [] }>()

const OP_LABELS: Record<Op, string> = {
  add: 'Addition +',
  sub: 'Soustraction −',
  mul: 'Multiplication ×',
}
const OP_SYMBOLS: Record<Op, string> = { add: '+', sub: '−', mul: '×' }
const COUNT_PRESETS = [5, 10, 15, 20]
const TIMER_PRESETS = [30, 60, 90, 120]

const tables = ref<Set<number>>(new Set([1, 2, 3, 4, 5]))
const ops = ref<Set<Op>>(new Set(['add']))
const opCount = ref(10)
const timerOn = ref(false)
const timerSecs = ref(60)

const opColors: Record<Op, string> = { add: T.mathColor, sub: T.warnColor, mul: T.frColor }
const opLights: Record<Op, string> = { add: T.mathLight, sub: T.warnLight, mul: T.frLight }

const tableNumbers = Array.from({ length: 10 }, (_, i) => i + 1)
const opList: Op[] = ['add', 'sub', 'mul']

const toggleTable = (n: number) => {
  const next = new Set(tables.value)
  if (next.has(n)) {
    if (next.size > 1) next.delete(n)
  } else next.add(n)
  tables.value = next
}
const toggleOp = (op: Op) => {
  const next = new Set(ops.value)
  if (next.has(op)) {
    if (next.size > 1) next.delete(op)
  } else next.add(op)
  ops.value = next
}

const fmtSecs = (s: number) => (s >= 60 ? `${s / 60} min` : `${s}s`)

const onStart = () => {
  sfx.click()
  emit('start', {
    tables: [...tables.value].sort((a, b) => a - b),
    ops: [...ops.value],
    opCount: opCount.value,
    timerOn: timerOn.value,
    timerSecs: timerSecs.value,
  })
}

const sortedTables = () => [...tables.value].sort((a, b) => a - b).join(', ')
</script>

<template>
  <div
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
        background: T.mathColor,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }"
    >
      <BackBtn @click="emit('back')" />
      <h2
        :style="{
          flex: 1,
          textAlign: 'center',
          fontWeight: 900,
          fontSize: '1.2rem',
          margin: 0,
        }"
      >
        ⚙️ Paramètres
      </h2>
      <div :style="{ width: '80px' }"></div>
    </div>

    <div
      :style="{
        flex: 1,
        padding: '1.5rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.2rem',
      }"
    >
      <!-- Opérations -->
      <div
        :style="{
          background: T.card,
          borderRadius: T.radius,
          boxShadow: T.shadow,
          padding: '1.5rem',
          width: '100%',
          maxWidth: '460px',
        }"
      >
        <SectionLabel>Opérations</SectionLabel>
        <div :style="{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }">
          <button
            v-for="op in opList"
            :key="op"
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.9rem 1.2rem',
              borderRadius: '1rem',
              border: `2.5px solid ${ops.has(op) ? opColors[op] : '#e8e8e8'}`,
              background: ops.has(op) ? opLights[op] : 'white',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }"
            @click="toggleOp(op)"
          >
            <div
              :style="{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                flexShrink: 0,
                background: ops.has(op) ? opColors[op] : '#f0f0f0',
                color: ops.has(op) ? 'white' : '#ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                fontWeight: 900,
                transition: 'all 0.15s',
              }"
            >
              {{ OP_SYMBOLS[op] }}
            </div>
            <span
              :style="{
                fontWeight: 800,
                fontSize: '1.05rem',
                color: ops.has(op) ? opColors[op] : '#aaa',
              }"
              >{{ OP_LABELS[op] }}</span
            >
            <span v-if="ops.has(op)" :style="{ marginLeft: 'auto', color: opColors[op] }">✓</span>
          </button>
        </div>
      </div>

      <!-- Tables -->
      <div
        :style="{
          background: T.card,
          borderRadius: T.radius,
          boxShadow: T.shadow,
          padding: '1.5rem',
          width: '100%',
          maxWidth: '460px',
        }"
      >
        <SectionLabel>Tables / Nombres</SectionLabel>
        <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.7rem' }">
          <button
            v-for="n in tableNumbers"
            :key="n"
            :style="{
              padding: '0.9rem 0',
              borderRadius: '1rem',
              border: `2.5px solid ${tables.has(n) ? T.mathColor : '#e0e0e0'}`,
              background: tables.has(n) ? T.mathLight : 'white',
              fontFamily: 'inherit',
              fontSize: '1.2rem',
              fontWeight: 900,
              color: tables.has(n) ? T.mathColor : '#ccc',
              cursor: 'pointer',
              transition: 'all 0.12s',
            }"
            @click="toggleTable(n)"
          >
            {{ n }}
          </button>
        </div>
        <div :style="{ marginTop: '0.8rem', fontSize: '0.85rem', color: '#aaa' }">
          Sélectionnées : {{ sortedTables() }}
        </div>
      </div>

      <!-- Nombre d'opérations -->
      <div
        :style="{
          background: T.card,
          borderRadius: T.radius,
          boxShadow: T.shadow,
          padding: '1.5rem',
          width: '100%',
          maxWidth: '460px',
        }"
      >
        <SectionLabel>Nombre d'opérations</SectionLabel>
        <CountStepper
          :value="opCount"
          :min="3"
          :max="50"
          :color="T.mathColor"
          :light="T.mathLight"
          @change="opCount = $event"
        />
        <PresetRow
          :presets="COUNT_PRESETS"
          :value="opCount"
          :color="T.mathColor"
          :light="T.mathLight"
          @select="opCount = $event"
        />
      </div>

      <!-- Chrono -->
      <div
        :style="{
          background: T.card,
          borderRadius: T.radius,
          boxShadow: T.shadow,
          padding: '1.5rem',
          width: '100%',
          maxWidth: '460px',
        }"
      >
        <div
          :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            marginBottom: timerOn ? '1.2rem' : 0,
          }"
        >
          <SectionLabel>⏱ Chronomètre</SectionLabel>
          <div :style="{ marginLeft: 'auto', marginBottom: '1rem' }">
            <ToggleSwitch :on="timerOn" :color="T.mathColor" @toggle="timerOn = !timerOn" />
          </div>
        </div>
        <template v-if="timerOn">
          <CountStepper
            :value="timerSecs"
            :min="10"
            :max="300"
            :color="T.mathColor"
            :light="T.mathLight"
            @change="timerSecs = $event"
          />
          <PresetRow
            :presets="TIMER_PRESETS"
            :value="timerSecs"
            :color="T.mathColor"
            :light="T.mathLight"
            :format="fmtSecs"
            @select="timerSecs = $event"
          />
          <div
            :style="{
              marginTop: '0.8rem',
              fontSize: '0.85rem',
              color: '#aaa',
              textAlign: 'center',
            }"
          >
            Indicatif — repart à zéro à chaque question
          </div>
        </template>
        <div v-else :style="{ fontSize: '0.88rem', color: '#ccc', fontWeight: 600 }">
          Désactivé — la session dure {{ opCount }} opérations
        </div>
      </div>

      <Btn
        :color="T.mathColor"
        :light="T.mathLight"
        :style="{ fontSize: '1.3rem', padding: '1.1rem 3rem', borderRadius: '2rem' }"
        @click="onStart"
      >
        ▶ Commencer !
      </Btn>
    </div>
  </div>
</template>
