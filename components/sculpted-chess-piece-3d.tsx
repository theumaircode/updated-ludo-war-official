'use client'

import React from 'react'
import {
  FactionId,
  FACTIONS,
  PieceSculptType,
  PieceSkinId,
} from '@/lib/game-types'

interface SculptedChessPiece3DProps {
  sculptType: PieceSculptType
  faction: FactionId
  skinId?: PieceSkinId
  className?: string
  isGlowing?: boolean
}

interface FactionBodyPalette {
  dark: string
  deep: string
  mid: string
  light: string
  highlight: string
  coreGlow: string
}

const FACTION_BODY_PALETTES: Record<FactionId, FactionBodyPalette> = {
  crimson: {
    dark: '#3b0404',
    deep: '#991b1b',
    mid: '#dc2626',
    light: '#ef4444',
    highlight: '#fca5a5',
    coreGlow: '#f87171',
  },
  emerald: {
    dark: '#022c22',
    deep: '#065f46',
    mid: '#059669',
    light: '#10b981',
    highlight: '#6ee7b7',
    coreGlow: '#34d399',
  },
  sapphire: {
    dark: '#0a1936',
    deep: '#1e3a8a',
    mid: '#1d4ed8',
    light: '#3b82f6',
    highlight: '#93c5fd',
    coreGlow: '#60a5fa',
  },
  gold: {
    dark: '#3d1d02',
    deep: '#854d0e',
    mid: '#ca8a04',
    light: '#eab308',
    highlight: '#fef08a',
    coreGlow: '#facc15',
  },
  amethyst: {
    dark: '#24074d',
    deep: '#581c87',
    mid: '#7e22ce',
    light: '#a855f7',
    highlight: '#d8b4fe',
    coreGlow: '#c084fc',
  },
  cyan: {
    dark: '#042633',
    deep: '#155e75',
    mid: '#0891b2',
    light: '#06b6d4',
    highlight: '#67e8f9',
    coreGlow: '#22d3ee',
  },
}

/**
 * Full-Body Faction-Colored 3D Sculpted Relics:
 * 1. 'crown' — Sovereign Imperial Crown
 * 2. 'horse' — Royal Warhorse Knight
 * 3. 'alien' — Void Alien Archon
 * 4. 'human' — High King Human
 *
 * Every piece's entire body is 100% its player's faction color (Red, Green, Blue, Yellow, Purple, Cyan)
 * with razor-sharp white (#ffffff) and black (#05070d) structural bordering, lining, eyes, and base.
 */
