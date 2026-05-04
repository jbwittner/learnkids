<script setup lang="ts">
import { computed, ref, type StyleValue } from 'vue'
import { sfx } from '@/sfx'

const props = withDefaults(
  defineProps<{
    color: string
    light?: string
    disabled?: boolean
    variant?: 'solid' | 'outline' | 'ghost'
    style?: StyleValue
  }>(),
  { variant: 'solid', light: '#f0f0f0', disabled: false },
)

const emit = defineEmits<{ click: [] }>()

const pressed = ref(false)

const merged = computed<StyleValue>(() => {
  const base: Record<string, string | number> = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.85rem 1.8rem',
    borderRadius: '1.2rem',
    fontFamily: 'inherit',
    fontSize: '1.1rem',
    fontWeight: 700,
    border: 'none',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    transition: 'transform 0.1s, box-shadow 0.1s',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    opacity: props.disabled ? 0.5 : 1,
    transform: pressed.value ? 'scale(0.96) translateY(2px)' : 'scale(1)',
  }
  if (props.variant === 'solid') {
    base.background = props.color
    base.color = 'white'
    base.boxShadow = `0 4px 0 ${props.color}99`
  } else if (props.variant === 'outline') {
    base.background = props.light
    base.color = props.color
    base.border = `2.5px solid ${props.color}`
  } else {
    base.background = 'transparent'
    base.color = props.color
  }
  return [base, props.style ?? {}] as unknown as StyleValue
})

const onUp = () => {
  pressed.value = false
  if (!props.disabled) {
    sfx.click()
    emit('click')
  }
}
</script>

<template>
  <button
    :style="merged"
    :disabled="disabled"
    @pointerdown="pressed = true"
    @pointerup="onUp"
    @pointerleave="pressed = false"
  >
    <slot />
  </button>
</template>
