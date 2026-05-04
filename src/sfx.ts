type OscType = 'sine' | 'sawtooth' | 'square' | 'triangle'

function playTone(freq: number, dur: number, type: OscType = 'sine', vol = 0.15) {
  try {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctor()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
    osc.start()
    osc.stop(ctx.currentTime + dur)
  } catch {
    // ignore
  }
}

export const sfx = {
  correct: () => {
    playTone(520, 0.1)
    setTimeout(() => playTone(660, 0.15), 100)
  },
  wrong: () => playTone(220, 0.25, 'sawtooth', 0.1),
  complete: () => {
    const freqs = [440, 550, 660, 880] as const
    ;[0, 100, 200, 300].forEach((d, i) => setTimeout(() => playTone(freqs[i]!, 0.2), d))
  },
  click: () => playTone(600, 0.05, 'sine', 0.05),
}
