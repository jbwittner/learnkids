<script setup lang="ts">
import { computed, ref } from 'vue'
import { T } from '@/theme'
import { sfx } from '@/sfx'
import BackBtn from '@/components/BackBtn.vue'
import Btn from '@/components/Btn.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import ResultScreen from './ResultScreen.vue'
import wordData from '@/data/words.json'

interface WordList {
  id: string
  name: string
  words: string[]
}
type Phase = 'select' | 'configure' | 'dictate' | 'correct' | 'results'
interface Correction {
  word: string
  result: 'correct' | 'wrong' | null
}

const props = defineProps<{ classe: string }>()
const emit = defineEmits<{ back: [] }>()

const data = wordData as Record<string, { listes: WordList[] }>

const phase = ref<Phase>('select')
const selectedListIds = ref<Set<string>>(new Set())
const wordCount = ref(10)
const activeWords = ref<string[]>([])
const wordIndex = ref(0)
const corrections = ref<Correction[]>([])
const showWord = ref(true)

const classeLists = computed<WordList[]>(() => data[props.classe]?.listes ?? [])

const toggleList = (id: string) => {
  sfx.click()
  const next = new Set(selectedListIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedListIds.value = next
}

const selectedLists = computed(() =>
  classeLists.value.filter((l) => selectedListIds.value.has(l.id)),
)
const pool = computed(() => selectedLists.value.flatMap((l) => l.words))

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5)

const startDictation = (words: string[]) => {
  activeWords.value = words
  wordIndex.value = 0
  corrections.value = []
  showWord.value = true
  phase.value = 'dictate'
}

const handleStart = () => {
  sfx.click()
  if (selectedListIds.value.size === 0) return
  if (pool.value.length <= 15 || selectedListIds.value.size === 1) {
    const count = Math.min(wordCount.value, pool.value.length)
    startDictation(shuffle(pool.value).slice(0, count))
  } else {
    phase.value = 'configure'
  }
}

const score = computed(() => corrections.value.filter((c) => c.result === 'correct').length)
const allMarked = computed(() => corrections.value.every((c) => c.result !== null))

const markCorrection = (i: number, result: 'correct' | 'wrong') => {
  sfx.click()
  corrections.value = corrections.value.map((x, j) => (j === i ? { ...x, result } : x))
}

const presetSizes = (max: number) => [5, 10, 15, 20].filter((n) => n <= max)
</script>

