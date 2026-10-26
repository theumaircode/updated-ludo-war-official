'use client'

import { useEffect, useRef, useState } from 'react'

interface GameLoadingScreenProps {
  onComplete: () => void
}

const DURATION_MS = 5200
const TIPS = [
  'Summoning the four factions...',
  'Charging the Black Hole...',
  'Forging the Universe Ruling Ring...',
  'Preparing the battlefield...',
]

const EMBERS = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: (i * 0.41) % 6,
  duration: 4 + ((i * 1.7) % 4),
  size: 2 + (i % 4),
  hue: ['#ffb347', '#ff5a36', '#7dd3fc', '#86efac'][i % 4],
}))

export function GameLoadingScreen({ onComplete }: GameLoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    let raf = 0
    const start = performance.now()
    let exitTimer: ReturnType<typeof setTimeout> | undefined
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS)
      const eased = 1 - Math.pow(1 - t, 2.2)
      setProgress(Math.round(eased * 100))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setExiting(true)
        exitTimer = setTimeout(() => onCompleteRef.current(), 700)
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
      style={{ opacity: exiting ? 0 : 1, transition: 'opacity 700ms ease', animation: 'lw-fade-in 900ms ease both' }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-full aspect-[1193/2652] max-w-none" style={{ minWidth: '100%' }}>
          <img
            src="/images/loading-scene.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ animation: 'lw-kenburns 9s ease-in-out infinite alternate' }}
          />

          <div
            aria-hidden
            className="absolute left-1/2 top-[25.5%] w-[85%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0 10%, rgba(255,190,80,0.35) 15%, transparent 25% 45%, rgba(140,120,255,0.3) 55%, transparent 65% 80%, rgba(255,160,60,0.3) 88%, transparent)',
              filter: 'blur(14px)',
              animation: 'lw-spin 7s linear infinite',
            }}
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-[25.5%] w-[42%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
            style={{
              background: 'radial-gradient(circle, transparent 38%, rgba(255,200,90,0.55) 52%, transparent 70%)',
              animation: 'lw-pulse 2.2s ease-in-out infinite',
            }}
          />

          <div
            aria-hidden
            className="absolute left-[5%] top-[4%] w-[90%] h-[11%] mix-blend-screen"
            style={{
              background: 'linear-gradient(100deg, transparent 30%, rgba(255,240,190,0.55) 50%, transparent 70%)',
              backgroundSize: '250% 100%',
              animation: 'lw-shine 3.2s ease-in-out infinite',
              WebkitMaskImage: 'radial-gradient(ellipse at center, #000 55%, transparent 75%)',
              maskImage: 'radial-gradient(ellipse at center, #000 55%, transparent 75%)',
            }}
          />

          <div aria-hidden className="absolute left-[8%] top-[48%] w-[30%] h-[12%] rounded-full mix-blend-screen bg-sky-400/40 blur-2xl" style={{ animation: 'lw-flicker 1.7s infinite' }} />
          <div aria-hidden className="absolute right-[6%] top-[48%] w-[30%] h-[12%] rounded-full mix-blend-screen bg-amber-300/40 blur-2xl" style={{ animation: 'lw-flicker 2.1s 0.4s infinite' }} />
          <div aria-hidden className="absolute left-[0%] top-[66%] w-[42%] h-[18%] rounded-full mix-blend-screen bg-orange-500/35 blur-3xl" style={{ animation: 'lw-flicker 1.3s 0.2s infinite' }} />
          <div aria-hidden className="absolute right-[0%] top-[66%] w-[42%] h-[18%] rounded-full mix-blend-screen bg-green-500/35 blur-3xl" style={{ animation: 'lw-flicker 1.9s 0.7s infinite' }} />

          <div aria-hidden className="absolute inset-0 pointer-events-none">
            {EMBERS.map((e, i) => (
              <span
                key={i}
                className="absolute bottom-[-2%] rounded-full"
                style={{
                  left: `${e.left}%`,
                  width: e.size,
                  height: e.size,
                  background: e.hue,
                  boxShadow: `0 0 8px ${e.hue}`,
                  animation: `lw-ember ${e.duration}s ${e.delay}s linear infinite`,
                }}
              />
            ))}
          </div>

          <div className="absolute left-0 right-0 bottom-[3%] flex flex-col items-center gap-2 px-[11%]">
            <p className="font-display font-bold text-amber-200 text-lg sm:text-2xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              {'Loading... '}
              {progress}%
            </p>
            <div className="relative w-full h-4 sm:h-5 rounded-full border-2 border-amber-400/80 bg-black/80 shadow-[0_0_18px_rgba(251,191,36,0.6)]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg,#b45309,#fbbf24,#fde68a,#fbbf24)',
                  backgroundSize: '200% 100%',
                  animation: 'lw-shine 1.4s linear infinite',
                  boxShadow: '0 0 12px rgba(253,230,138,0.9)',
                }}
              />
              <div
                aria-hidden
                className="absolute top-1/2 h-8 w-8 sm:h-10 sm:w-10 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-amber-300 bg-gradient-to-br from-amber-800 to-stone-950 grid grid-cols-3 grid-rows-3 p-1 shadow-[0_0_16px_rgba(251,191,36,0.9)]"
                style={{ left: `${progress}%`, animation: 'lw-roll 0.9s linear infinite' }}
              >
                {[0, 2, 4, 6, 8].map((cell) => (
                  <span key={cell} className="h-1.5 w-1.5 rounded-full bg-amber-200 place-self-center" style={{ gridArea: `${Math.floor(cell / 3) + 1} / ${(cell % 3) + 1}` }} />
                ))}
              </div>
            </div>
            <p className="mt-1 text-center text-amber-100/90 text-xs sm:text-sm font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {tip}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes lw-fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes lw-kenburns { from { transform: scale(1.02) translateY(0) } to { transform: scale(1.1) translateY(-1.5%) } }
        @keyframes lw-spin { to { transform: translate(-50%, -50%) rotate(360deg) } }
        @keyframes lw-pulse { 0%,100% { opacity: .5; transform: translate(-50%,-50%) scale(.95) } 50% { opacity: 1; transform: translate(-50%,-50%) scale(1.08) } }
        @keyframes lw-shine { 0% { background-position: 150% 0 } 100% { background-position: -50% 0 } }
        @keyframes lw-flicker { 0%,100% { opacity: .35 } 20% { opacity: .9 } 22% { opacity: .4 } 60% { opacity: .75 } }
        @keyframes lw-ember { 0% { transform: translateY(0) translateX(0); opacity: 0 } 10% { opacity: 1 } 100% { transform: translateY(-105vh) translateX(30px); opacity: 0 } }
        @keyframes lw-roll { to { transform: translate(-50%, -50%) rotate(360deg) } }
        @media (prefers-reduced-motion: reduce) { [style*="lw-"] { animation: none !important } }
      `}</style>
    </div>
  )
}
