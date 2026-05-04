export const T = {
  bg: 'hsl(40,28%,97%)',
  card: '#ffffff',
  radius: '1.5rem',
  shadow: '0 4px 20px rgba(0,0,0,0.07)',
  mathColor: '#4A90D9',
  mathLight: '#EBF4FF',
  frColor: '#8B5CF6',
  frLight: '#F3EEFF',
  successColor: '#34C27A',
  successLight: '#EAFFF3',
  warnColor: '#F97316',
  warnLight: '#FFF7ED',
  font: "'Nunito', sans-serif",
} as const

export const CLASSES = ['CE1'] as const
export type Classe = (typeof CLASSES)[number]
