'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

interface GameLoadingScreenProps {
  onComplete: () => void
}

const SCENE_SRC = '/images/loading-scene.jpg'
const DURATION_MS = 7000
const EXIT_MS = 1000

// Artwork is 1408x3040; the black hole core centre was measured from its pixels.
const IMG_W = 1408
const IMG_H = 3040
const CORE_X = 712
const CORE_Y = 876
const CORE_ORIGIN = `${(CORE_X / IMG_W) * 100}% ${(CORE_Y / IMG_H) * 100}%`
// The artwork has a static loading bar baked in below ~86%; fade it out so the live one replaces it.
const BOTTOM_FADE = 'linear-gradient(to bottom, #000 80%, transparent 85.5%)'

const TIPS = [
  'Summoning the factions',
  'Charging the Black Hole',
  'Forging the Ruling Ring',
  'Rolling the war dice',
  'Preparing the battlefield',
]

const pct = (value: number, total: number) => `${(value / total) * 100}%`

const disc = (radius: number): CSSProperties => ({
  left: pct(CORE_X - radius, IMG_W),
  top: pct(CORE_Y - radius, IMG_H),
  width: pct(radius * 2, IMG_W),
  height: pct(radius * 2, IMG_H),
})

const area = (cx: number, cy: number, w: number, h: number): CSSProperties => ({
  left: `${cx - w / 2}%`,
  top: `${cy - h / 2}%`,
  width: `${w}%`,
  height: `${h}%`,
})

const ring = (stops: string) => `radial-gradient(circle closest-side, ${stops})`
const glow = (color: string) => `radial-gradient(ellipse closest-side, ${color}, transparent)`

const AURAS = [
  { pos: area(30, 50, 50, 20), color: 'rgba(56,189,248,0.55)', animation: 'lw-flicker 2.3s infinite' },
  { pos: area(81, 48, 42, 20), color: 'rgba(250,204,21,0.5)', animation: 'lw-flicker 2.9s 0.5s infinite' },
  { pos: area(23, 73, 56, 24), color: 'rgba(249,115,22,0.55)', animation: 'lw-fire 0.8s ease-in-out infinite alternate' },
  { pos: area(77, 73, 56, 24), color: 'rgba(34,197,94,0.5)', animation: 'lw-breathe 3.4s ease-in-out infinite' },
  { pos: area(50.5, 60, 46, 9), color: 'rgba(255,236,179,0.45)', animation: 'lw-breathe 2.6s ease-in-out infinite' },
  { pos: area(13, 7, 16, 7), color: 'rgba(251,146,60,0.6)', animation: 'lw-fire 0.7s ease-in-out infinite alternate' },
  { pos: area(87, 7, 16, 7), color: 'rgba(251,146,60,0.6)', animation: 'lw-fire 0.9s 0.2s ease-in-out infinite alternate' },
  { pos: area(50, 2.5, 64, 5), color: 'rgba(167,139,250,0.5)', animation: 'lw-flicker 1.9s 0.3s infinite' },
]

const BOLTS = [
  { pos: area(24, 41.5, 28, 7), points: '0,45 16,28 30,58 46,20 62,52 80,16 100,38', color: '#7dd3fc', duration: 3.6, delay: 0.8 },
  { pos: area(21, 46.5, 22, 6), points: '0,25 20,62 38,34 56,78 74,42 100,68', color: '#bae6fd', duration: 4.6, delay: 2.4 },
  { pos: area(80, 40.5, 28, 7), points: '0,36 15,62 32,24 50,56 66,18 84,50 100,30', color: '#fde047', duration: 3.9, delay: 1.7 },
  { pos: area(83, 45.5, 22, 6), points: '0,62 22,24 40,70 58,30 78,66 100,40', color: '#fef08a', duration: 5.2, delay: 3.3 },
]

const FLYERS = [
  { top: 18, angle: -5, duration: 7, delay: 0.4, color: '#93c5fd', length: 14 },
  { top: 24, angle: 184, duration: 8.5, delay: 2.6, color: '#c4b5fd', length: 11 },
  { top: 37, angle: -9, duration: 9, delay: 4.4, color: '#7dd3fc', length: 12 },
  { top: 20, angle: 20, duration: 6.4, delay: 1.4, color: '#fdba74', length: 16 },
  { top: 31, angle: 160, duration: 10, delay: 5.6, color: '#fca5a5', length: 13 },
]

const INFALL = Array.from({ length: 16 }, (_, i) => ({
  angle: (i * 137.5) % 360,
  radius: 290 + ((i * 53) % 150),
  duration: 4 + (i % 5) * 0.8,
  delay: -((i * 0.83) % 6),
  size: 2 + (i % 3),
  color: ['#fde68a', '#fdba74', '#c4b5fd'][i % 3],
}))

