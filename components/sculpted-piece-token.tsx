'use client'

import React from 'react'
import {
  FACTIONS,
  PieceInstance,
  PieceSkinId,
  SCULPTED_PIECES,
} from '@/lib/game-types'
import { SculptedChessPiece3D } from './sculpted-chess-piece-3d'

interface SculptedPieceTokenProps {
  piece: PieceInstance
  isMovable: boolean
  isSelected?: boolean
  onSelect: (piece: PieceInstance) => void
  skinId: PieceSkinId
  stackOffset?: { dx: number; dy: number; count: number }
  boardScale?: 'normal' | 'compact'
}

export function SculptedPieceToken({
  piece,
  isMovable,
  isSelected,
  onSelect,
  skinId,
  stackOffset = { dx: 0, dy: 0, count: 1 },
  boardScale = 'normal',
}: SculptedPieceTokenProps) {
  const sculpt =
    SCULPTED_PIECES.find((s) => s.id === piece.sculptType) || SCULPTED_PIECES[0]
  const faction = FACTIONS[piece.faction]
  const isInSanctuary = piece.stepsMoved < 0

  return (
    <button
      type="button"
      disabled={!isMovable}
      onClick={(e) => {
        e.stopPropagation()
        if (isMovable) onSelect(piece)
      }}
      title={`${faction.colorName} ${sculpt.shortLabel}`}
      aria-label={`${faction.colorName} ${sculpt.shortLabel}`}
      style={{
        width: '100%',
        height: '100%',
        transform: `translate(calc(-50% + ${stackOffset.dx}px), calc(-50% + ${stackOffset.dy}px))`,
      }}
      className={`group relative flex flex-col items-center justify-center select-none transition-all duration-300 bg-transparent border-0 p-0 ${
        isMovable
          ? 'cursor-pointer z-30 scale-105'
          : 'cursor-default z-20'
      } ${isSelected ? 'scale-110 z-40' : ''} ${
        boardScale === 'compact' ? 'scale-90' : ''
      }`}
    >
      {/* Floating Target Beacon above movable 3D piece */}
      {isMovable && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none animate-bounce z-40">
          <div
            className="w-2 h-2 rotate-45 border border-white"
            style={{
              backgroundColor: faction.primaryHex,
              boxShadow: `0 0 10px ${faction.glowHex}`,
            }}
          />
        </div>
      )}

      {/* Ground Pulsing Faction Ring Beneath the 3D Chess Pedestal when Movable */}
      {isMovable && (
        <div
          className="absolute bottom-0.5 w-[85%] h-2.5 rounded-full animate-ping pointer-events-none"
          style={{
            backgroundColor: `${faction.primaryHex}88`,
            border: `1.5px solid ${faction.glowHex}`,
          }}
        />
      )}

      {/* Pure 3D Carved Chess-Piece Structure */}
      <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
        <SculptedChessPiece3D
          sculptType={piece.sculptType}
          faction={piece.faction}
          skinId={skinId}
          isGlowing={isMovable}
          className="w-full h-full"
        />
      </div>

      {/* Stack Count Badge if multiple pieces share the exact same track tile */}
      {stackOffset.count > 1 && !isInSanctuary && (
        <span
          className="absolute -right-1 bottom-0.5 px-1 rounded-full text-[8px] font-mono font-bold text-white border border-amber-300 z-40 leading-tight"
          style={{ backgroundColor: faction.primaryHex }}
        >
          ×{stackOffset.count}
        </span>
      )}
    </button>
  )
}
