'use client'

import React, { useEffect, useState } from 'react'
import { Clock, Lock, Sparkles, X } from 'lucide-react'
import { soundEngine } from '@/lib/sound-engine'

interface DailySpinWheelProps {
  isOpen: boolean
  onClose: () => void
  lastSpinTimestamp: number | null
  onClaimReward: (goldAmount: number, timestamp: number) => void
}

const WHEEL_SEGMENTS = [
  { label: '250 GOLD', amount: 250, color: '#1e1b4b', accent: '#c084fc' },
  { label: '500 GOLD', amount: 500, color: '#271709', accent: '#f59e0b' },
  { label: '1,000 GOLD', amount: 1000, color: '#3b0764', accent: '#fde047' },
  { label: '350 GOLD', amount: 350, color: '#062c1e', accent: '#34d399' },
  { label: '750 GOLD', amount: 750, color: '#311016', accent: '#f87171' },
  { label: '450 GOLD', amount: 450, color: '#172554', accent: '#60a5fa' },
  { label: '1,500 JACKPOT', amount: 1500, color: '#422006', accent: '#fef08a' },
  { label: '600 GOLD', amount: 600, color: '#1f1633', accent: '#e879f9' },
]

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000

export function DailySpinWheel({
  isOpen,
  onClose,
  lastSpinTimestamp,
  onClaimReward,
}: DailySpinWheelProps) {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [wonSegment, setWonSegment] = useState<(typeof WHEEL_SEGMENTS)[0] | null>(
    null
  )
  const [nowMs, setNowMs] = useState<number>(() => Date.now())

  useEffect(() => {
    if (!isOpen) return
    setNowMs(Date.now())
    const interval = setInterval(() => {
      setNowMs(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [isOpen])

  if (!isOpen) return null

  const elapsed = lastSpinTimestamp ? nowMs - lastSpinTimestamp : TWENTY_FOUR_HOURS_MS
  const remainingMs = Math.max(0, TWENTY_FOUR_HOURS_MS - elapsed)
  const isLocked = remainingMs > 0

  const formatCountdown = (ms: number) => {
    const totalSec = Math.ceil(ms / 1000)
    const hrs = Math.floor(totalSec / 3600)
    const mins = Math.floor((totalSec % 3600) / 60)
    const secs = totalSec % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(
      2,
      '0'
    )}:${String(secs).padStart(2, '0')}`
  }

  const handleSpin = () => {
    if (isLocked || isSpinning) return
    setIsSpinning(true)
    setWonSegment(null)

    const targetIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length)
    const segmentAngle = 360 / WHEEL_SEGMENTS.length
    // Land cleanly on target segment
    const extraSpins = 6 * 360
    const targetRotation =
      rotation +
      extraSpins +
      (360 - targetIndex * segmentAngle - segmentAngle / 2)

    setRotation(targetRotation)

    // Audio ticks during spin
    let ticks = 0
    const tickTimer = setInterval(() => {
      ticks += 1
      soundEngine.playWheelTick()
      if (ticks > 22) clearInterval(tickTimer)
    }, 140)

    setTimeout(() => {
      clearInterval(tickTimer)
      const reward = WHEEL_SEGMENTS[targetIndex]
      setWonSegment(reward)
      setIsSpinning(false)
      soundEngine.playVictoryFanfare()
      const spinTime = Date.now()
      setNowMs(spinTime)
      onClaimReward(reward.amount, spinTime)
    }, 3600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="imperial-panel relative w-full max-w-lg rounded-2xl p-6 text-amber-100 border border-amber-500/40">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-black/60 border border-amber-500/30 text-amber-200 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-widest uppercase mb-2">
            <Clock className="w-3.5 h-3.5" />
            STRICT 24-HOUR IMPERIAL DECREE
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-wider text-amber-200">
            WHEEL OF THE SINGULARITY
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Permitted strictly once every 24 hours. Claim Imperial Gold to unlock
            Board, Piece, and Royal Dice skins.
          </p>
        </div>

        {/* Astrolabe Wheel */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-4 flex items-center justify-center">
          {/* Top Pointer */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
          </div>

          {/* Rotating Wheel SVG */}
          <div
            className="w-full h-full rounded-full border-4 border-amber-400/80 shadow-[0_0_45px_rgba(168,85,247,0.45)] overflow-hidden"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? 'transform 3.6s cubic-bezier(0.12, 0.8, 0.18, 1)'
                : 'none',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {WHEEL_SEGMENTS.map((seg, i) => {
                const startAngle = (i * 45 - 90) * (Math.PI / 180)
                const endAngle = ((i + 1) * 45 - 90) * (Math.PI / 180)
                const x1 = 50 + 50 * Math.cos(startAngle)
                const y1 = 50 + 50 * Math.sin(startAngle)
                const x2 = 50 + 50 * Math.cos(endAngle)
                const y2 = 50 + 50 * Math.sin(endAngle)
                const midAngle = i * 45 + 22.5

                return (
                  <g key={i}>
                    <path
                      d={`M50,50 L${x1},${y1} A50,50 0 0,1 ${x2},${y2} Z`}
                      fill={seg.color}
                      stroke="#d4af37"
                      strokeWidth="0.6"
                    />
                    <g
                      transform={`translate(50,50) rotate(${midAngle}) translate(0,-32)`}
                    >
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        fill={seg.accent}
                        fontSize="4.2"
                        fontWeight="bold"
                      >
                        {seg.label}
                      </text>
                    </g>
                  </g>
                )
              })}
              <circle
                cx="50"
                cy="50"
                r="10"
                fill="#09070f"
                stroke="#fde047"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>

        {wonSegment && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/15 border border-amber-400/50 text-center">
            <p className="text-xs uppercase tracking-widest text-amber-300">
              SINGULARITY TRIBUTE GRANTED
            </p>
            <p className="text-xl font-display font-bold text-white mt-0.5">
              +{wonSegment.amount} IMPERIAL GOLD
            </p>
          </div>
        )}

        {/* Action Button or 24h Strict Lock */}
        {isLocked ? (
          <div className="w-full py-3.5 px-4 rounded-xl bg-slate-950/90 border border-amber-500/25 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-400">
              <Lock className="w-4 h-4 text-amber-400" />
              <span className="text-xs sm:text-sm uppercase tracking-wider font-semibold">
                24-HOUR LOCK ACTIVE
              </span>
            </div>
            <span className="font-mono text-base sm:text-lg font-bold text-amber-300 tracking-widest">
              {formatCountdown(remainingMs)}
            </span>
          </div>
        ) : (
          <button
            type="button"
            disabled={isSpinning}
            onClick={handleSpin}
            className="imperial-button w-full py-3.5 rounded-xl font-display font-bold text-base tracking-[0.2em] uppercase text-amber-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            {isSpinning ? 'CHANNELING SINGULARITY...' : 'SPIN DAILY WHEEL (1 / 24H)'}
          </button>
        )}
      </div>
    </div>
  )
}
