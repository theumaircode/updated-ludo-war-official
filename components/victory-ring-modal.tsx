'use client'

import React from 'react'
import { Coins, RotateCcw, Swords } from 'lucide-react'
import { FACTIONS, PlayerState } from '@/lib/game-types'
import { BlackHoleSingularity } from './black-hole-singularity'

interface VictoryRingModalProps {
  winner: PlayerState | null
  onPlayAgain: () => void
  onReturnLobby: () => void
  rewardGold?: number
}

export function VictoryRingModal({
  winner,
  onPlayAgain,
  onReturnLobby,
  rewardGold = 500,
}: VictoryRingModalProps) {
  if (!winner) return null

  const faction = FACTIONS[winner.faction]
  const eliminations = winner.capturesCount
  const ringMask = 'radial-gradient(circle, #000 25%, transparent 68%)'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Victory: ${winner.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/95 backdrop-blur-md p-6"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 44%, ${faction.primaryHex}55 0%, ${faction.primaryHex}1a 35%, transparent 65%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none animate-victory-flash"
        style={{
          background: `radial-gradient(circle at 50% 44%, #ffffff 0%, ${faction.glowHex} 25%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center">
        <p
          className="animate-victory-rise flex items-center gap-3 font-display text-xs font-bold uppercase tracking-[0.4em]"
          style={{ color: faction.glowHex, animationDelay: '150ms' }}
        >
          <span className="h-px w-8" style={{ background: faction.glowHex }} />
          {winner.name} · {faction.colorName}
          <span className="h-px w-8" style={{ background: faction.glowHex }} />
        </p>

        <h2
          className="animate-victory-rise mt-3 font-display text-5xl sm:text-6xl font-black uppercase tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_4px_24px_rgba(245,158,11,0.55)]"
          style={{ animationDelay: '300ms' }}
        >
          Victory
        </h2>

        <div
          className="animate-victory-rise relative my-9 flex h-52 w-52 items-center justify-center sm:h-60 sm:w-60"
          style={{ animationDelay: '450ms' }}
        >
          <div
            aria-hidden="true"
            className="absolute w-[190%] aspect-square rounded-full animate-spin-slow opacity-70"
            style={{
              background: `repeating-conic-gradient(from 0deg, transparent 0deg 10deg, ${faction.glowHex}55 14deg, transparent 18deg 30deg)`,
              maskImage: ringMask,
              WebkitMaskImage: ringMask,
            }}
          />
          <div
            aria-hidden="true"
            className="absolute -inset-[12%] rounded-full blur-2xl"
            style={{
              background: `radial-gradient(circle, ${faction.primaryHex}66 0%, transparent 70%)`,
            }}
          />
          <BlackHoleSingularity absorbedPieces={[]} size="showcase" />
        </div>

        <div
          className="animate-victory-rise flex items-center gap-5 font-display text-sm font-bold uppercase tracking-[0.2em]"
          style={{ animationDelay: '600ms' }}
        >
          <span className="flex items-center gap-2 text-amber-200">
            <Coins className="h-4 w-4 text-amber-400" aria-hidden="true" />
            {`+${rewardGold} Gold`}
          </span>
          <span className="h-4 w-px bg-white/20" aria-hidden="true" />
          <span className="flex items-center gap-2 text-white/85">
            <Swords
              className="h-4 w-4"
              style={{ color: faction.glowHex }}
              aria-hidden="true"
            />
            {`${eliminations} ${eliminations === 1 ? 'Elimination' : 'Eliminations'}`}
          </span>
        </div>

        <div
          className="animate-victory-rise mt-10 flex w-full flex-col gap-3"
          style={{ animationDelay: '750ms' }}
        >
          <button
            type="button"
            onClick={onPlayAgain}
            className="imperial-button flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-display text-sm font-bold uppercase tracking-[0.25em] text-amber-100 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Rematch
          </button>
          <button
            type="button"
            onClick={onReturnLobby}
            className="w-full rounded-xl py-3 font-display text-xs font-bold uppercase tracking-[0.3em] text-white/60 transition-colors hover:text-white cursor-pointer"
          >
            War Hub
          </button>
        </div>
      </div>
    </div>
  )
}
