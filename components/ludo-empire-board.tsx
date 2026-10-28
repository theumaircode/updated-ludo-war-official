'use client'

import React from 'react'
import {
  BOARD_SKINS,
  BoardSkinId,
  EliminationEvent,
  FACTIONS,
  FactionId,
  PieceInstance,
  PieceSkinId,
  PlayerCountOption,
  PlayerState,
  SCULPTED_PIECES,
} from '@/lib/game-types'
import {
  BASE_PEDESTALS_6P_COORDS,
  canPieceMove,
  getCornerForPlayer,
  getPieceBoardCoord,
  getSanctuaryPedestalCoord4P,
  HOME_STRETCH_4P_RC,
  HOME_STRETCH_6P_COORDS,
  OUTER_TRACK_4P_RC,
  OUTER_TRACK_6P_COORDS,
  SAFE_INDICES_4P,
  SAFE_INDICES_6P,
} from '@/lib/ludo-engine'
import { BlackHoleSingularity } from './black-hole-singularity'
import { SculptedPieceToken } from './sculpted-piece-token'

const CELL_PCT = 100 / 15
const TRACK_PIECE_PCT = CELL_PCT * 0.88
const SOCKET_PCT = 12
const BASE_PIECE_PCT = SOCKET_PCT * 0.86
const BASE_INSET_PCT = 1.2
const STACK_SCALE = 0.56
const STACK_LAYOUTS: Record<number, [number, number][]> = {
  2: [
    [-1, 0],
    [1, 0],
  ],
  3: [
    [-1, -1],
    [1, -1],
    [0, 1],
  ],
  4: [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ],
}

interface LudoEmpireBoardProps {
  players: PlayerState[]
  playerCount: PlayerCountOption
  currentPlayerIndex: number
  diceValue: number | null
  hasRolled: boolean
  onSelectPiece: (piece: PieceInstance) => void
  boardSkinId: BoardSkinId
  pieceSkinId: PieceSkinId
  recentAbsorbedPiece: PieceInstance | null
  recentElimination?: EliminationEvent | null
  selectedPieceId?: string | null
}

