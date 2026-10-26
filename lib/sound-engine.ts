'use client'

import { PieceSculptType } from './game-types'

// Procedural AAA Web Audio Synthesizer for LUDO WAR®
// Includes Dedicated Horror / Creepy Elimination Sounds per Piece Type (Alien, Human, Horse, Crown)
class SoundEngine {
  private ctx: AudioContext | null = null
  public enabled: boolean = true

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  private introStartedAt = -1

  // Cinematic studio score (~5.5s): sub-bass impact, slow-swelling D-minor string pad
  // through a low-pass "breathing" filter, airy shimmer, and a long convolution-style tail.
  public playStudioIntro() {
    const ctx = this.getContext()
    if (!ctx) return
    if (this.introStartedAt >= 0 && ctx.currentTime - this.introStartedAt < 6) return
    if (ctx.state !== 'running') {
      ctx
        .resume()
        .then(() => {
          if (ctx.state === 'running') this.playStudioIntro()
        })
        .catch(() => {})
      return
    }
    this.introStartedAt = ctx.currentTime
    const now = ctx.currentTime + 0.02
    const end = now + 5.6

    const master = ctx.createGain()
    master.gain.setValueAtTime(0.0001, now)
    master.gain.linearRampToValueAtTime(0.9, now + 0.3)
    master.gain.setValueAtTime(0.9, now + 3.6)
    master.gain.exponentialRampToValueAtTime(0.0001, end)

    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -18
    comp.ratio.value = 4
    master.connect(comp)
    comp.connect(ctx.destination)

    // Reverb tail from a generated decaying-noise impulse
    const irLen = Math.floor(ctx.sampleRate * 3.2)
    const ir = ctx.createBuffer(2, irLen, ctx.sampleRate)
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c)
      for (let i = 0; i < irLen; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLen, 2.6)
      }
    }
    const reverb = ctx.createConvolver()
    reverb.buffer = ir
    const wet = ctx.createGain()
    wet.gain.value = 0.55
    reverb.connect(wet)
    wet.connect(master)

    // Sub-bass impact
    const sub = ctx.createOscillator()
    const subGain = ctx.createGain()
    sub.type = 'sine'
    sub.frequency.setValueAtTime(58, now)
    sub.frequency.exponentialRampToValueAtTime(36, now + 2.4)
    subGain.gain.setValueAtTime(0.0001, now)
    subGain.gain.linearRampToValueAtTime(0.7, now + 0.05)
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.4)
    sub.connect(subGain)
    subGain.connect(master)
    sub.start(now)
    sub.stop(now + 3.5)

    // Filtered noise "whoosh" swell for the impact body
    const noiseLen = Math.floor(ctx.sampleRate * 2)
    const noiseBuf = ctx.createBuffer(1, noiseLen, ctx.sampleRate)
    const nd = noiseBuf.getChannelData(0)
    for (let i = 0; i < noiseLen; i++) nd[i] = Math.random() * 2 - 1
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuf
    const nFilter = ctx.createBiquadFilter()
    nFilter.type = 'lowpass'
    nFilter.frequency.setValueAtTime(180, now)
    nFilter.frequency.exponentialRampToValueAtTime(60, now + 1.8)
    const nGain = ctx.createGain()
    nGain.gain.setValueAtTime(0.0001, now)
    nGain.gain.linearRampToValueAtTime(0.35, now + 0.04)
    nGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.9)
    noise.connect(nFilter)
    nFilter.connect(nGain)
    nGain.connect(master)
    nGain.connect(reverb)
    noise.start(now)
    noise.stop(now + 2)

    // Swelling string pad: D2, A2, D3, F3, A3 with detuned saw pairs
    const padFilter = ctx.createBiquadFilter()
    padFilter.type = 'lowpass'
    padFilter.Q.value = 0.7
    padFilter.frequency.setValueAtTime(220, now)
    padFilter.frequency.exponentialRampToValueAtTime(1800, now + 3.2)
    padFilter.frequency.exponentialRampToValueAtTime(400, end)
    const padGain = ctx.createGain()
    padGain.gain.setValueAtTime(0.0001, now)
    padGain.gain.linearRampToValueAtTime(0.11, now + 2.6)
    padGain.gain.exponentialRampToValueAtTime(0.0001, end)
    padFilter.connect(padGain)
    padGain.connect(master)
    padGain.connect(reverb)
    ;[73.42, 110, 146.83, 174.61, 220].forEach((f) => {
      ;[-7, 7].forEach((cents) => {
        const o = ctx.createOscillator()
        o.type = 'sawtooth'
        o.frequency.value = f
        o.detune.value = cents
        o.connect(padFilter)
        o.start(now)
        o.stop(end)
      })
    })

    // High shimmer that blooms as the title resolves
    ;[587.33, 880].forEach((f, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = f
      const t = now + 1.2 + i * 0.4
      g.gain.setValueAtTime(0.0001, t)
      g.gain.linearRampToValueAtTime(0.025, t + 1.4)
      g.gain.exponentialRampToValueAtTime(0.0001, end)
      o.connect(g)
      g.connect(reverb)
      o.start(t)
      o.stop(end)
    })
  }

  public playStudioGlitchExit() {
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const slices = [0, 0.07, 0.14, 0.23, 0.31, 0.42, 0.54]
    slices.forEach((offset, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = idx % 2 === 0 ? 'sawtooth' : 'square'
      osc.frequency.setValueAtTime(
        idx % 2 === 0 ? 940 - idx * 95 : 220 + idx * 60,
        now + offset
      )
      osc.frequency.exponentialRampToValueAtTime(65, now + offset + 0.055)
      gain.gain.setValueAtTime(0.09 * (1 - idx * 0.1), now + offset)
      gain.gain.exponentialRampToValueAtTime(0.0008, now + offset + 0.06)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + offset)
      osc.stop(now + offset + 0.065)
    })
  }

  public playUiClick() {
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(620, now)
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.065)
    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.075)
  }

  public playDiceRoll() {
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const hits = [0, 0.08, 0.16, 0.25, 0.34, 0.44, 0.54]
    hits.forEach((offset, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = i % 2 === 0 ? 'square' : 'triangle'
      osc.frequency.setValueAtTime(280 + Math.random() * 220, now + offset)
      osc.frequency.exponentialRampToValueAtTime(90, now + offset + 0.055)
      gain.gain.setValueAtTime(0.14 * (1 - i * 0.08), now + offset)
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.06)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + offset)
      osc.stop(now + offset + 0.065)
    })
  }

  public playDiceSix() {
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const notes = [440, 554.37, 659.25, 880]
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.055)
      gain.gain.setValueAtTime(0.14, now + idx * 0.055)
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.055 + 0.35)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + idx * 0.055)
      osc.stop(now + idx * 0.055 + 0.36)
    })
  }

  public playPieceStep() {
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(340, now)
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.09)
    gain.gain.setValueAtTime(0.22, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.11)
  }

  public playPieceSpawn() {
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const notes = [293.66, 440, 587.33]
    notes.forEach((f, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(f, now + i * 0.07)
      gain.gain.setValueAtTime(0.16, now + i * 0.07)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.3)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + i * 0.07)
      osc.stop(now + i * 0.07 + 0.32)
    })
  }

  /**
   * Dedicated Creepy / Horror Elimination Sound Effect per Piece Type:
   * - 'alien': Eerie extraterrestrial shriek with FM horror modulation + abyssal sub-drone
   * - 'human': Haunting phantom reaper groan & guillotine soul-rip resonance
   * - 'horse': Demonic nightmare stallion screeching neigh + double hell-hoof thunder stomp
   * - 'crown': Cursed tritone ("Devil's interval") execution bell toll + dark shattering choir
   */
  public playPieceEliminationHorror(killerSculpt: PieceSculptType) {
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime

    // Shared deep horror sub-bass dread drop
    const subOsc = ctx.createOscillator()
    const subGain = ctx.createGain()
    subOsc.type = 'sine'
    subOsc.frequency.setValueAtTime(88, now)
    subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.95)
    subGain.gain.setValueAtTime(0.38, now)
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.98)
    subOsc.connect(subGain)
    subGain.connect(ctx.destination)
    subOsc.start(now)
    subOsc.stop(now + 1.0)

    if (killerSculpt === 'alien') {
      // ALIEN HORROR: High-pitched FM extraterrestrial void shriek + eerie warble
      const carrier = ctx.createOscillator()
      const mod = ctx.createOscillator()
      const modGain = ctx.createGain()
      const mainGain = ctx.createGain()

      carrier.type = 'sawtooth'
      carrier.frequency.setValueAtTime(1180, now)
      carrier.frequency.exponentialRampToValueAtTime(310, now + 0.45)
      carrier.frequency.exponentialRampToValueAtTime(1640, now + 0.72)
      carrier.frequency.exponentialRampToValueAtTime(140, now + 0.95)

      mod.type = 'sine'
      mod.frequency.setValueAtTime(48, now)
      mod.frequency.linearRampToValueAtTime(19, now + 0.9)
      modGain.gain.setValueAtTime(240, now)

      mainGain.gain.setValueAtTime(0.01, now)
      mainGain.gain.linearRampToValueAtTime(0.28, now + 0.06)
      mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.96)

      mod.connect(modGain)
      modGain.connect(carrier.frequency)
      carrier.connect(mainGain)
      mainGain.connect(ctx.destination)

      mod.start(now)
      carrier.start(now)
      mod.stop(now + 0.98)
      carrier.stop(now + 0.98)
      return
    }

    if (killerSculpt === 'horse') {
      // HORSE HORROR: Demonic Nightmare Stallion Shrieking Neigh + 2 Heavy Hoof Slams
      const neigh = ctx.createOscillator()
      const vibrato = ctx.createOscillator()
      const vibGain = ctx.createGain()
      const neighGain = ctx.createGain()

      neigh.type = 'sawtooth'
      neigh.frequency.setValueAtTime(680, now)
      neigh.frequency.linearRampToValueAtTime(1120, now + 0.14)
      neigh.frequency.exponentialRampToValueAtTime(260, now + 0.78)

      vibrato.type = 'square'
      vibrato.frequency.setValueAtTime(28, now)
      vibGain.gain.setValueAtTime(85, now)

      neighGain.gain.setValueAtTime(0.01, now)
      neighGain.gain.linearRampToValueAtTime(0.26, now + 0.05)
      neighGain.gain.exponentialRampToValueAtTime(0.001, now + 0.82)

      vibrato.connect(vibGain)
      vibGain.connect(neigh.frequency)
      neigh.connect(neighGain)
      neighGain.connect(ctx.destination)

      vibrato.start(now)
      neigh.start(now)
      vibrato.stop(now + 0.84)
      neigh.stop(now + 0.84)

      // Double demonic hoof stomp
      ;[0.22, 0.42].forEach((offset) => {
        const stomp = ctx.createOscillator()
        const sGain = ctx.createGain()
        stomp.type = 'triangle'
        stomp.frequency.setValueAtTime(160, now + offset)
        stomp.frequency.exponentialRampToValueAtTime(36, now + offset + 0.18)
        sGain.gain.setValueAtTime(0.32, now + offset)
        sGain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.2)
        stomp.connect(sGain)
        sGain.connect(ctx.destination)
        stomp.start(now + offset)
        stomp.stop(now + offset + 0.21)
      })
      return
    }

    if (killerSculpt === 'human') {
      // HUMAN HORROR: Haunting Soul-Reaper Phantom Groan (dissonant minor second) + Blade Slash
      const slash = ctx.createOscillator()
      const slashGain = ctx.createGain()
      slash.type = 'sawtooth'
      slash.frequency.setValueAtTime(920, now)
      slash.frequency.exponentialRampToValueAtTime(110, now + 0.22)
      slashGain.gain.setValueAtTime(0.28, now)
      slashGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24)
      slash.connect(slashGain)
      slashGain.connect(ctx.destination)
      slash.start(now)
      slash.stop(now + 0.25)

      // Eerie phantom wail chord (minor second dissonance descending into abyss)
      const phantomFreqs = [233.08, 246.94, 311.13]
      phantomFreqs.forEach((f) => {
        const vOsc = ctx.createOscillator()
        const vGain = ctx.createGain()
        vOsc.type = 'sawtooth'
        vOsc.frequency.setValueAtTime(f, now + 0.1)
        vOsc.frequency.exponentialRampToValueAtTime(f * 0.52, now + 0.92)
        vGain.gain.setValueAtTime(0.001, now + 0.1)
        vGain.gain.linearRampToValueAtTime(0.11, now + 0.26)
        vGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.95)
        vOsc.connect(vGain)
        vGain.connect(ctx.destination)
        vOsc.start(now + 0.1)
        vOsc.stop(now + 0.96)
      })
      return
    }

    // CROWN HORROR: Cursed Imperial Execution Bell (Tritone Devil's Interval + Dark Shatter)
    const tritoneFreqs = [196.0, 277.18, 392.0, 554.37, 830.61]
    tritoneFreqs.forEach((f, idx) => {
      const bell = ctx.createOscillator()
      const bGain = ctx.createGain()
      bell.type = idx % 2 === 0 ? 'triangle' : 'sawtooth'
      bell.frequency.setValueAtTime(f, now)
      bell.frequency.exponentialRampToValueAtTime(f * 0.84, now + 0.92)
      bGain.gain.setValueAtTime(0.14 / (idx * 0.45 + 1), now)
      bGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.95)
      bell.connect(bGain)
      bGain.connect(ctx.destination)
      bell.start(now)
      bell.stop(now + 0.96)
    })
  }

  public playBlackHoleAbsorb() {
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(180, now)
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.65)
    osc.frequency.exponentialRampToValueAtTime(48, now + 1.15)
    gain.gain.setValueAtTime(0.01, now)
    gain.gain.linearRampToValueAtTime(0.3, now + 0.5)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 1.25)
  }

  public playVictoryFanfare() {
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const chord = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99]
    chord.forEach((f, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(f, now + idx * 0.1)
      gain.gain.setValueAtTime(0.18, now + idx * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.1 + 1.4)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + idx * 0.1)
      osc.stop(now + idx * 0.1 + 1.45)
    })
  }

  public playWheelTick() {
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(920, now)
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.03)
    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.04)
  }
}

export const soundEngine = new SoundEngine()