<template>
  <!-- SELECT -->
  <div
    v-if="phase === 'select'"
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
        background: T.frColor,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }"
    >
      <BackBtn @click="emit('back')" />
      <h2
        :style="{ flex: 1, textAlign: 'center', fontWeight: 900, fontSize: '1.2rem', margin: 0 }"
      >
        ✏️ Choisir les listes — {{ props.classe }}
      </h2>
      <div :style="{ width: '80px' }"></div>
    </div>

    <div
      :style="{
        flex: 1,
        padding: '1rem 1.5rem',
        overflowY: 'auto',
        paddingBottom: selectedListIds.size > 0 ? '7rem' : '1.5rem',
      }"
    >
      <p
        :style="{
          color: '#aaa',
          fontWeight: 700,
          fontSize: '0.9rem',
          textAlign: 'center',
          margin: '0 0 1rem',
        }"
      >
        Sélectionnez une ou plusieurs listes
      </p>
      <div
        :style="{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '500px',
          margin: '0 auto',
        }"
      >
        <div
          v-for="list in classeLists"
          :key="list.id"
          :style="{
            background: selectedListIds.has(list.id) ? T.frLight : T.card,
            border: `2.5px solid ${selectedListIds.has(list.id) ? T.frColor : '#e8e8e8'}`,
            borderRadius: '1.2rem',
            padding: '1rem 1.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.9rem',
            boxShadow: selectedListIds.has(list.id) ? `0 4px 16px ${T.frColor}20` : T.shadow,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }"
          @click="toggleList(list.id)"
        >
          <div
            :style="{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              flexShrink: 0,
              border: `2.5px solid ${selectedListIds.has(list.id) ? T.frColor : '#ccc'}`,
              background: selectedListIds.has(list.id) ? T.frColor : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 900,
              transition: 'all 0.15s',
            }"
          >
            {{ selectedListIds.has(list.id) ? '✓' : '' }}
          </div>
          <div :style="{ flex: 1 }">
            <div
              :style="{
                fontWeight: 800,
                fontSize: '1.05rem',
                color: selectedListIds.has(list.id) ? T.frColor : '#222',
              }"
            >
              {{ list.name }}
            </div>
            <div :style="{ fontSize: '0.82rem', color: '#aaa', marginTop: '0.1rem' }">
              {{ list.words.length }} mots · {{ list.words.slice(0, 4).join(', ')
              }}{{ list.words.length > 4 ? '…' : '' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="selectedListIds.size > 0"
      :style="{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        borderTop: `2px solid ${T.frColor}18`,
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.07)',
      }"
    >
      <div :style="{ flex: 1 }">
        <div :style="{ fontWeight: 800, color: T.frColor }">
          {{ selectedListIds.size }} liste{{ selectedListIds.size > 1 ? 's' : '' }} ·
          {{ pool.length }} mots
        </div>
      </div>
      <Btn
        :color="T.frColor"
        :light="T.frLight"
        :style="{ fontSize: '1.1rem', padding: '0.9rem 1.8rem' }"
        @click="handleStart"
      >
        Commencer →
      </Btn>
    </div>
  </div>

  <!-- CONFIGURE -->
  <div
    v-else-if="phase === 'configure'"
    :style="{
      minHeight: '100dvh',
      background: T.frLight,
      fontFamily: T.font,
      display: 'flex',
      flexDirection: 'column',
    }"
  >
    <div
      :style="{
        padding: '1.2rem 1.5rem',
        background: T.frColor,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }"
    >
      <BackBtn @click="phase = 'select'" />
      <h2
        :style="{ flex: 1, textAlign: 'center', fontWeight: 900, fontSize: '1.2rem', margin: 0 }"
      >
        ⚙️ Nombre de mots
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
        padding: '2rem 1.5rem',
        gap: '1.5rem',
      }"
    >
      <div
        :style="{
          background: T.card,
          borderRadius: T.radius,
          boxShadow: T.shadow,
          padding: '1.8rem',
          width: '100%',
          maxWidth: '420px',
        }"
      >
        <div
          :style="{
            fontSize: '0.78rem',
            color: '#bbb',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '1rem',
          }"
        >
          Combien de mots ?
        </div>
        <div
          :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
            justifyContent: 'center',
            marginBottom: '1.2rem',
          }"
        >
          <button
            :style="{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: `2.5px solid ${T.frColor}40`,
              background: T.frLight,
              color: T.frColor,
              fontSize: '1.6rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }"
            @click="wordCount = Math.max(1, wordCount - 1)"
          >
            −
          </button>
          <div
            :style="{
              fontSize: '3rem',
              fontWeight: 900,
              color: T.frColor,
              minWidth: '56px',
              textAlign: 'center',
            }"
          >
            {{ Math.min(wordCount, pool.length) }}
          </div>
          <button
            :style="{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: `2.5px solid ${T.frColor}40`,
              background: T.frLight,
              color: T.frColor,
              fontSize: '1.6rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }"
            @click="wordCount = Math.min(pool.length, wordCount + 1)"
          >
            +
          </button>
        </div>
        <div
          :style="{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }"
        >
          <button
            v-for="n in presetSizes(pool.length)"
            :key="n"
            :style="{
              padding: '0.4rem 1rem',
              borderRadius: '99px',
              border: `2px solid ${wordCount === n ? T.frColor : '#ddd'}`,
              background: wordCount === n ? T.frLight : 'white',
              color: wordCount === n ? T.frColor : '#aaa',
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }"
            @click="wordCount = n"
          >
            {{ n }}
          </button>
          <button
            :style="{
              padding: '0.4rem 1rem',
              borderRadius: '99px',
              border: `2px solid ${wordCount === pool.length ? T.frColor : '#ddd'}`,
              background: wordCount === pool.length ? T.frLight : 'white',
              color: wordCount === pool.length ? T.frColor : '#aaa',
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }"
            @click="wordCount = pool.length"
          >
            Tous ({{ pool.length }})
          </button>
        </div>
      </div>
      <Btn
        :color="T.frColor"
        :light="T.frLight"
        :style="{ fontSize: '1.3rem', padding: '1.1rem 3rem', borderRadius: '2rem' }"
        @click="startDictation(shuffle(pool).slice(0, Math.min(wordCount, pool.length)))"
      >
        Commencer la dictée →
      </Btn>
    </div>
  </div>

  <!-- DICTATE -->
  <div
    v-else-if="phase === 'dictate'"
    :style="{
      minHeight: '100dvh',
      background: T.frLight,
      fontFamily: T.font,
      display: 'flex',
      flexDirection: 'column',
    }"
  >
    <div
      :style="{
        padding: '1rem 1.5rem',
        background: T.frColor,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }"
    >
      <BackBtn @click="phase = 'select'" />
      <div :style="{ flex: 1, textAlign: 'center', fontWeight: 900 }">
        Dictée — mot {{ wordIndex + 1 }}/{{ activeWords.length }}
      </div>
      <div :style="{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.8 }">📋 Parent</div>
    </div>
    <div
      :style="{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        gap: '2rem',
      }"
    >
      <div :style="{ width: '100%', maxWidth: '500px' }">
        <ProgressBar :value="wordIndex + 1" :max="activeWords.length" :color="T.frColor" />
      </div>
      <div
        :style="{
          background: T.card,
          borderRadius: T.radius,
          boxShadow: T.shadow,
          padding: '3rem 4rem',
          textAlign: 'center',
          width: '100%',
          maxWidth: '500px',
        }"
      >
        <div
          :style="{
            fontSize: '0.78rem',
            color: '#bbb',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '1rem',
          }"
        >
          Mot à dicter
        </div>
        <div
          :style="{
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: 900,
            color: T.frColor,
            letterSpacing: '0.05em',
            lineHeight: 1.1,
            transition: 'opacity 0.2s',
          }"
        >
          {{ showWord ? activeWords[wordIndex] : '••••••' }}
        </div>
        <button
          :style="{
            marginTop: '1rem',
            background: 'none',
            border: `2px solid ${T.frColor}40`,
            borderRadius: '0.8rem',
            padding: '0.4rem 1rem',
            color: T.frColor,
            fontFamily: 'inherit',
            fontSize: '0.9rem',
            cursor: 'pointer',
            fontWeight: 700,
          }"
          @click="showWord = !showWord"
        >
          {{ showWord ? '🙈 Cacher' : '👁 Afficher' }}
        </button>
      </div>
      <div :style="{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px' }">
        <Btn
          v-if="wordIndex + 1 < activeWords.length"
          :color="T.frColor"
          :light="T.frLight"
          :style="{ flex: 1, fontSize: '1.2rem' }"
          @click="
            () => {
              wordIndex += 1
              showWord = true
            }
          "
        >
          Mot suivant →
        </Btn>
        <Btn
          v-else
          :color="T.successColor"
          :light="T.successLight"
          :style="{ flex: 1, fontSize: '1.2rem' }"
          @click="
            () => {
              corrections = activeWords.map((w) => ({ word: w, result: null }))
              phase = 'correct'
            }
          "
        >
          Terminer la dictée ✓
        </Btn>
      </div>
    </div>
  </div>

  <!-- CORRECT -->
  <div
    v-else-if="phase === 'correct'"
    :style="{
      minHeight: '100dvh',
      background: T.frLight,
      fontFamily: T.font,
      display: 'flex',
      flexDirection: 'column',
    }"
  >
    <div
      :style="{
        padding: '1rem 1.5rem',
        background: T.frColor,
        color: 'white',
        textAlign: 'center',
        fontWeight: 900,
        fontSize: '1.2rem',
      }"
    >
      ✏️ Correction avec l'enfant
    </div>
    <div :style="{ flex: 1, padding: '1.5rem', overflowY: 'auto' }">
      <p
        :style="{
          color: '#888',
          textAlign: 'center',
          marginBottom: '1.5rem',
          fontWeight: 600,
          fontSize: '0.95rem',
        }"
      >
        Regardez le cahier ensemble et cochez chaque mot
      </p>
      <div
        :style="{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem',
          maxWidth: '500px',
          margin: '0 auto',
        }"
      >
        <div
          v-for="(c, i) in corrections"
          :key="i"
          :style="{
            background:
              c.result === 'correct' ? T.successLight : c.result === 'wrong' ? T.warnLight : T.card,
            border: `2.5px solid ${c.result === 'correct' ? T.successColor : c.result === 'wrong' ? T.warnColor : '#ddd'}`,
            borderRadius: '1.2rem',
            padding: '1rem 1.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            transition: 'all 0.15s',
          }"
        >
          <span :style="{ fontSize: '1.3rem', fontWeight: 900, color: '#222', flex: 1 }">{{
            c.word
          }}</span>
          <button
            :style="{
              padding: '0.6rem 1rem',
              borderRadius: '0.8rem',
              border: `2px solid ${T.successColor}`,
              background: c.result === 'correct' ? T.successColor : 'white',
              color: c.result === 'correct' ? 'white' : T.successColor,
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: '1.1rem',
              cursor: 'pointer',
            }"
            @click="markCorrection(i, 'correct')"
          >
            ✅
          </button>
          <button
            :style="{
              padding: '0.6rem 1rem',
              borderRadius: '0.8rem',
              border: `2px solid ${T.warnColor}`,
              background: c.result === 'wrong' ? T.warnColor : 'white',
              color: c.result === 'wrong' ? 'white' : T.warnColor,
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: '1.1rem',
              cursor: 'pointer',
            }"
            @click="markCorrection(i, 'wrong')"
          >
            ❌
          </button>
        </div>
      </div>
      <div :style="{ marginTop: '1.5rem', textAlign: 'center' }">
        <Btn
          :color="T.successColor"
          :light="T.successLight"
          :disabled="!allMarked"
          :style="{ fontSize: '1.2rem', padding: '1rem 2.5rem' }"
          @click="
            () => {
              sfx.complete()
              phase = 'results'
            }
          "
        >
          Voir les résultats →
        </Btn>
      </div>
    </div>
  </div>

  <!-- RESULTS -->
  <ResultScreen
    v-else-if="phase === 'results'"
    :score="score"
    :total="activeWords.length"
    :color="T.frColor"
    :light="T.frLight"
    @back="emit('back')"
    @retry="startDictation([...activeWords])"
  />
</template>
