'use client'

import React from 'react'
import { FACTIONS, PieceInstance, SCULPTED_PIECES } from '@/lib/game-types'

interface BlackHoleSingularityProps {
  absorbedPieces: PieceInstance[]
  recentAbsorbedPiece?: PieceInstance | null
  size?: 'board' | 'showcase'
}

/**
 * THE BLACK HOLE SINGULARITY & ANCIENT GREEK UNIVERSE RULING RING
 * Sculpted as an awe-inspiring Ancient Greek Olympus / Antikythera Celestial Ring of Power
 * suspended inside a relativistic black hole event horizon.
 */
export function BlackHoleSingularity({
  absorbedPieces,
  recentAbsorbedPiece,
  size = 'board',
}: BlackHoleSingularityProps) {
  const isBoard = size === 'board'

  // 12 Olympian radial spokes for the Ancient Greek Antikythera Ring
  const spokes = Array.from({ length: 12 }, (_, i) => i * 30)
  // 24 Greek Meander (Greek Key) crenellations around the outer gold band
  const meanderTicks = Array.from({ length: 24 }, (_, i) => i * 15)

  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none pointer-events-none"
      style={{ perspective: '800px' }}
    >
      {/* 1. Outer Gravitational Lensing Shockwave Halo */}
      <div
        className="absolute inset-[-14%] rounded-full animate-pulse-aura"
        style={{
          background:
            'radial-gradient(circle, rgba(245,158,11,0.42) 0%, rgba(168,85,247,0.45) 46%, rgba(234,88,12,0.22) 68%, transparent 78%)',
        }}
      />

      {/* 2. Relativistic Golden-Violet Accretion Vortex */}
      <div
        className="absolute inset-[-4%] rounded-full animate-spin-slow"
        style={{
          background:
            'conic-gradient(from 0deg, #f59e0b, #7e22ce, #fef08a, #a855f7, #ea580c, #4c1d95, #fde047, #f59e0b)',
          filter: 'blur(2.5px)',
          boxShadow:
            '0 0 32px rgba(245, 158, 11, 0.8), inset 0 0 22px rgba(168, 85, 247, 0.9)',
        }}
      />

      {/* 3. Counter-Rotating Deep Space Photon Sphere & Spiral Nebula */}
      <div
        className="absolute inset-[4%] rounded-full animate-spin-reverse-slow overflow-hidden"
        style={{
          background:
            'radial-gradient(circle, #000000 32%, #1e0538 54%, #6b21a8 72%, #d97706 90%, #fef08a 100%)',
          boxShadow: 'inset 0 0 26px #000000',
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-80">
          <defs>
            <radialGradient id="bhSpiralGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="1" />
              <stop offset="48%" stopColor="#a855f7" stopOpacity="0.85" />
              <stop offset="82%" stopColor="#f59e0b" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M50,50 C68,32 86,46 78,68 C70,88 40,92 24,74 C10,58 18,26 42,16 C64,8 88,24 90,48"
            fill="none"
            stroke="url(#bhSpiralGlow)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M50,50 C32,68 14,54 22,32 C30,12 60,8 76,26 C90,42 82,74 58,84"
            fill="none"
            stroke="#fef08a"
            strokeWidth="1.5"
            strokeOpacity="0.65"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 4. Pitch-Black Event Horizon Singularity Core */}
      <div
        className="relative w-[72%] h-[72%] rounded-full bg-black flex items-center justify-center"
        style={{
          boxShadow:
            '0 0 24px 8px #000000, 0 0 38px 12px rgba(168, 85, 247, 0.7), inset 0 0 28px rgba(250, 204, 21, 0.35)',
          border: '1.5px solid rgba(254, 240, 138, 0.75)',
        }}
      >
        {/* ================================================================= */}
        {/* MASTERPIECE ANCIENT GREEK UNIVERSE RULING RING (ANTIKYTHERA ART)  */}
        {/* ================================================================= */}
        <div className="relative w-[92%] h-[92%] flex items-center justify-center animate-float-ring">
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full overflow-visible drop-shadow-[0_0_14px_rgba(250,204,21,0.95)]"
          >
            <defs>
              {/* 3D Sculpted Olympus 24K Gold Metallic Gradient */}
              <linearGradient
                id="olympusGoldBand"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="18%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#eab308" />
                <stop offset="62%" stopColor="#92400e" />
                <stop offset="82%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>

              {/* Ancient Corinthian Bronze & Electrum Inner Bevel */}
              <linearGradient
                id="greekBronzeBevel"
                x1="100%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="35%" stopColor="#b45309" />
                <stop offset="70%" stopColor="#451a03" />
                <stop offset="100%" stopColor="#fde047" />
              </linearGradient>

              {/* Celestial Astral Core Glow */}
              <radialGradient id="singularityEyeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#fef08a" />
                <stop offset="65%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* A. 12 Ancient Greek Olympian Radial Sun-Pillars / Antikythera Gear Teeth */}
            {spokes.map((deg) => (
              <g key={`pillar-${deg}`} transform={`rotate(${deg} 60 60)`}>
                {/* Outer Temple Pediment Tooth */}
                <polygon
                  points="57.5,4 60,0.5 62.5,4 61.5,11 58.5,11"
                  fill="url(#olympusGoldBand)"
                  stroke="#fef08a"
                  strokeWidth="0.4"
                />
                {/* Inner Armillary Spoke */}
                <line
                  x1="60"
                  y1="14"
                  x2="60"
                  y2="38"
                  stroke="url(#olympusGoldBand)"
                  strokeWidth="1.3"
                  strokeOpacity="0.85"
                />
              </g>
            ))}

            {/* B. Outer Heavy Sculpted Olympus Gold Ring Chariot Rim */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="url(#greekBronzeBevel)"
              strokeWidth="11"
            />
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="url(#olympusGoldBand)"
              strokeWidth="8.5"
            />

            {/* C. Ancient Greek Meander (Greek Key / Maiandros) Fretwork Pattern on Outer Band */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#451a03"
              strokeWidth="4.8"
              strokeDasharray="4.2 2.1"
            />
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="#fef08a"
              strokeWidth="2.2"
              strokeDasharray="2.1 4.2"
            />

            {/* 24 Raised Golden Rivet Pearls framing the Greek Key */}
            {meanderTicks.map((deg) => (
              <g key={`pearl-${deg}`} transform={`rotate(${deg} 60 60)`}>
                <circle cx="60" cy="7.5" r="0.95" fill="#ffffff" />
                <circle cx="60" cy="16.5" r="0.85" fill="#fef08a" />
              </g>
            ))}

            {/* D. Second Concentric Antikythera Astrolabe Ring (Counter-Tilted) */}
            <circle
              cx="60"
              cy="60"
              r="37"
              fill="none"
              stroke="url(#olympusGoldBand)"
              strokeWidth="4.2"
            />
            <circle
              cx="60"
              cy="60"
              r="37"
              fill="none"
              stroke="#c084fc"
              strokeWidth="1.4"
              strokeDasharray="3 2.5"
            />

            {/* E. Sacred Greek Geometric Dodecagram (Two Interlocking Hexagrams) */}
            <polygon
              points="60,25 90,77.5 30,77.5"
              fill="none"
              stroke="url(#olympusGoldBand)"
              strokeWidth="1.2"
              strokeOpacity="0.8"
            />
            <polygon
              points="60,95 90,42.5 30,42.5"
              fill="none"
              stroke="url(#olympusGoldBand)"
              strokeWidth="1.2"
              strokeOpacity="0.8"
            />

            {/* F. Inner Sovereign Signet Ring & Greek Laurel / Rune Band */}
            <circle
              cx="60"
              cy="60"
              r="24"
              fill="rgba(5, 2, 12, 0.9)"
              stroke="url(#olympusGoldBand)"
              strokeWidth="4.5"
            />
            <circle
              cx="60"
              cy="60"
              r="24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.9"
              strokeDasharray="1.5 2.5"
            />

            {/* Ancient Greek Inscriptions on the 4 Quadrants (Α, Ω, Δ, Σ) */}
            <text
              x="60"
              y="32"
              textAnchor="middle"
              fill="#fef08a"
              fontSize="5.2"
              fontWeight="900"
              fontFamily="serif"
            >
              Ω
            </text>
            <text
              x="60"
              y="92.5"
              textAnchor="middle"
              fill="#fef08a"
              fontSize="5.2"
              fontWeight="900"
              fontFamily="serif"
            >
              Α
            </text>
            <text
              x="29.5"
              y="62"
              textAnchor="middle"
              fill="#fef08a"
              fontSize="5"
              fontWeight="900"
              fontFamily="serif"
            >
              Δ
            </text>
            <text
              x="90.5"
              y="62"
              textAnchor="middle"
              fill="#fef08a"
              fontSize="5"
              fontWeight="900"
              fontFamily="serif"
            >
              Σ
            </text>

            {/* G. 4 Cardinal Olympian Relics / Crown Jewels Set in Raised Gold Bezels */}
            {/* North: Celestial Diamond Spearhead */}
            <polygon
              points="60,1 66,11 60,18 54,11"
              fill="#38bdf8"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            <polygon points="60,3.5 63,11 60,15 57,11" fill="#e0f2fe" />

            {/* South: Solar Sovereign Amber Jewel */}
            <polygon
              points="60,119 66,109 60,102 54,109"
              fill="#f59e0b"
              stroke="#fef08a"
              strokeWidth="1.5"
            />
            {/* West: Crimson Imperium Ruby */}
            <polygon
              points="1,60 11,54 18,60 11,66"
              fill="#ef4444"
              stroke="#fef08a"
              strokeWidth="1.5"
            />
            {/* East: Sylvan Emerald Jewel */}
            <polygon
              points="119,60 109,54 102,60 109,66"
              fill="#10b981"
              stroke="#fef08a"
              strokeWidth="1.5"
            />

            {/* H. Center Singularity All-Ruling Eye of the Cosmos */}
            <circle cx="60" cy="60" r="14" fill="url(#singularityEyeGlow)" />
            <circle
              cx="60"
              cy="60"
              r="7.5"
              fill="#000000"
              stroke="#fef08a"
              strokeWidth="1.8"
            />
            <circle cx="60" cy="60" r="3" fill="#ffffff" />
          </svg>
        </div>
      </div>

      {/* 5. Orbiting Ascended Relics around the Event Horizon */}
      {isBoard && absorbedPieces.length > 0 && (
        <div className="absolute inset-0 animate-spin-slow">
          {absorbedPieces.map((p, i) => {
            const angle = (i / absorbedPieces.length) * Math.PI * 2
            const r = 45
            const x = 50 + Math.cos(angle) * r
            const y = 50 + Math.sin(angle) * r
            const faction = FACTIONS[p.faction]
            return (
              <div
                key={p.id}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  backgroundColor: faction.primaryHex,
                  boxShadow: `0 0 10px ${faction.glowHex}`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-amber-200"
              />
            )
          })}
        </div>
      )}

      {/* 6. Dramatic Singularity Absorption Animation when a Piece Enters the Ring */}
      {recentAbsorbedPiece && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-300 animate-black-hole-suck">
            <img
              src={
                SCULPTED_PIECES.find(
                  (s) => s.id === recentAbsorbedPiece.sculptType
                )?.image || '/images/piece-crown.jpg'
              }
              alt="Relic ascending into Black Hole"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  )
}
