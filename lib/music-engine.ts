type MusicTrack = 'menu' | 'match'

const TRACKS: Record<MusicTrack, { src: string; volume: number }> = {
  menu: { src: '/audio/egyptian-desert-music.mp3', volume: 0.5 },
  match: { src: '/audio/match-ambience-cicadas.mp3', volume: 0.12 },
}

const FADE_IN_MS = 2000
const FADE_OUT_MS = 1500
const MUTE_FADE_MS = 250
const UNLOCK_EVENTS = ['pointerup', 'touchend', 'click', 'keydown'] as const

class MusicEngine {
  private elements: Partial<Record<MusicTrack, HTMLAudioElement>> = {}
  private fadeFrames = new Map<HTMLAudioElement, number>()
  private current: MusicTrack | null = null
  private enabled = true
  private unlockArmed = false
  private lifecycleBound = false

  preload(track: MusicTrack) {
    if (typeof window !== 'undefined') this.element(track)
  }

  play(track: MusicTrack) {
    if (typeof window === 'undefined' || track === this.current) return
    this.bindLifecycle()
    this.current = track
    for (const [id, el] of Object.entries(this.elements)) {
      if (id !== track && el) this.fadeOut(el, FADE_OUT_MS)
    }
    const el = this.element(track)
    if (el.paused) el.currentTime = 0
    this.start()
  }

  setEnabled(enabled: boolean) {
    if (typeof window === 'undefined' || enabled === this.enabled) return
    this.enabled = enabled
    if (enabled) this.start()
    else
      Object.values(this.elements).forEach(
        (el) => el && this.fadeOut(el, MUTE_FADE_MS)
      )
  }

  private element(track: MusicTrack) {
    let el = this.elements[track]
    if (!el) {
      el = new Audio(TRACKS[track].src)
      el.loop = true
      el.preload = 'auto'
      el.volume = 0
      this.elements[track] = el
    }
    return el
  }

  private start() {
    const track = this.current
    if (!track || !this.enabled || document.hidden) return
    const el = this.element(track)
    this.cancelFade(el)
    el.play()
      .then(() => {
        this.disarmUnlock()
        if (this.current === track && this.enabled) {
          this.fade(el, TRACKS[track].volume, FADE_IN_MS)
        }
      })
      // Autoplay blocked (regular browsers before the first tap): retry on the next user gesture.
      .catch(() => this.armUnlock())
  }

  private fade(
    el: HTMLAudioElement,
    target: number,
    duration: number,
    onDone?: () => void
  ) {
    this.cancelFade(el)
    const from = el.volume
    const startedAt = performance.now()
    const step = (now: number) => {
      const progress = Math.min(1, Math.max(0, (now - startedAt) / duration))
      el.volume = Math.min(1, Math.max(0, from + (target - from) * progress))
      if (progress < 1) {
        this.fadeFrames.set(el, requestAnimationFrame(step))
      } else {
        this.fadeFrames.delete(el)
        onDone?.()
      }
    }
    this.fadeFrames.set(el, requestAnimationFrame(step))
  }

  private fadeOut(el: HTMLAudioElement, duration: number) {
    this.fade(el, 0, duration, () => el.pause())
  }

  private cancelFade(el: HTMLAudioElement) {
    const frame = this.fadeFrames.get(el)
    if (frame !== undefined) cancelAnimationFrame(frame)
    this.fadeFrames.delete(el)
  }

  private bindLifecycle() {
    if (this.lifecycleBound) return
    this.lifecycleBound = true
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.start()
        return
      }
      Object.values(this.elements).forEach((el) => {
        if (!el) return
        this.cancelFade(el)
        el.pause()
        el.volume = 0
      })
    })
  }

  private handleGesture = () => this.start()

  private armUnlock() {
    if (this.unlockArmed) return
    this.unlockArmed = true
    UNLOCK_EVENTS.forEach((type) =>
      window.addEventListener(type, this.handleGesture, true)
    )
  }

  private disarmUnlock() {
    if (!this.unlockArmed) return
    this.unlockArmed = false
    UNLOCK_EVENTS.forEach((type) =>
      window.removeEventListener(type, this.handleGesture, true)
    )
  }
}

export const musicEngine = new MusicEngine()
