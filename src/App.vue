<script setup lang="ts">
import { ref } from 'vue'
import type { Classe } from '@/theme'
import ClassSelect from '@/views/ClassSelect.vue'
import SubjectHub, { type ExerciseId } from '@/views/SubjectHub.vue'
import MathConfig, { type MathSettings } from '@/views/MathConfig.vue'
import MathModule from '@/views/MathModule.vue'
import FractionModule from '@/views/FractionModule.vue'
import FrenchModule from '@/views/FrenchModule.vue'

const buildSha = __BUILD_SHA__
const buildDate = new Date(__BUILD_DATE__).toLocaleString('fr-FR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

type Screen = 'class' | 'subjects' | 'exercise'
type MathPhase = 'config' | 'game'

const screen = ref<Screen>('class')
const classe = ref<Classe | null>(null)
const subject = ref<ExerciseId | null>(null)
const mathSettings = ref<MathSettings | null>(null)
const mathPhase = ref<MathPhase>('config')

const goClass = () => {
  screen.value = 'class'
  classe.value = null
  subject.value = null
}
const goSubjects = (cls: Classe) => {
  classe.value = cls
  screen.value = 'subjects'
}
const goExercise = (sub: ExerciseId) => {
  subject.value = sub
  if (sub === 'math_ops') mathPhase.value = 'config'
  screen.value = 'exercise'
}
const goBack = () => {
  screen.value = 'subjects'
}

const onMathStart = (s: MathSettings) => {
  mathSettings.value = s
  mathPhase.value = 'game'
}
</script>

<template>
  <ClassSelect v-if="screen === 'class'" @select="goSubjects" />

  <SubjectHub
    v-else-if="screen === 'subjects' && classe"
    :classe="classe"
    @select="goExercise"
    @back="goClass"
  />

  <template v-else-if="screen === 'exercise'">
    <template v-if="subject === 'math_ops'">
      <MathConfig v-if="mathPhase === 'config'" @start="onMathStart" @back="goBack" />
      <MathModule
        v-else-if="mathSettings"
        :math-settings="mathSettings"
        @back="goBack"
      />
    </template>
    <FractionModule v-else-if="subject === 'math_frac'" @back="goBack" />
    <FrenchModule
      v-else-if="subject === 'french' && classe"
      :classe="classe"
      @back="goBack"
    />
  </template>

  <footer class="build-info">build {{ buildDate }} · {{ buildSha }}</footer>
</template>

<style scoped>
.build-info {
  position: fixed;
  bottom: 4px;
  right: 8px;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.4);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  pointer-events: none;
  z-index: 1;
}
</style>