type Particle = { left: number; top: number; size: number; color: string; duration: number; delay: number; rise: number; drift: number }
const make = (count: number, fn: (i: number) => Particle) => Array.from({ length: count }, (_, i) => fn(i))

const PARTICLES: Particle[] = [
  ...make(18, (i) => ({ left: 3 + ((i * 23) % 42), top: 83 - (i % 4) * 3, size: 2 + (i % 3), color: i % 2 ? '#fb923c' : '#fde047', duration: 2.2 + (i % 5) * 0.45, delay: -((i * 0.37) % 3), rise: 18 + (i % 4) * 4, drift: ((i % 5) - 2) * 10 })),
  ...make(14, (i) => ({ left: 56 + ((i * 19) % 40), top: 83 - (i % 3) * 3, size: 3 + (i % 3), color: i % 3 ? '#4ade80' : '#a3e635', duration: 3.2 + (i % 4) * 0.6, delay: -((i * 0.53) % 4), rise: 14 + (i % 3) * 4, drift: ((i % 3) - 1) * 14 })),
  ...make(16, (i) => ({ left: i % 2 ? 64 + ((i * 17) % 32) : 8 + ((i * 13) % 40), top: 57 + (i % 3) * 2, size: 2, color: i % 2 ? '#fde68a' : '#7dd3fc', duration: 1.6 + (i % 4) * 0.35, delay: -((i * 0.29) % 2), rise: 10 + (i % 3) * 3, drift: ((i % 5) - 2) * 8 })),
  ...make(22, (i) => ({ left: (i * 37) % 100, top: 100, size: 1 + (i % 3), color: ['#ffd27a', '#ff7a45', '#93c5fd', '#86efac'][i % 4], duration: 6 + (i % 5), delay: -((i * 0.61) % 7), rise: 90, drift: ((i % 7) - 3) * 12 })),
]

function ArtDisc({ radius, mask, animation }: { radius: number; mask: string; animation: string }) {
  const size = radius * 2
  return (
    <div
      aria-hidden
      className="lw-big absolute overflow-hidden"
      style={{ ...disc(radius), WebkitMaskImage: mask, maskImage: mask, animation, willChange: 'transform' }}
    >
      <img
        src={SCENE_SRC}
        alt=""
        draggable={false}
        className="absolute max-w-none"
        style={{
          width: pct(IMG_W, size),
          height: pct(IMG_H, size),
          left: `-${pct(CORE_X - radius, size)}`,
          top: `-${pct(CORE_Y - radius, size)}`,
        }}
      />
    </div>
  )
}