export function LudoEmpireBoard({
  players,
  playerCount,
  currentPlayerIndex,
  diceValue,
  hasRolled,
  onSelectPiece,
  boardSkinId,
  pieceSkinId,
  recentAbsorbedPiece,
  recentElimination,
  selectedPieceId,
}: LudoEmpireBoardProps) {
  const boardSkin = BOARD_SKINS[boardSkinId] || BOARD_SKINS.obsidian
  const currentPlayer = players[currentPlayerIndex]

  const absorbedPieces = players.flatMap((p) =>
    p.pieces.filter((piece) => piece.isFinished)
  )

  const activePieces = players.flatMap((p) =>
    p.pieces.filter((piece) => !piece.isFinished)
  )

  const coordGroups = new Map<string, PieceInstance[]>()
  for (const piece of activePieces) {
    const c = getPieceBoardCoord(piece, playerCount)
    const key = `${Math.round(c.x * 10)}_${Math.round(c.y * 10)}`
    const list = coordGroups.get(key) || []
    list.push(piece)
    coordGroups.set(key, list)
  }

  const cornerFactions: Record<number, FactionId> = {
    0: 'crimson',
    1: 'emerald',
    2: 'sapphire',
    3: 'gold',
  }
  if (playerCount === 2) {
    cornerFactions[0] = players[0]?.faction || 'crimson'
    cornerFactions[2] = players[1]?.faction || 'gold'
  }

  return (
    <div className="relative w-full h-full mx-auto select-none">
      {/* Outer Altar Frame — Clean luxury bezel without cluttered border text */}
      <div
        className="relative w-full h-full rounded-2xl p-1.5 sm:p-2.5 shadow-[0_25px_80px_rgba(0,0,0,0.96)] border-2"
        style={{
          background: boardSkin.stoneBorder,
          borderColor: boardSkin.goldTrim,
        }}
      >
        {/* Inner Board Coordinate Container (overflow-visible so 3D pieces never get clipped by any border) */}
        <div className="relative w-full h-full">
          {/* Clipped Surface Layer for Board Tiles & Corner Sanctuaries */}
          <div
            className="relative w-full h-full rounded-xl overflow-hidden border-2"
            style={{
              background: boardSkin.woodGradient,
              borderColor: boardSkin.goldTrim,
              boxShadow:
                'inset 0 0 50px rgba(0,0,0,0.88), 0 4px 20px rgba(0,0,0,0.92)',
            }}
          >
            {/* Engraved Celestial Filigree Geometry Background */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke={boardSkin.goldTrim}
                strokeWidth="0.4"
                strokeDasharray="1.5 1"
              />
              <circle
                cx="50"
                cy="50"
                r="28"
                fill="none"
                stroke={boardSkin.goldTrim}
                strokeWidth="0.35"
              />
              <line
                x1="0"
                y1="0"
                x2="100"
                y2="100"
                stroke={boardSkin.goldTrim}
                strokeWidth="0.25"
              />
              <line
                x1="100"
                y1="0"
                x2="0"
                y2="100"
                stroke={boardSkin.goldTrim}
                strokeWidth="0.25"
              />
            </svg>

            {/* 4-ARM IMPERIAL ALTAR BOARD (FOR 2 PLAYERS & 4 PLAYERS) */}
            {playerCount !== 6 && (
              <>
                {OUTER_TRACK_4P_RC.map(([r, c], idx) => {
                  const isSafe = SAFE_INDICES_4P.has(idx)
                  const isStart0 = idx === 0
                  const isStart1 = idx === 13
                  const isStart2 = idx === 26
                  const isStart3 = idx === 39
                  const startFaction = isStart0
                    ? FACTIONS[cornerFactions[0]]
                    : isStart1
                      ? FACTIONS[cornerFactions[1]]
                      : isStart2
                        ? FACTIONS[cornerFactions[2]]
                        : isStart3
                          ? FACTIONS[cornerFactions[3]]
                          : null

                  return (
                    <div
                      key={`outer-${idx}`}
                      style={{
                        left: `${(c / 15) * 100}%`,
                        top: `${(r / 15) * 100}%`,
                        width: `${100 / 15}%`,
                        height: `${100 / 15}%`,
                        backgroundColor: startFaction
                          ? `${startFaction.primaryHex}65`
                          : boardSkin.tileBase,
                        borderColor: boardSkin.tileBorder,
                      }}
                      className="absolute border flex items-center justify-center"
                    >
                      {isSafe ? (
                        <div
                          className="w-2.5 h-2.5 rotate-45 border"
                          style={{
                            backgroundColor: startFaction
                              ? '#ffffff'
                              : boardSkin.runeColor,
                            borderColor: '#fef08a',
                            boxShadow: `0 0 8px ${boardSkin.runeColor}`,
                          }}
                        />
                      ) : (
                        <div
                          className="w-1 h-1 rounded-full opacity-25"
                          style={{ backgroundColor: boardSkin.goldTrim }}
                        />
                      )}
                    </div>
                  )
                })}

                {/* 4 Glowing Home Stretch Lanes leading into the Black Hole */}
                {[0, 1, 2, 3].map((cornerIdx) => {
                  const faction = FACTIONS[cornerFactions[cornerIdx]]
                  const cells = HOME_STRETCH_4P_RC[cornerIdx]
                  return cells.map(([r, c], stepIdx) => (
                    <div
                      key={`home-${cornerIdx}-${stepIdx}`}
                      style={{
                        left: `${(c / 15) * 100}%`,
                        top: `${(r / 15) * 100}%`,
                        width: `${100 / 15}%`,
                        height: `${100 / 15}%`,
                        background: `radial-gradient(circle, ${faction.primaryHex}90 0%, ${faction.secondaryHex}d8 100%)`,
                        borderColor: boardSkin.goldTrim,
                      }}
                      className="absolute border flex items-center justify-center"
                    >
                      <div
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-white/60"
                        style={{
                          backgroundColor: faction.primaryHex,
                          boxShadow: `0 0 8px ${faction.glowHex}`,
                        }}
                      />
                    </div>
                  ))
                })}

                {/* 4 Corner Sanctuaries — Clean, Zero-Text-Clutter, Mathematically Aligned Pedestal Chambers */}
                {[0, 1, 2, 3].map((cornerIdx) => {
                  const faction = FACTIONS[cornerFactions[cornerIdx]]
                  const topRow = cornerIdx === 1 || cornerIdx === 2 ? 0 : 9
                  const leftCol = cornerIdx === 0 || cornerIdx === 1 ? 0 : 9
                  const matchingPlayer = players.find(
                    (p) =>
                      getCornerForPlayer(p.index, playerCount) === cornerIdx
                  )
                  const isCurrentTurn =
                    matchingPlayer &&
                    matchingPlayer.index === currentPlayerIndex

                  return (
                    <div
                      key={`sanctuary-${cornerIdx}`}
                      style={{
                        left: `${(leftCol / 15) * 100 + BASE_INSET_PCT}%`,
                        top: `${(topRow / 15) * 100 + BASE_INSET_PCT}%`,
                        width: `${(6 / 15) * 100 - BASE_INSET_PCT * 2}%`,
                        height: `${(6 / 15) * 100 - BASE_INSET_PCT * 2}%`,
                        background: `radial-gradient(circle at 50% 50%, ${faction.secondaryHex}f0 0%, #06080f 95%)`,
                        borderColor: isCurrentTurn
                          ? '#fef08a'
                          : boardSkin.goldTrim,
                        boxShadow: isCurrentTurn
                          ? `inset 0 0 28px ${faction.primaryHex}88, 0 0 22px ${faction.glowHex}66`
                          : 'inset 0 0 22px rgba(0,0,0,0.9)',
                      }}
                      className="absolute border-2 rounded-lg overflow-hidden transition-all duration-300"
                    >
                      {/* Subtle Corner Faction Crest Watermark in Center of Sanctuary */}
                      <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rotate-45 border opacity-45 pointer-events-none"
                        style={{
                          borderColor: boardSkin.goldTrim,
                          backgroundColor: `${faction.primaryHex}44`,
                        }}
                      />
                    </div>
                  )
                })}

                {/* 16 Exact Mathematical Pedestal Sockets (4 per Corner Sanctuary) */}
                {[0, 1, 2, 3].map((cornerIdx) => {
                  const faction = FACTIONS[cornerFactions[cornerIdx]]
                  return SCULPTED_PIECES.map((sculpt, sIdx) => {
                    const pedCoord = getSanctuaryPedestalCoord4P(
                      cornerIdx,
                      sIdx
                    )
                    return (
                      <div
                        key={`pedestal-socket-${cornerIdx}-${sculpt.id}`}
                        style={{
                          left: `${pedCoord.x}%`,
                          top: `${pedCoord.y}%`,
                          width: `${SOCKET_PCT}%`,
                          height: `${SOCKET_PCT}%`,
                          borderColor: `${boardSkin.goldTrim}aa`,
                          background: `radial-gradient(circle, ${faction.primaryHex}38 0%, rgba(4, 6, 12, 0.92) 78%)`,
                          boxShadow: `inset 0 0 10px ${faction.primaryHex}55, 0 2px 8px rgba(0,0,0,0.85)`,
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 pointer-events-none"
                      />
                    )
                  })
                })}
              </>
            )}

            {/* 6-PLAYER HEXAGONAL IMPERIAL ALTAR BOARD */}
            {playerCount === 6 && (
              <>
                {OUTER_TRACK_6P_COORDS.map((coord, idx) => {
                  const isSafe = SAFE_INDICES_6P.has(idx)
                  const isStart = idx % 8 === 0
                  const sectorPlayer = players[Math.floor(idx / 8)]
                  const faction = sectorPlayer
                    ? FACTIONS[sectorPlayer.faction]
                    : null

                  return (
                    <div
                      key={`hex-outer-${idx}`}
                      style={{
                        left: `${coord.x}%`,
                        top: `${coord.y}%`,
                        backgroundColor:
                          isStart && faction
                            ? `${faction.primaryHex}88`
                            : boardSkin.tileBase,
                        borderColor: isSafe
                          ? '#fde047'
                          : boardSkin.tileBorder,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 w-[5.2%] h-[5.2%] rounded-md border flex items-center justify-center"
                    >
                      {isSafe ? (
                        <div
                          className="w-2 h-2 rotate-45"
                          style={{
                            backgroundColor: '#fef08a',
                            boxShadow: '0 0 6px #fef08a',
                          }}
                        />
                      ) : (
                        <div
                          className="w-1 h-1 rounded-full opacity-50"
                          style={{ backgroundColor: boardSkin.runeColor }}
                        />
                      )}
                    </div>
                  )
                })}

                {players.map((p) => {
                  const faction = FACTIONS[p.faction]
                  const coords = HOME_STRETCH_6P_COORDS[p.index] || []
                  return coords.map((c, sIdx) => (
                    <div
                      key={`hex-home-${p.index}-${sIdx}`}
                      style={{
                        left: `${c.x}%`,
                        top: `${c.y}%`,
                        backgroundColor: faction.primaryHex,
                        borderColor: '#fef08a',
                        boxShadow: `0 0 10px ${faction.glowHex}`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 w-[4.6%] h-[4.6%] rounded-full border"
                    />
                  ))
                })}

                {players.map((p) => {
                  const faction = FACTIONS[p.faction]
                  const pedestals = BASE_PEDESTALS_6P_COORDS[p.index] || []
                  return pedestals.map((ped, sIdx) => (
                    <div
                      key={`hex-base-${p.index}-${sIdx}`}
                      style={{
                        left: `${ped.x}%`,
                        top: `${ped.y}%`,
                        backgroundColor: `${faction.secondaryHex}dd`,
                        borderColor:
                          p.index === currentPlayerIndex
                            ? '#fef08a'
                            : faction.primaryHex,
                        boxShadow: `inset 0 0 8px ${faction.primaryHex}`,
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 w-[5.8%] h-[5.8%] rounded-full border-2 flex items-center justify-center"
                    />
                  ))
                })}
              </>
            )}

            {/* CENTER BLACK HOLE & ANCIENT GREEK UNIVERSE RULING RING */}
            {playerCount === 6 ? (
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ width: '23%', height: '23%' }}
              >
                <BlackHoleSingularity
                  absorbedPieces={absorbedPieces}
                  recentAbsorbedPiece={recentAbsorbedPiece}
                  size="board"
                />
              </div>
            ) : (
              <div
                className="absolute z-10 flex items-center justify-center overflow-hidden rounded-md border-2"
                style={{
                  left: '40%',
                  top: '40%',
                  width: '20%',
                  height: '20%',
                  borderColor: boardSkin.goldTrim,
                  background:
                    'radial-gradient(circle, #160a30 0%, #030208 100%)',
                  boxShadow: 'inset 0 0 14px rgba(0,0,0,0.95)',
                }}
              >
                <div className="w-[84%] aspect-square">
                  <BlackHoleSingularity
                    absorbedPieces={absorbedPieces}
                    recentAbsorbedPiece={recentAbsorbedPiece}
                    size="board"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* UNCLIPPED 3D PIECE & SHOCKWAVE LAYER ABOVE BOARD BORDER (z-30)    */}
          {/* Ensures pieces at the top/edges NEVER get overlapped by borders   */}
          {/* ================================================================= */}
          <div className="absolute inset-[2px] pointer-events-none overflow-visible z-30">
            {/* DRAMATIC DEATH / ELIMINATION SHOCKWAVE ON CAPTURE TILE */}
            {recentElimination && (
              <div
                key={recentElimination.id}
                style={{
                  left: `${recentElimination.x}%`,
                  top: `${recentElimination.y}%`,
                }}
                className="absolute z-40 pointer-events-none animate-death-shockwave"
              >
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center"
                  style={{
                    borderColor:
                      FACTIONS[recentElimination.killerFaction].primaryHex,
                    background: `radial-gradient(circle, ${FACTIONS[recentElimination.killerFaction].primaryHex}aa 0%, rgba(220,38,38,0.4) 55%, transparent 75%)`,
                    boxShadow: `0 0 25px ${FACTIONS[recentElimination.killerFaction].glowHex}`,
                  }}
                >
                  <span className="font-display font-black text-[9px] sm:text-[10px] tracking-widest uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    ELIMINATED
                  </span>
                </div>
              </div>
            )}

            {/* ALL ACTIVE 3D SCULPTED PIECES (CROWN, HORSE, ALIEN, HUMAN) */}
            {activePieces.map((piece) => {
              const coord = getPieceBoardCoord(piece, playerCount)
              const key = `${Math.round(coord.x * 10)}_${Math.round(coord.y * 10)}`
              const group = coordGroups.get(key) || [piece]
              const idxInGroup = group.findIndex((p) => p.id === piece.id)
              const isInSanctuary = piece.stepsMoved < 0

              const isStacked = group.length > 1 && !isInSanctuary
              const [sx, sy] = isStacked
                ? (STACK_LAYOUTS[group.length] || STACK_LAYOUTS[4])[
                    idxInGroup % 4
                  ] ?? [0, 0]
                : [0, 0]

              const isMovable =
                hasRolled &&
                diceValue !== null &&
                currentPlayer &&
                !currentPlayer.isAI &&
                piece.playerIndex === currentPlayer.index &&
                canPieceMove(piece, diceValue, playerCount)

              const tilePct = playerCount === 6 ? 5.2 : CELL_PCT
              const baseSize =
                playerCount === 6
                  ? tilePct
                  : isInSanctuary
                    ? BASE_PIECE_PCT
                    : TRACK_PIECE_PCT
              const sizePct = isStacked ? baseSize * STACK_SCALE : baseSize
              const shiftPct = tilePct * 0.23

              return (
                <div
                  key={piece.id}
                  style={{
                    left: `${coord.x + sx * shiftPct}%`,
                    top: `${coord.y + sy * shiftPct}%`,
                    width: `${sizePct}%`,
                    height: `${sizePct}%`,
                  }}
                  className="absolute transition-all duration-300 ease-out pointer-events-auto"
                >
                  <SculptedPieceToken
                    piece={piece}
                    isMovable={Boolean(isMovable)}
                    isSelected={selectedPieceId === piece.id}
                    onSelect={onSelectPiece}
                    skinId={pieceSkinId}
                    boardScale={playerCount === 6 ? 'compact' : 'normal'}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