export function SculptedChessPiece3D({
  sculptType,
  faction,
  skinId = 'heirloom-gold',
  className = 'w-full h-full',
  isGlowing = false,
}: SculptedChessPiece3DProps) {
  const factionMeta = FACTIONS[faction] || FACTIONS.crimson
  const pal = FACTION_BODY_PALETTES[faction] || FACTION_BODY_PALETTES.crimson
  const uid = `${sculptType}-${faction}-${skinId}`

  // Crisp black & white structural lining calibrated per skin finish while keeping 100% full faction body color
  const isDarkTrimSkin = skinId === 'dark-damascus'
  const outerBorder = '#05070d'
  const innerLine = isDarkTrimSkin ? '#e2e8f0' : '#ffffff'
  const secondaryLine = isDarkTrimSkin ? '#000000' : '#090d16'

  return (
    <svg
      viewBox="0 0 120 155"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} overflow-visible select-none`}
      style={{
        filter: isGlowing
          ? `drop-shadow(0 4px 6px rgba(0,0,0,0.95)) drop-shadow(0 0 9px ${factionMeta.glowHex})`
          : 'drop-shadow(0 4px 5px rgba(0,0,0,0.92))',
      }}
    >
      <defs>
        {/* 100% Faction-Colored 3D Cylindrical Body Gradient */}
        <linearGradient
          id={`body-cyl-${uid}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor={pal.dark} />
          <stop offset="20%" stopColor={pal.deep} />
          <stop offset="46%" stopColor={pal.light} />
          <stop offset="56%" stopColor={pal.highlight} />
          <stop offset="76%" stopColor={pal.mid} />
          <stop offset="100%" stopColor={pal.dark} />
        </linearGradient>

        {/* 100% Faction-Colored Vertical Sculpted Relief Gradient */}
        <linearGradient
          id={`body-vert-${uid}`}
          x1="30%"
          y1="0%"
          x2="70%"
          y2="100%"
        >
          <stop offset="0%" stopColor={pal.highlight} />
          <stop offset="30%" stopColor={pal.light} />
          <stop offset="72%" stopColor={pal.mid} />
          <stop offset="100%" stopColor={pal.dark} />
        </linearGradient>

        {/* 100% Faction-Colored Sculpted Bust / Mane / Armor Gradient */}
        <linearGradient
          id={`body-sculpt-${uid}`}
          x1="15%"
          y1="10%"
          x2="85%"
          y2="90%"
        >
          <stop offset="0%" stopColor={pal.highlight} />
          <stop offset="28%" stopColor={pal.light} />
          <stop offset="65%" stopColor={pal.mid} />
          <stop offset="88%" stopColor={pal.deep} />
          <stop offset="100%" stopColor={pal.dark} />
        </linearGradient>

        {/* Deep Faction Core Gradient */}
        <radialGradient id={`body-gem-${uid}`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="32%" stopColor={pal.highlight} />
          <stop offset="70%" stopColor={pal.mid} />
          <stop offset="100%" stopColor={pal.dark} />
        </radialGradient>

        {/* Deep Faction Cushion Gradient */}
        <radialGradient id={`body-cushion-${uid}`} cx="42%" cy="35%" r="70%">
          <stop offset="0%" stopColor={pal.light} />
          <stop offset="55%" stopColor={pal.mid} />
          <stop offset="100%" stopColor={pal.dark} />
        </radialGradient>
      </defs>

      {/* ================================================================= */}
      {/* SHARED FULL-COLOR 3D PEDESTAL BASE WITH WHITE & BLACK LINING      */}
      {/* ================================================================= */}
      <g>
        {/* Ground Shadow */}
        <ellipse cx="60" cy="147" rx="43" ry="7.5" fill="rgba(0,0,0,0.85)" />

        {/* Faction Ground Rim */}
        <ellipse
          cx="60"
          cy="143"
          rx="41"
          ry="7.5"
          fill={`url(#body-cyl-${uid})`}
          stroke={outerBorder}
          strokeWidth="2.4"
        />
        <ellipse
          cx="60"
          cy="143"
          rx="39"
          ry="6"
          fill="none"
          stroke={innerLine}
          strokeWidth="1.2"
        />

        {/* Lower Flared Plinth Ring */}
        <path
          d="M21 140 C21 133, 99 133, 99 140 L96 144 C96 149, 24 149, 24 144 Z"
          fill={`url(#body-cyl-${uid})`}
          stroke={outerBorder}
          strokeWidth="2.2"
        />

        {/* Tiered Pedestal Body — 100% Player Color */}
        <path
          d="M26 136 C28 122, 34 114, 37 105 L83 105 C86 114, 92 122, 94 136 C94 142, 26 142, 26 136 Z"
          fill={`url(#body-cyl-${uid})`}
          stroke={outerBorder}
          strokeWidth="2.2"
        />

        {/* Crisp White Inner Pedestal Contour Line */}
        <path
          d="M29 135 C31 123, 36 115, 39 107 L81 107 C84 115, 89 123, 91 135"
          fill="none"
          stroke={innerLine}
          strokeWidth="1.2"
          strokeOpacity="0.85"
        />

        {/* Pedestal Band with Black & White Structural Borders */}
        <path
          d="M29 130 C29 125, 91 125, 91 130 L89 136 C89 140, 31 140, 31 136 Z"
          fill={`url(#body-cushion-${uid})`}
          stroke={outerBorder}
          strokeWidth="2"
        />
        <path
          d="M31 128.5 C31 126, 89 126, 89 128.5"
          fill="none"
          stroke={innerLine}
          strokeWidth="1.3"
        />

        {/* Sharp White Filigree Scrollwork on Pedestal */}
        <path
          d="M34 118 Q47 112 60 119 Q73 112 86 118"
          stroke={outerBorder}
          strokeWidth="3.6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M34 118 Q47 112 60 119 Q73 112 86 118"
          stroke={innerLine}
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />

        {/* Upper Pedestal Collar Ring */}
        <path
          d="M36 106 C36 102, 84 102, 84 106 C84 109, 36 109, 36 106 Z"
          fill={`url(#body-cyl-${uid})`}
          stroke={outerBorder}
          strokeWidth="2"
        />
        <path
          d="M38 105.5 C46 103.5, 74 103.5, 82 105.5"
          stroke={innerLine}
          strokeWidth="1.3"
          fill="none"
          strokeLinecap="round"
        />

        {/* 3 High-Contrast Base Nodes (Black Rim + White Ring + Faction Core) */}
        <circle
          cx="39"
          cy="132"
          r="4.2"
          fill={`url(#body-gem-${uid})`}
          stroke={outerBorder}
          strokeWidth="2"
        />
        <circle
          cx="39"
          cy="132"
          r="2.8"
          fill="none"
          stroke={innerLine}
          strokeWidth="1.1"
        />

        <circle
          cx="60"
          cy="133.5"
          r="5"
          fill={`url(#body-gem-${uid})`}
          stroke={outerBorder}
          strokeWidth="2.2"
        />
        <circle
          cx="60"
          cy="133.5"
          r="3.4"
          fill="none"
          stroke={innerLine}
          strokeWidth="1.2"
        />

        <circle
          cx="81"
          cy="132"
          r="4.2"
          fill={`url(#body-gem-${uid})`}
          stroke={outerBorder}
          strokeWidth="2"
        />
        <circle
          cx="81"
          cy="132"
          r="2.8"
          fill="none"
          stroke={innerLine}
          strokeWidth="1.1"
        />
      </g>

      {/* ================================================================= */}
      {/* SCULPT 1: SOVEREIGN ROYAL CROWN — 100% FULL FACTION COLOR         */}
      {/* ================================================================= */}
      {sculptType === 'crown' && (
        <g>
          {/* Crown Neck Column */}
          <path
            d="M39 105 L43 78 L77 78 L81 105 Z"
            fill={`url(#body-cyl-${uid})`}
            stroke={outerBorder}
            strokeWidth="2.2"
          />
          <path
            d="M42 103 L45 80 M78 103 L75 80"
            stroke={innerLine}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M46 95 Q60 85 74 95 M50 86 L60 98 L70 86"
            stroke={outerBorder}
            strokeWidth="3.2"
            fill="none"
          />
          <path
            d="M46 95 Q60 85 74 95 M50 86 L60 98 L70 86"
            stroke={innerLine}
            strokeWidth="1.6"
            fill="none"
          />
          <circle
            cx="60"
            cy="91"
            r="3.5"
            fill="#ffffff"
            stroke={outerBorder}
            strokeWidth="1.6"
          />

          {/* Crown Diadem Band — Full Faction Color + White/Black Lining */}
          <path
            d="M27 72 C27 67, 93 67, 93 72 L90 80 C90 84, 30 84, 30 80 Z"
            fill={`url(#body-cyl-${uid})`}
            stroke={outerBorder}
            strokeWidth="2.2"
          />
          <path
            d="M30 71 C45 68.5, 75 68.5, 90 71"
            stroke={innerLine}
            strokeWidth="1.4"
            fill="none"
          />
          {/* High-Contrast White/Black Jewels (No foreign faction colors!) */}
          <circle
            cx="38"
            cy="75"
            r="3.2"
            fill="#ffffff"
            stroke={outerBorder}
            strokeWidth="1.6"
          />
          <rect
            x="55.5"
            y="71.5"
            width="9"
            height="6.5"
            rx="1.5"
            fill={`url(#body-gem-${uid})`}
            stroke={innerLine}
            strokeWidth="1.5"
          />
          <circle
            cx="82"
            cy="75"
            r="3.2"
            fill="#ffffff"
            stroke={outerBorder}
            strokeWidth="1.6"
          />

          {/* Royal Velvet Cap — 100% Player Faction Color */}
          <path
            d="M28 69 C18 42, 42 28, 60 32 C78 28, 102 42, 92 69 Z"
            fill={`url(#body-cushion-${uid})`}
            stroke={outerBorder}
            strokeWidth="2.4"
          />
          <path
            d="M44 68 C40 48, 48 34, 60 32 C72 34, 80 48, 76 68"
            fill={`url(#body-sculpt-${uid})`}
            stroke={outerBorder}
            strokeWidth="1.4"
          />

          {/* Imperial Arches — Full Faction Color with Crisp Black & White Borders */}
          <path
            d="M28 69 C19 42, 39 24, 60 25"
            stroke={outerBorder}
            strokeWidth="8.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M28 69 C19 42, 39 24, 60 25"
            stroke={`url(#body-vert-${uid})`}
            strokeWidth="5.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M28 69 C19 42, 39 24, 60 25"
            stroke={innerLine}
            strokeWidth="2"
            strokeDasharray="1 5.5"
            fill="none"
            strokeLinecap="round"
          />

          <path
            d="M92 69 C101 42, 81 24, 60 25"
            stroke={outerBorder}
            strokeWidth="8.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M92 69 C101 42, 81 24, 60 25"
            stroke={`url(#body-vert-${uid})`}
            strokeWidth="5.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M92 69 C101 42, 81 24, 60 25"
            stroke={innerLine}
            strokeWidth="2"
            strokeDasharray="1 5.5"
            fill="none"
            strokeLinecap="round"
          />

          <path
            d="M44 69 C41 44, 49 27, 60 25"
            stroke={outerBorder}
            strokeWidth="7.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M44 69 C41 44, 49 27, 60 25"
            stroke={`url(#body-vert-${uid})`}
            strokeWidth="4.8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M44 69 C41 44, 49 27, 60 25"
            stroke={innerLine}
            strokeWidth="1.9"
            strokeDasharray="1 5"
            fill="none"
            strokeLinecap="round"
          />

          <path
            d="M76 69 C79 44, 71 27, 60 25"
            stroke={outerBorder}
            strokeWidth="7.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M76 69 C79 44, 71 27, 60 25"
            stroke={`url(#body-vert-${uid})`}
            strokeWidth="4.8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M76 69 C79 44, 71 27, 60 25"
            stroke={innerLine}
            strokeWidth="1.9"
            strokeDasharray="1 5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Center Vertical Rib */}
          <path
            d="M60 69 L60 24"
            stroke={outerBorder}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M60 69 L60 24"
            stroke={`url(#body-cyl-${uid})`}
            strokeWidth="5.2"
            strokeLinecap="round"
          />
          <path
            d="M60 66 L60 27"
            stroke={innerLine}
            strokeWidth="2.2"
            strokeDasharray="1 5"
            strokeLinecap="round"
          />

          {/* Crown Rim Spikes — Full Faction Color + Crisp White/Black Border */}
          <path
            d="M27 70 L24 58 L32 65 L44 55 L52 65 L60 53 L68 65 L76 55 L88 65 L96 58 L93 70 Z"
            fill={`url(#body-cyl-${uid})`}
            stroke={outerBorder}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M26 60 L32 66 L44 56.5 L52 66 L60 54.5 L68 66 L76 56.5 L88 66 L94 60"
            fill="none"
            stroke={innerLine}
            strokeWidth="1.3"
            strokeLinejoin="round"
          />

          {/* Top Sovereign Globus Cruciger (Orb + Cross) */}
          <circle
            cx="60"
            cy="20"
            r="6.8"
            fill={`url(#body-cyl-${uid})`}
            stroke={outerBorder}
            strokeWidth="2.2"
          />
          <path
            d="M53.5 20 L66.5 20 M60 13.5 L60 26.5"
            stroke={innerLine}
            strokeWidth="1.6"
          />
          <path
            d="M60 3 L60 14 M55 8 L65 8"
            stroke={outerBorder}
            strokeWidth="5.2"
            strokeLinecap="round"
          />
          <path
            d="M60 3 L60 14 M55 8 L65 8"
            stroke={innerLine}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="60" cy="8" r="2" fill={pal.light} />
        </g>
      )}

      {/* ================================================================= */}
      {/* SCULPT 2: ROYAL WARHORSE KNIGHT — 100% FULL FACTION COLOR         */}
      {/* ================================================================= */}
      {sculptType === 'horse' && (
        <g>
          {/* Inner Neck Base */}
          <path
            d="M35 105 C32 86, 36 68, 42 52 L78 66 C82 80, 84 94, 85 105 Z"
            fill={`url(#body-cushion-${uid})`}
            stroke={outerBorder}
            strokeWidth="2.2"
          />

          {/* Sculpted Flowing Mane — Full Faction Color + Black & White Lining */}
          <path
            d="M52 16 C34 18, 20 30, 18 46 C24 42, 30 42, 34 45 C20 52, 14 66, 18 80 C24 75, 30 74, 34 77 C23 84, 22 95, 28 103 C34 98, 39 95, 42 98 Z"
            fill={`url(#body-vert-${uid})`}
            stroke={outerBorder}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path
            d="M49 18 C34 21, 23 31, 21 44 M32 47 C21 53, 17 65, 20 77 M32 79 C25 85, 25 94, 29 100"
            fill="none"
            stroke={innerLine}
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Main Warhorse Head & Neck Body — 100% Player Faction Color */}
          <path
            d="M36 104 C28 82, 26 56, 36 34 C40 24, 48 18, 56 16 L60 7 L65 16 L72 6 L73 18 C84 22, 92 33, 96 46 C99 55, 104 62, 101 69 C98 75, 91 76, 85 72 C79 68, 74 62, 68 62 C69 76, 76 90, 84 104 Z"
            fill={`url(#body-sculpt-${uid})`}
            stroke={outerBorder}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Crisp White Highlight Contour Along Forehead & Snout */}
          <path
            d="M73 19 C83 24, 90 34, 94 46 C97 54, 101 61, 99 67"
            fill="none"
            stroke={innerLine}
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Armored Chamfron Faceplate — Full Faction Color + White/Black Border */}
          <path
            d="M62 18 C75 24, 86 38, 95 56 L88 62 C78 46, 68 34, 56 26 Z"
            fill={`url(#body-cyl-${uid})`}
            stroke={outerBorder}
            strokeWidth="2"
          />
          <path
            d="M62 19.5 C74 25, 84 38, 92.5 55"
            fill="none"
            stroke={innerLine}
            strokeWidth="1.3"
          />

          {/* Bridle & Harness Straps — Crisp Black & White Structural Lining */}
          <path
            d="M54 28 L72 56 L92 64 M72 56 L50 68"
            stroke={outerBorder}
            strokeWidth="5.2"
            strokeLinecap="round"
          />
          <path
            d="M54 28 L72 56 L92 64 M72 56 L50 68"
            stroke={innerLine}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Neck Armor Lames — Black & White Structural Ribs */}
          <path
            d="M38 66 Q58 58 74 72"
            stroke={outerBorder}
            strokeWidth="5.5"
            fill="none"
          />
          <path
            d="M38 66 Q58 58 74 72"
            stroke={innerLine}
            strokeWidth="1.8"
            fill="none"
          />
          <path
            d="M36 82 Q58 74 79 88"
            stroke={outerBorder}
            strokeWidth="6"
            fill="none"
          />
          <path
            d="M36 82 Q58 74 79 88"
            stroke={innerLine}
            strokeWidth="1.9"
            fill="none"
          />
          <path
            d="M35 97 Q60 90 84 101"
            stroke={outerBorder}
            strokeWidth="6.2"
            fill="none"
          />
          <path
            d="M35 97 Q60 90 84 101"
            stroke={innerLine}
            strokeWidth="2"
            fill="none"
          />

          {/* Fierce Warhorse Eye — Pure White Sclera & Sharp Black Pupil */}
          <ellipse
            cx="73"
            cy="37"
            rx="4.8"
            ry="3"
            transform="rotate(18 73 37)"
            fill="#ffffff"
            stroke={outerBorder}
            strokeWidth="1.8"
          />
          <circle cx="74" cy="37" r="1.7" fill={outerBorder} />

          {/* Nostril Detail */}
          <circle cx="94" cy="65" r="2" fill={outerBorder} />

          {/* Harness Nodes — White & Black Rimmed */}
          <circle
            cx="71"
            cy="55"
            r="3.8"
            fill="#ffffff"
            stroke={outerBorder}
            strokeWidth="1.8"
          />
          <ellipse
            cx="64"
            cy="88"
            rx="5.2"
            ry="6.8"
            fill={`url(#body-gem-${uid})`}
            stroke={outerBorder}
            strokeWidth="2"
          />
          <ellipse
            cx="64"
            cy="88"
            rx="3.6"
            ry="5"
            fill="none"
            stroke={innerLine}
            strokeWidth="1.2"
          />
        </g>
      )}

      {/* ================================================================= */}
      {/* SCULPT 3: EXTRATERRESTRIAL ARCHON ALIEN — 100% FULL FACTION COLOR */}
      {/* ================================================================= */}
      {sculptType === 'alien' && (
        <g>
          {/* Alien Exoskeleton Shoulder Pauldrons — Full Faction Color */}
          <path
            d="M16 74 C24 68, 36 72, 43 82 L40 105 L80 105 L77 82 C84 72, 96 68, 104 74 C98 88, 89 98, 82 105 L38 105 C31 98, 22 88, 16 74 Z"
            fill={`url(#body-cyl-${uid})`}
            stroke={outerBorder}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path
            d="M19 75 C26 71, 35 74, 41 82 M101 75 C94 71, 85 74, 79 82"
            fill="none"
            stroke={innerLine}
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Inner Torso Core — Full Faction Color */}
          <path
            d="M36 78 L60 98 L84 78 L80 105 L40 105 Z"
            fill={`url(#body-sculpt-${uid})`}
            stroke={outerBorder}
            strokeWidth="2"
          />
          <path
            d="M39 80 L60 96 L81 80"
            fill="none"
            stroke={innerLine}
            strokeWidth="1.5"
          />

          {/* Swept Horned Crest Left & Right — Full Faction Color + White/Black Border */}
          <path
            d="M38 44 C18 36, 12 18, 23 6 C22 18, 29 27, 44 33 Z"
            fill={`url(#body-vert-${uid})`}
            stroke={outerBorder}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path
            d="M36 41 C21 34, 16 20, 23 9"
            fill="none"
            stroke={innerLine}
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          <path
            d="M82 44 C102 36, 108 18, 97 6 C98 18, 91 27, 76 33 Z"
            fill={`url(#body-vert-${uid})`}
            stroke={outerBorder}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path
            d="M84 41 C99 34, 104 20, 97 9"
            fill="none"
            stroke={innerLine}
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Center Crown Spikes — Full Faction Color */}
          <path
            d="M46 28 L42 10 L54 22 L60 8 L66 22 L78 10 L74 28 Z"
            fill={`url(#body-cyl-${uid})`}
            stroke={outerBorder}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M44 13 L54 23 L60 11 L66 23 L76 13"
            fill="none"
            stroke={innerLine}
            strokeWidth="1.3"
            strokeLinejoin="round"
          />

          {/* Alien Cranium & Face — 100% Player Faction Color */}
          <path
            d="M35 38 C35 20, 85 20, 85 38 C87 54, 77 70, 68 80 C63 85, 57 85, 52 80 C43 70, 33 54, 35 38 Z"
            fill={`url(#body-sculpt-${uid})`}
            stroke={outerBorder}
            strokeWidth="2.5"
          />
          {/* Crisp White Cranial Highlight */}
          <path
            d="M38 37 C38 23, 82 23, 82 37"
            fill="none"
            stroke={innerLine}
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Forehead Crest Shield */}
          <path
            d="M42 32 Q60 18 78 32 Q68 44 60 52 Q52 44 42 32 Z"
            fill={`url(#body-cyl-${uid})`}
            stroke={outerBorder}
            strokeWidth="2"
          />
          <path
            d="M45 32 Q60 21 75 32"
            fill="none"
            stroke={innerLine}
            strokeWidth="1.3"
          />

          {/* Sharp High-Contrast Black & White Alien Eyes (Zero foreign cyan tint!) */}
          <path
            d="M39 48 Q47 42 56 52 Q46 57 39 48 Z"
            fill={secondaryLine}
            stroke={innerLine}
            strokeWidth="1.8"
          />
          <ellipse cx="47.5" cy="49.5" rx="3.8" ry="2" fill="#ffffff" />
          <circle cx="48" cy="49.5" r="1.1" fill={outerBorder} />

          <path
            d="M81 48 Q73 42 64 52 Q74 57 81 48 Z"
            fill={secondaryLine}
            stroke={innerLine}
            strokeWidth="1.8"
          />
          <ellipse cx="72.5" cy="49.5" rx="3.8" ry="2" fill="#ffffff" />
          <circle cx="72" cy="49.5" r="1.1" fill={outerBorder} />

          {/* Cheekbone & Jaw Structural Lining in Black & White */}
          <path
            d="M41 58 L54 68 L60 66 L66 68 L79 58 M54 73 L66 73"
            stroke={outerBorder}
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M41 58 L54 68 L60 66 L66 68 L79 58 M54 73 L66 73"
            stroke={innerLine}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Forehead & Chest Core Nodes — Pure White & Black Rimmed */}
          <circle
            cx="60"
            cy="35"
            r="3.8"
            fill="#ffffff"
            stroke={outerBorder}
            strokeWidth="1.8"
          />
          <circle
            cx="60"
            cy="92"
            r="5"
            fill={`url(#body-gem-${uid})`}
            stroke={outerBorder}
            strokeWidth="2.2"
          />
          <circle
            cx="60"
            cy="92"
            r="3.2"
            fill="none"
            stroke={innerLine}
            strokeWidth="1.2"
          />
        </g>
      )}

      {/* ================================================================= */}
      {/* SCULPT 4: HIGH KING HUMAN BUST — 100% FULL FACTION COLOR          */}
      {/* ================================================================= */}
      {sculptType === 'human' && (
        <g>
          {/* Imperial Brustplate & Pauldrons — 100% Player Faction Color */}
          <path
            d="M17 78 C24 68, 37 64, 48 64 L72 64 C83 64, 96 68, 103 78 C98 92, 88 99, 82 105 L38 105 C32 99, 22 92, 17 78 Z"
            fill={`url(#body-cyl-${uid})`}
            stroke={outerBorder}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M20 78 C26 70, 38 66.5, 48 66.5 L72 66.5 C82 66.5, 94 70, 100 78"
            fill="none"
            stroke={innerLine}
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Breastplate Structural Ribbing in Crisp Black & White */}
          <path
            d="M26 74 Q60 94 94 74"
            stroke={outerBorder}
            strokeWidth="4.2"
            fill="none"
          />
          <path
            d="M26 74 Q60 94 94 74"
            stroke={innerLine}
            strokeWidth="1.8"
            fill="none"
          />
          <path
            d="M34 84 Q60 102 86 84"
            stroke={outerBorder}
            strokeWidth="3.6"
            fill="none"
          />
          <path
            d="M34 84 Q60 102 86 84"
            stroke={innerLine}
            strokeWidth="1.5"
            fill="none"
          />

          {/* Breastplate Medallions */}
          <circle
            cx="60"
            cy="92"
            r="4.8"
            fill={`url(#body-gem-${uid})`}
            stroke={outerBorder}
            strokeWidth="2"
          />
          <circle
            cx="60"
            cy="92"
            r="3"
            fill="none"
            stroke={innerLine}
            strokeWidth="1.2"
          />
          <circle
            cx="43"
            cy="83"
            r="2.8"
            fill="#ffffff"
            stroke={outerBorder}
            strokeWidth="1.5"
          />
          <circle
            cx="77"
            cy="83"
            r="2.8"
            fill="#ffffff"
            stroke={outerBorder}
            strokeWidth="1.5"
          />

          {/* Sculpted Neck & Collar — Full Faction Color */}
          <path
            d="M45 66 L47 54 L73 54 L75 66 C68 72, 52 72, 45 66 Z"
            fill={`url(#body-sculpt-${uid})`}
            stroke={outerBorder}
            strokeWidth="2"
          />
          <path
            d="M44 63 C44 68, 76 68, 76 63"
            stroke={outerBorder}
            strokeWidth="4.5"
            fill="none"
          />
          <path
            d="M44 63 C44 68, 76 68, 76 63"
            stroke={innerLine}
            strokeWidth="2"
            fill="none"
          />

          {/* Royal Hair / Side Locks — Full Faction Color with Black/White Border */}
          <path
            d="M36 30 C32 38, 33 49, 39 54 C40 46, 40 38, 41 32 Z M84 30 C88 38, 87 49, 81 54 C80 46, 80 38, 79 32 Z M38 20 C45 12, 75 12, 82 20 Z"
            fill={`url(#body-vert-${uid})`}
            stroke={outerBorder}
            strokeWidth="2"
          />

          {/* Sculpted Sovereign Face — 100% Player Faction Color */}
          <path
            d="M39 30 C38 44, 41 56, 49 61 C55 64, 65 64, 71 61 C79 56, 82 44, 81 30 Z"
            fill={`url(#body-sculpt-${uid})`}
            stroke={outerBorder}
            strokeWidth="2.4"
          />
          <path
            d="M41 32 C40 44, 43 54, 50 59 M79 32 C80 44, 77 54, 70 59"
            fill="none"
            stroke={innerLine}
            strokeWidth="1.2"
            strokeOpacity="0.85"
          />

          {/* Brow & Nose Bridge in Sharp Black & White */}
          <path
            d="M45 36 L56 37 M64 37 L75 36 M60 36 L58 48 L63 48"
            stroke={outerBorder}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M60 36 L60 47"
            stroke={innerLine}
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* High-Contrast White & Black Sovereign Eyes */}
          <ellipse
            cx="50"
            cy="40.5"
            rx="3.8"
            ry="2.1"
            fill="#ffffff"
            stroke={outerBorder}
            strokeWidth="1.6"
          />
          <circle cx="50" cy="40.5" r="1.4" fill={outerBorder} />
          <ellipse
            cx="70"
            cy="40.5"
            rx="3.8"
            ry="2.1"
            fill="#ffffff"
            stroke={outerBorder}
            strokeWidth="1.6"
          />
          <circle cx="70" cy="40.5" r="1.4" fill={outerBorder} />

          {/* Mouth & Chin Line */}
          <path
            d="M52 54 Q60 52.5 68 54"
            stroke={outerBorder}
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M53 54 Q60 52.8 67 54"
            stroke={innerLine}
            strokeWidth="1.1"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M57 58 Q60 59.5 63 58"
            stroke={outerBorder}
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* High King Crown — Full Faction Color + Crisp Black & White Lining */}
          <path
            d="M36 29 L35 17 L45 23 L52 14 L60 22 L68 14 L75 23 L85 17 L84 29 C72 32, 48 32, 36 29 Z"
            fill={`url(#body-cyl-${uid})`}
            stroke={outerBorder}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path
            d="M36.5 19 L45 24.5 L52 16 L60 23.5 L68 16 L75 24.5 L83.5 19"
            fill="none"
            stroke={innerLine}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <circle
            cx="60"
            cy="26"
            r="3.2"
            fill="#ffffff"
            stroke={outerBorder}
            strokeWidth="1.6"
          />
          <circle
            cx="46"
            cy="26.5"
            r="2.4"
            fill="#ffffff"
            stroke={outerBorder}
            strokeWidth="1.4"
          />
          <circle
            cx="74"
            cy="26.5"
            r="2.4"
            fill="#ffffff"
            stroke={outerBorder}
            strokeWidth="1.4"
          />
        </g>
      )}
    </svg>
  )
}
