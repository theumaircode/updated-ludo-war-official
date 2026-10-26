'use client'

import React, { useEffect, useRef, useState } from 'react'
import { soundEngine } from '@/lib/sound-engine'

interface StudioSplashProps {
  onComplete: () => void
}

type Phase = 'enter' | 'hold' | 'exit'

const TOTAL_MS = 5000
const EXIT_AT_MS = 3700

export function StudioSplash({ onComplete }: StudioSplashProps) {
  const [phase, setPhase] = useState<Phase>('enter')
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const doneRef = useRef(false)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    onCompleteRef.current()
  }

  useEffect(() => {
    soundEngine.playStudioIntro()
    const holdTimer = setTimeout(() => setPhase('hold'), 60)
    const exitTimer = setTimeout(() => setPhase('exit'), EXIT_AT_MS)
    const doneTimer = setTimeout(finish, TOTAL_MS)
    return () => {
      clearTimeout(holdTimer)
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  const handleTap = () => {
    // Audio contexts on Android WebViews need a user gesture; first tap unlocks the score.
    soundEngine.playStudioIntro()
    try {
      if (typeof document !== 'undefined' && !document.fullscreenElement) {
        document.documentElement
          .requestFullscreen?.({ navigationUI: 'hide' })
          .catch(() => {})
      }
      const orientation = (
        typeof screen !== 'undefined' ? screen.orientation : undefined
      ) as unknown as { lock?: (o: string) => Promise<void> } | undefined
      orientation?.lock?.('portrait').catch(() => {})
    } catch {
      // Native immersive activity may already restrict these APIs.
    }
  }

  const textStyle: React.CSSProperties =
    phase === 'enter'
      ? { opacity: 0, letterSpacing: '0.22em', filter: 'blur(10px)', transform: 'scale(0.97)' }
      : phase === 'hold'
        ? { opacity: 1, letterSpacing: '0.32em', filter: 'blur(0)', transform: 'scale(1)' }
        : { opacity: 0, letterSpacing: '0.4em', filter: 'blur(6px)', transform: 'scale(1.03)' }

  return (
    <div
      onClick={handleTap}
      role="presentation"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black select-none overflow-hidden"
      style={{
        opacity: phase === 'exit' ? 0 : 1,
        transition: 'opacity 1200ms cubic-bezier(0.4,0,0.2,1) 100ms',
      }}
    >
      <h1
        className="px-6 font-display font-bold text-2xl sm:text-4xl md:text-5xl text-white uppercase whitespace-nowrap"
        style={{
          ...textStyle,
          textShadow: '0 0 38px rgba(255,255,255,0.25)',
          transition:
            phase === 'hold'
              ? 'all 1800ms cubic-bezier(0.16,1,0.3,1)'
              : 'all 1300ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        THE UMAIR CODE®
      </h1>
    </div>
  )
}
