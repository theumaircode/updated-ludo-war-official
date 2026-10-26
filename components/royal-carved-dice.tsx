'use client'

import React from 'react'
import { DICE_SKINS, DiceSkinId } from '@/lib/game-types'

interface RoyalCarvedDiceProps {
  value: number
  isRolling: boolean
  canRoll: boolean
  onRoll: () => void
  skinId: DiceSkinId
  activeFactionColor: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

// Exact mathematical SVG coordinates on a 100x100 die face so pips NEVER touch or blur
const PIP_COORDS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [
    [29, 29],
    [71, 71],
  ],
  3: [
    [28, 28],
    [50, 50],
    [72, 72],
  ],
  4: [
    [29, 29],
    [71, 29],
    [29, 71],
    [71, 71],
  ],
  5: [
    [28, 28],
    [72, 28],
    [50, 50],
    [28, 72],
    [72, 72],
  ],
  6: [
    [31, 24],
    [69, 24],
    [31, 50],
    [69, 50],
    [31, 76],
    [69, 76],
  ],
}

export function RoyalCarvedDice({
  value,
  isRolling,
  canRoll,
  onRoll,
  skinId,
  activeFactionColor,
  size = 'md',
  showLabel = true,
}: RoyalCarvedDiceProps) {
  const skin = DICE_SKINS[skinId] || DICE_SKINS['ruby-diamond']
  const coords = PIP_COORDS[value] || PIP_COORDS[6]

  const dimensions =
    size === 'lg'
      ? 'w-20 h-20 sm:w-24 sm:h-24'
      : size === 'md'
        ? 'w-14 h-14 sm:w-16 sm:h-16'
        : size === 'sm'
          ? 'w-11 h-11 sm:w-12 sm:h-12'
          : 'w-10 h-10 sm:w-11 sm:h-11'

  const pipRadius = value === 1 ? 10.5 : 8.2

  return (
    <div className="relative flex flex-col items-center select-none shrink-0">
      {/* Subtle turn halo beneath the Dice (kept outside the die face so pips stay razor-sharp) */}
      {canRoll && (
        <div
          className="absolute -inset-1.5 rounded-2xl blur-sm animate-pulse-aura pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${activeFactionColor}99 0%, transparent 72%)`,
          }}
        />
      )}

      <button
        type="button"
        disabled={!canRoll || isRolling}
        onClick={onRoll}
        aria-label={`Roll Cosmic Dice, current value ${value}`}
        className={`relative ${dimensions} rounded-[22%] p-0.5 transition-all duration-300 ${
          canRoll
            ? 'cursor-pointer hover:scale-105 active:scale-95 ring-2 ring-amber-300'
            : 'cursor-default opacity-95'
        } ${isRolling ? 'animate-spin' : ''}`}
        style={{
          background: skin.frameGradient,
          boxShadow: canRoll
            ? `0 6px 16px rgba(0,0,0,0.92), 0 0 10px ${activeFactionColor}66, inset 0 1px 2px rgba(255,255,255,0.65)`
            : '0 4px 12px rgba(0,0,0,0.88), inset 0 1px 2px rgba(255,255,255,0.35)',
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full block pointer-events-none select-none"
        >
          {/* Outer Bevel Trim */}
          <rect
            x="3"
            y="3"
            width="94"
            height="94"
            rx="20"
            fill="#070a12"
            stroke={skin.ringAccent}
            strokeWidth="2.5"
          />

          {/* Inner Die Face Chamber */}
          <rect
            x="8"
            y="8"
            width="84"
            height="84"
            rx="16"
            fill="#0b0f1c"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1.4"
          />

          {/* Subtle Corner Rivets */}
          <circle cx="14" cy="14" r="1.8" fill={skin.ringAccent} opacity="0.7" />
          <circle cx="86" cy="14" r="1.8" fill={skin.ringAccent} opacity="0.7" />
          <circle cx="14" cy="86" r="1.8" fill={skin.ringAccent} opacity="0.7" />
          <circle cx="86" cy="86" r="1.8" fill={skin.ringAccent} opacity="0.7" />

          {/* Razor-Sharp Precision Pips (Zero Blur, Zero Overlap) */}
          {coords.map(([cx, cy], idx) => (
            <g key={idx}>
              {/* Crisp Dark Recessed Socket Ring for Maximum Contrast */}
              <circle
                cx={cx}
                cy={cy}
                r={pipRadius + 2.2}
                fill="#000000"
              />
              {/* Solid High-Contrast Pip */}
              <circle
                cx={cx}
                cy={cy}
                r={pipRadius}
                fill="#ffffff"
                stroke={skin.ringAccent}
                strokeWidth="1.4"
              />
              {/* Crisp Specular Highlight Dot */}
              <circle
                cx={cx - pipRadius * 0.28}
                cy={cy - pipRadius * 0.28}
                r={pipRadius * 0.24}
                fill="#ffffff"
              />
            </g>
          ))}
        </svg>
      </button>

      {showLabel && canRoll && !isRolling && (
        <span className="mt-1 text-[8px] sm:text-[9px] font-display tracking-[0.14em] uppercase text-amber-300 font-bold animate-pulse whitespace-nowrap">
          TAP DICE
        </span>
      )}
    </div>
  )
}
