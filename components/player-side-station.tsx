'use client'

import React from 'react'
import {
  DiceSkinId,
  FACTIONS,
  PieceInstance,
  PieceSkinId,
  PlayerCountOption,
  PlayerState,
  SCULPTED_PIECES,
} from '@/lib/game-types'
import { canPieceMove } from '@/lib/ludo-engine'
import { RoyalCarvedDice } from './royal-carved-dice'
import { SculptedChessPiece3D } from './sculpted-chess-piece-3d'

interface PlayerSideStationProps {
  player: PlayerState
  compassSide: 'NW' | 'N' | 'NE' | 'SW' | 'S' | 'SE'
  isCurrentTurn: boolean
  diceValue: number
  isRolling: boolean
  hasRolled: boolean
  canRoll: boolean
  onRollDice: () => void
  onMovePiece: (piece: PieceInstance) => void
  diceSkinId: DiceSkinId
  pieceSkinId: PieceSkinId
  playerCount: PlayerCountOption
  requiredToWin: number
  rotateForTabletop?: boolean
  compact?: boolean
}

export function PlayerSideStation({
  player,
  compassSide,
  isCurrentTurn,
  diceValue,
  isRolling,
  hasRolled,
  canRoll,
  onRollDice,
  onMovePiece,
  diceSkinId,
  pieceSkinId,
  playerCount,
  requiredToWin,
  rotateForTabletop = false,
  compact = false,
}: PlayerSideStationProps) {
  const faction = FACTIONS[player.faction]
  const isRightAligned = compassSide === 'NE' || compassSide === 'SE'

  return (
    <div
      style={{
        borderColor: isCurrentTurn ? '#fef08a' : `${faction.primaryHex}77`,
        background: isCurrentTurn
          ? `linear-gradient(135deg, ${faction.secondaryHex}f5 0%, rgba(8, 11, 20, 0.97) 100%)`
          : 'rgba(7, 10, 17, 0.9)',
        boxShadow: isCurrentTurn
          ? `0 0 22px ${faction.primaryHex}77, inset 0 0 14px ${faction.primaryHex}44`
          : '0 6px 18px rgba(0,0,0,0.82)',
      }}
      className={`relative rounded-xl border-2 transition-all duration-300 flex items-center ${
        compact ? 'p-1 sm:p-2 gap-1 sm:gap-2' : 'p-1.5 sm:p-2 gap-1.5 sm:gap-2.5'
      } ${isRightAligned ? 'flex-row-reverse text-right' : 'flex-row text-left'} ${
        rotateForTabletop ? 'rotate-180' : ''
      } ${isCurrentTurn ? 'z-20' : 'opacity-90 hover:opacity-100'}`}
    >
      {/* PLAYER SIDE DICE COMPARTMENT */}
      <div
        className={`relative flex flex-col items-center justify-center rounded-xl p-0.5 sm:p-1 border shrink-0 transition-all ${
          isCurrentTurn
            ? 'bg-black/85 border-amber-300/80 shadow-[0_0_14px_rgba(251,191,36,0.35)]'
            : 'bg-black/50 border-white/10'
        }`}
      >
        {isCurrentTurn ? (
          <RoyalCarvedDice
            value={diceValue}
            isRolling={isRolling}
            canRoll={canRoll}
            onRoll={onRollDice}
            skinId={diceSkinId}
            activeFactionColor={faction.primaryHex}
            size="xs"
            showLabel={false}
          />
        ) : (
          <div
            className={`${
              compact ? 'w-7 h-7 sm:w-9 sm:h-9' : 'w-8 h-8 sm:w-10 sm:h-10'
            } rounded-lg border border-white/10 bg-black/60 flex flex-col items-center justify-center opacity-65`}
          >
            <div
              className="w-2.5 h-2.5 rounded-sm rotate-45 border"
              style={{
                borderColor: faction.primaryHex,
                backgroundColor: faction.secondaryHex,
              }}
            />
            <span className="text-[7px] font-mono font-bold uppercase tracking-wider text-slate-300 mt-0.5">
              {compassSide}
            </span>
          </div>
        )}
      </div>

      {/* PLAYER INFO & 4 SCULPTED 3D CHESS RELICS DOCK — Zero Overlap & Zero Truncation */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        {/* Top Row: Faction Color Pill + Commander Label + Ring Score */}
        <div
          className={`flex items-center justify-between gap-1 mb-1 ${
            isRightAligned ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <div
            className={`flex items-center gap-1 min-w-0 ${
              isRightAligned ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <span
              className="px-1.5 py-0.5 rounded text-[7.5px] sm:text-[8.5px] font-mono font-bold uppercase shrink-0"
              style={{
                backgroundColor: isCurrentTurn
                  ? '#fef08a'
                  : faction.primaryHex,
                color: isCurrentTurn ? '#000000' : '#ffffff',
              }}
            >
              {faction.shortName}
            </span>
            {!compact && (
              <span className="font-display font-bold text-[9.5px] sm:text-xs text-white whitespace-nowrap">
                {player.name}
              </span>
            )}
          </div>

          <span className="text-[8px] sm:text-[10px] font-mono font-bold text-amber-300 shrink-0 px-1 sm:px-1.5 py-0.5 rounded bg-black/70 border border-amber-500/35 whitespace-nowrap">
            {player.finishedCount}/{requiredToWin}
          </span>
        </div>

        {/* 4 Mini 3D Sculpted Chess Pieces */}
        <div className="grid grid-cols-4 gap-0.5 sm:gap-1">
          {player.pieces.map((pc) => {
            const sculpt = SCULPTED_PIECES[pc.sculptIndex]
            const movable =
              isCurrentTurn &&
              hasRolled &&
              !player.isAI &&
              canPieceMove(pc, diceValue, playerCount)
            const inHole = pc.isFinished
            const inBase = pc.stepsMoved === -1

            return (
              <button
                key={pc.id}
                type="button"
                disabled={!movable}
                onClick={() => {
                  if (movable) onMovePiece(pc)
                }}
                aria-label={`${faction.colorName} ${sculpt.shortLabel}`}
                title={`${faction.colorName} ${sculpt.shortLabel}`}
                className={`relative rounded-md sm:rounded-lg py-0.5 px-0.5 border flex flex-col items-center justify-center transition-all ${
                  movable
                    ? 'bg-amber-400/25 border-amber-300 cursor-pointer scale-105 shadow-[0_0_10px_rgba(251,191,36,0.5)] animate-pulse'
                    : inHole
                      ? 'bg-purple-950/80 border-amber-400/60 opacity-95 cursor-default'
                      : inBase
                        ? 'bg-black/55 border-white/10 opacity-65 cursor-default'
                        : 'bg-black/80 border-amber-500/35 cursor-default'
                }`}
              >
                <div
                  className={
                    compact
                      ? 'w-3.5 h-4 sm:w-4 sm:h-5'
                      : 'w-4 h-4.5 sm:w-4.5 sm:h-5'
                  }
                >
                  <SculptedChessPiece3D
                    sculptType={pc.sculptType}
                    faction={pc.faction}
                    skinId={pieceSkinId}
                    isGlowing={movable}
                  />
                </div>
                {!compact && (
                  <span className="hidden sm:block text-[7px] font-display font-bold text-amber-100 uppercase leading-none mt-0.5 whitespace-nowrap">
                    {inHole ? 'RING' : sculpt.shortLabel}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Concise Complete Turn Status Prompt */}
        {isCurrentTurn && (
          <div
            className={`mt-1 flex items-center gap-1 text-[7.5px] sm:text-[9px] font-display font-bold uppercase tracking-wide ${
              isRightAligned ? 'justify-end' : 'justify-start'
            }`}
          >
            {player.isAI ? (
              <span className="text-amber-300 animate-pulse whitespace-nowrap">
                {isRolling ? 'ROLLING' : `ROLLED ${diceValue}`}
              </span>
            ) : !hasRolled ? (
              <span className="text-amber-300 animate-pulse whitespace-nowrap">
                {isRolling ? 'ROLLING' : compact ? 'TAP DICE' : 'YOUR TURN • TAP DICE'}
              </span>
            ) : (
              <span className="text-emerald-300 whitespace-nowrap">
                {compact ? `TAP PIECE (${diceValue})` : `ROLLED ${diceValue} • TAP PIECE`}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