export function GameLoadingScreen({ onComplete }: GameLoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const imgRef = useRef<HTMLImageElement>(null)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (imgRef.current?.complete) loadedRef.current = true
    let raf = 0
    let exitTimer: ReturnType<typeof setTimeout> | undefined
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS)
      // Uneven pace (bursts and stalls) like a real asset loader; still monotonic and ends at 1.
      const paced = t - (0.35 * Math.sin(t * Math.PI * 4)) / (Math.PI * 4)
      const value = loadedRef.current ? paced : Math.min(paced, 0.92)
      setProgress(Math.round(value * 100))
      if (t < 1 || !loadedRef.current) {
        raf = requestAnimationFrame(tick)
      } else {
        setExiting(true)
        exitTimer = setTimeout(() => onCompleteRef.current(), EXIT_MS)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      if (exitTimer) clearTimeout(exitTimer)
    }
  }, [])

  const tip = TIPS[Math.min(TIPS.length - 1, Math.floor((progress / 100) * TIPS.length))]

  return (
    <div
      role="progressbar"
      aria-label="Loading LUDO WAR"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      className="fixed inset-0 z-[9998] overflow-hidden bg-black select-none"
      style={{
        opacity: exiting ? 0 : 1,
        transition: `opacity ${EXIT_MS * 0.6}ms ease ${EXIT_MS * 0.4}ms`,
        animation: 'lw-fade-in 900ms ease backwards',
      }}
    >
      <img
        src={SCENE_SRC}
        alt=""
        aria-hidden
        draggable={false}
        className="absolute inset-0 h-full w-full max-w-none object-cover"
        style={{
          filter: 'blur(22px) brightness(0.45) saturate(1.2)',
          transform: 'scale(1.15)',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 60%, transparent 85%)',
          maskImage: 'linear-gradient(to bottom, #000 60%, transparent 85%)',
        }}
      />

      <div className="lw-scene absolute left-1/2 top-0 -translate-x-1/2 overflow-hidden" style={{ aspectRatio: `${IMG_W} / ${IMG_H}` }}>
        <div
          className="absolute inset-0"
          style={{
            transformOrigin: CORE_ORIGIN,
            transform: exiting ? 'scale(2.8)' : 'scale(1)',
            transition: `transform ${EXIT_MS}ms cubic-bezier(0.7,0,0.84,0)`,
          }}
        >
          <div className="lw-big absolute inset-0" style={{ transformOrigin: CORE_ORIGIN, animation: 'lw-intro 2.8s cubic-bezier(0.16,1,0.3,1) backwards' }}>
            <div className="lw-big absolute inset-0" style={{ animation: 'lw-drift 12s ease-in-out 2.8s infinite alternate' }}>
              <img
                ref={imgRef}
                src={SCENE_SRC}
                alt=""
                draggable={false}
                onLoad={() => (loadedRef.current = true)}
                onError={() => (loadedRef.current = true)}
                className="absolute inset-0 h-full w-full max-w-none"
                style={{ WebkitMaskImage: BOTTOM_FADE, maskImage: BOTTOM_FADE }}
              />

              <div
                aria-hidden
                className="lw-big absolute mix-blend-screen"
                style={{
                  ...disc(520),
                  background:
                    'conic-gradient(from 0deg, transparent, rgba(139,92,246,0.45) 12%, transparent 26%, rgba(59,130,246,0.35) 44%, transparent 58%, rgba(168,85,247,0.4) 76%, transparent 90%)',
                  WebkitMaskImage: ring('transparent 30%, #000 50%, #000 70%, transparent 88%'),
                  maskImage: ring('transparent 30%, #000 50%, #000 70%, transparent 88%'),
                  animation: 'lw-spin 40s linear infinite',
                }}
              />
              <ArtDisc radius={430} mask={ring('transparent 50%, #000 62%, #000 74%, transparent 100%')} animation="lw-spin 30s linear infinite" />
              <div aria-hidden className="absolute mix-blend-screen" style={{ ...disc(330), background: ring('rgba(251,191,36,0.4), transparent 100%'), animation: 'lw-breathe 3s ease-in-out infinite' }} />
              <ArtDisc radius={250} mask={ring('#000 84%, transparent 100%')} animation="lw-spin-rev 50s linear infinite" />
              <div
                aria-hidden
                className="lw-big absolute mix-blend-screen"
                style={{
                  ...disc(150),
                  background:
                    'conic-gradient(from 0deg, transparent, rgba(255,214,140,0.6) 10%, transparent 30%, rgba(255,170,60,0.5) 50%, transparent 68%, rgba(255,236,170,0.55) 86%, transparent)',
                  WebkitMaskImage: ring('transparent 50%, #000 62%, #000 84%, transparent 98%'),
                  maskImage: ring('transparent 50%, #000 62%, #000 84%, transparent 98%'),
                  animation: 'lw-spin 6s linear infinite',
                }}
              />
              <div aria-hidden className="absolute" style={{ ...disc(80), background: ring('#000 80%, transparent 100%'), animation: 'lw-core 3.2s ease-in-out infinite' }} />
              <div
                aria-hidden
                className="absolute mix-blend-screen"
                style={{
                  ...disc(95),
                  background: ring('transparent 62%, rgba(255,214,140,0.85) 72%, rgba(255,170,60,0.35) 82%, transparent 100%'),
                  animation: 'lw-breathe 1.8s ease-in-out infinite',
                }}
              />

              {INFALL.map((p, i) => (
                <div key={`in-${i}`} aria-hidden className="absolute" style={{ ...disc(p.radius), transform: `rotate(${p.angle}deg)` }}>
                  <div className="absolute inset-0" style={{ animation: `lw-infall ${p.duration}s ${p.delay}s cubic-bezier(0.5,0,0.9,0.5) infinite` }}>
                    <span
                      className="absolute right-0 top-1/2 rounded-full"
                      style={{ width: p.size, height: p.size, marginTop: -p.size / 2, background: p.color, boxShadow: `0 0 8px 2px ${p.color}` }}
                    />
                  </div>
                </div>
              ))}

              <div
                aria-hidden
                className="absolute overflow-hidden mix-blend-overlay"
                style={{
                  ...area(50, 9, 74, 8.5),
                  WebkitMaskImage: glow('#000 60%'),
                  maskImage: glow('#000 60%'),
                }}
              >
                <div
                  className="absolute inset-y-0 left-0 w-1/3"
                  style={{
                    background: 'linear-gradient(100deg, transparent, rgba(255,244,214,0.95), transparent)',
                    animation: 'lw-sweep 3.6s ease-in-out 1.2s infinite',
                  }}
                />
              </div>

              {AURAS.map((a, i) => (
                <div key={`au-${i}`} aria-hidden className="absolute mix-blend-screen" style={{ ...a.pos, background: glow(a.color), animation: a.animation }} />
              ))}

              {BOLTS.map((b, i) => (
                <svg
                  key={`bo-${i}`}
                  aria-hidden
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute overflow-visible"
                  style={{ ...b.pos, opacity: 0, filter: `drop-shadow(0 0 6px ${b.color})`, animation: `lw-bolt ${b.duration}s ${b.delay}s infinite` }}
                >
                  <polyline points={b.points} fill="none" stroke={b.color} strokeWidth="3" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                  <polyline points={b.points} fill="none" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                </svg>
              ))}

              {FLYERS.map((f, i) => (
                <div key={`fl-${i}`} aria-hidden className="absolute left-0 h-0 w-full" style={{ top: `${f.top}%`, transform: `rotate(${f.angle}deg)` }}>
                  <div className="absolute inset-x-0 top-0 h-0" style={{ opacity: 0, animation: `lw-fly ${f.duration}s ${f.delay}s linear infinite` }}>
                    <span
                      className="absolute left-0 top-0 h-[2px] -translate-y-1/2 rounded-full"
                      style={{ width: `${f.length}%`, background: `linear-gradient(90deg, transparent, ${f.color})`, boxShadow: `0 0 10px ${f.color}` }}
                    />
                    <span
                      className="absolute top-0 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                      style={{ left: `${f.length}%`, boxShadow: `0 0 12px 3px ${f.color}` }}
                    />
                  </div>
                </div>
              ))}

              {PARTICLES.map((p, i) => (
                <span
                  key={`pa-${i}`}
                  aria-hidden
                  className="absolute rounded-full"
                  style={
                    {
                      left: `${p.left}%`,
                      top: `${p.top}%`,
                      width: p.size,
                      height: p.size,
                      background: p.color,
                      boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
                      animation: `lw-rise ${p.duration}s ${p.delay}s linear infinite`,
                      '--dx': `${p.drift}px`,
                      '--rise': `-${p.rise}vh`,
                    } as CSSProperties
                  }
                />
              ))}

              <div aria-hidden className="lw-big absolute inset-0 bg-sky-300 mix-blend-screen" style={{ opacity: 0, animation: `lw-flash ${BOLTS[0].duration}s ${BOLTS[0].delay}s infinite` }} />
              <div aria-hidden className="lw-big absolute inset-0 bg-amber-300 mix-blend-screen" style={{ opacity: 0, animation: `lw-flash ${BOLTS[2].duration}s ${BOLTS[2].delay}s infinite` }} />
            </div>
          </div>

          <div
            aria-hidden
            className="absolute rounded-full"
            style={{
              ...disc(140),
              background: ring('rgba(255,250,235,0.95), rgba(253,224,71,0.6) 45%, transparent 75%'),
              opacity: exiting ? 1 : 0,
              transform: exiting ? 'scale(6)' : 'scale(0.3)',
              transition: `opacity 500ms ease, transform ${EXIT_MS}ms cubic-bezier(0.7,0,0.84,0)`,
            }}
          />
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 flex flex-col items-center px-[8%] pt-10 pb-[max(1rem,env(safe-area-inset-bottom))]"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.82) 50%, transparent 100%)',
          opacity: exiting ? 0 : 1,
          transition: 'opacity 350ms ease',
        }}
      >
        <p className="font-display text-xl font-bold tracking-wide text-amber-200 sm:text-2xl" style={{ textShadow: '0 0 14px rgba(251,191,36,0.6), 0 2px 4px #000' }}>
          Loading
          <span aria-hidden>
            {[0, 1, 2].map((d) => (
              <span key={d} style={{ animation: `lw-dot 1.2s ${d * 0.2}s infinite` }}>
                .
              </span>
            ))}
          </span>
        </p>

        <div
          className="relative mt-3 h-4 w-full max-w-md rounded-full border-2 border-amber-500/80 bg-black/70 sm:h-5"
          style={{ boxShadow: '0 0 18px rgba(251,191,36,0.5), inset 0 2px 6px rgba(0,0,0,0.9)' }}
        >
          <div
            className="absolute inset-y-0 left-0 overflow-hidden rounded-full"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg,#92400e,#f59e0b 45%,#fde68a 85%,#fbbf24)',
              boxShadow: '0 0 12px rgba(253,230,138,0.85)',
            }}
          >
            <div
              className="absolute inset-y-0 left-0 w-1/3"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)', animation: 'lw-bar 1.6s linear infinite' }}
            />
          </div>
          <div aria-hidden className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${progress}%` }}>
            <div
              className="grid h-8 w-8 grid-cols-3 grid-rows-3 rounded-lg border-2 border-amber-300 p-1 sm:h-9 sm:w-9"
              style={{
                background: 'linear-gradient(135deg,#b45309,#451a03 60%,#1c1917)',
                boxShadow: '0 0 18px rgba(251,191,36,0.9)',
                animation: 'lw-roll 1.1s linear infinite',
              }}
            >
              {[0, 2, 4, 6, 8].map((cell) => (
                <span
                  key={cell}
                  className="h-1.5 w-1.5 place-self-center rounded-full bg-amber-100"
                  style={{ gridRow: Math.floor(cell / 3) + 1, gridColumn: (cell % 3) + 1 }}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="mt-2.5 whitespace-nowrap font-display text-[11px] font-bold uppercase tracking-[0.12em] text-amber-300/85 tabular-nums sm:text-xs">
          {progress}% &middot; {tip}
        </p>
        <p className="mt-2 text-balance text-center font-display text-[13px] font-semibold leading-snug text-amber-100 sm:text-base" style={{ textShadow: '0 2px 6px #000' }}>
          Four factions. One cosmic destiny.
          <br />
          Reach the Black Hole, claim the Universe Ruling Ring!
        </p>
      </div>

      <style>{`
        .lw-scene { height: max(100vh, min(100vw * 2.1591, 118vh)); height: max(100dvh, min(100vw * 2.1591, 118dvh)); }
        @keyframes lw-fade-in { from { filter: brightness(0) } to { filter: brightness(1) } }
        @keyframes lw-intro { from { transform: scale(1.16) } to { transform: scale(1) } }
        @keyframes lw-drift { from { transform: scale(1) translate3d(0,0,0) } to { transform: scale(1.04) translate3d(-0.6%,-0.7%,0) } }
        @keyframes lw-spin { to { transform: rotate(360deg) } }
        @keyframes lw-spin-rev { to { transform: rotate(-360deg) } }
        @keyframes lw-breathe { 0%,100% { opacity: .35; transform: scale(.96) } 50% { opacity: .9; transform: scale(1.05) } }
        @keyframes lw-core { 0%,100% { transform: scale(.95) } 50% { transform: scale(1.12) } }
        @keyframes lw-flicker { 0%,100% { opacity: .35 } 18% { opacity: .95 } 21% { opacity: .4 } 55% { opacity: .8 } 70% { opacity: .5 } }
        @keyframes lw-fire { 0% { opacity: .45; transform: scale(1) } 50% { opacity: .9 } 100% { opacity: .6; transform: scale(1.07) translateY(-1.5%) } }
        @keyframes lw-infall { 0% { transform: rotate(0deg) scale(1); opacity: 0 } 12%,82% { opacity: 1 } 100% { transform: rotate(560deg) scale(.05); opacity: 0 } }
        @keyframes lw-fly { 0% { transform: translateX(-30%); opacity: 0 } 4%,30% { opacity: 1 } 34%,100% { transform: translateX(115%); opacity: 0 } }
        @keyframes lw-bolt { 0%,100% { opacity: 0 } 1.5% { opacity: 1 } 3.5% { opacity: .1 } 5.5% { opacity: 1 } 9% { opacity: 0 } }
        @keyframes lw-flash { 0%,100% { opacity: 0 } 1.5% { opacity: .22 } 3.5% { opacity: .04 } 5.5% { opacity: .18 } 10% { opacity: 0 } }
        @keyframes lw-rise { 0% { transform: translate3d(0,0,0) scale(1); opacity: 0 } 12% { opacity: 1 } 72% { opacity: .85 } 100% { transform: translate3d(var(--dx),var(--rise),0) scale(.35); opacity: 0 } }
        @keyframes lw-sweep { 0% { transform: translateX(-120%) skewX(-12deg) } 55%,100% { transform: translateX(320%) skewX(-12deg) } }
        @keyframes lw-bar { from { transform: translateX(-100%) } to { transform: translateX(300%) } }
        @keyframes lw-roll { to { transform: rotate(360deg) } }
        @keyframes lw-dot { 0%,80%,100% { opacity: .15 } 40% { opacity: 1 } }
        @media (prefers-reduced-motion: reduce) { .lw-big { animation: none !important } }
      `}</style>
    </div>
  )
}
