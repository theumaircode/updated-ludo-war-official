'use client'

import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'
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
  movingPieceId?: string | null
}

const PIECE_GLIDE_MS = 260
const METEOR_CYCLE_S = 9
const METEOR_EDGES = ['top', 'right', 'bottom', 'left']
const BLACK_HOLE_WELL =
  'radial-gradient(circle closest-side, #000 0%, #000 44%, #080502 56%, #2a1905 68%, rgba(146,98,18,0.8) 80%, rgba(250,204,21,0.3) 90%, rgba(250,204,21,0) 97%)'

// Gold + violet comets racing clockwise around the bezel gutter (transform-only, stays on the GPU compositor)
const MeteorBezel = memo(function MeteorBezel() {
  const quarter = METEOR_CYCLE_S / 4
  return (
    <div
      aria-hidden="true"
      className="meteor-bezel absolute -inset-[2px] rounded-2xl overflow-hidden pointer-events-none"
    >
      {METEOR_EDGES.map((edge, i) => (
        <React.Fragment key={edge}>
          <span
            className={`meteor-streak meteor-${edge} meteor-gold`}
            style={{ animationDelay: `${i * quarter - METEOR_CYCLE_S}s` }}
          />
          <span
            className={`meteor-streak meteor-${edge} meteor-violet`}
            style={{
              animationDelay: `${((i * quarter + METEOR_CYCLE_S / 2) % METEOR_CYCLE_S) - METEOR_CYCLE_S}s`,
            }}
          />
        </React.Fragment>
      ))}
    </div>
  )
})

interface BoardPieceProps {
  piece: PieceInstance
  left: number
  top: number
  size: number
  zIndex?: number
  isMovable: boolean
  isSelected: boolean
  skinId: PieceSkinId
  compact: boolean
  onSelect: (piece: PieceInstance) => void
}

// Glides cell-to-cell with a FLIP transform + hop (no per-frame layout/repaint), and only re-renders when its own state changes
const BoardPiece = memo(
  function BoardPiece({
    piece,
    left,
    top,
    size,
    zIndex,
    isMovable,
    isSelected,
    skinId,
    compact,
    onSelect,
  }: BoardPieceProps) {
    const glideRef = useRef<HTMLDivElement>(null)
    const hopRef = useRef<HTMLDivElement>(null)
    const lastRef = useRef<{
      x: number
      y: number
      w: number
      step: number
    } | null>(null)

    useLayoutEffect(() => {
      const el = glideRef.current
      if (!el) return
      const next = {
        x: el.offsetLeft,
        y: el.offsetTop,
        w: el.offsetWidth,
        step: piece.stepsMoved,
      }
      const prev = lastRef.current
      lastRef.current = next
      if (!prev || typeof el.animate !== 'function') return

      const dx = prev.x - next.x
      const dy = prev.y - next.y
      const scale = next.w > 0 ? prev.w / next.w : 1
      if (dx === 0 && dy === 0 && scale === 1) return

      el.animate(
        [
          { transform: `translate3d(${dx}px, ${dy}px, 0) scale(${scale})` },
          { transform: 'translate3d(0, 0, 0) scale(1)' },
        ],
        { duration: PIECE_GLIDE_MS, easing: 'cubic-bezier(0.45, 0, 0.25, 1)' }
      )

      if (prev.step >= 0 && next.step > prev.step) {
        hopRef.current?.animate(
          [
            { transform: 'translateY(0) scale(1)' },
            { transform: 'translateY(-24%) scale(1.08)', offset: 0.45 },
            { transform: 'translateY(0) scale(1)' },
          ],
          { duration: PIECE_GLIDE_MS, easing: 'cubic-bezier(0.33, 0, 0.2, 1)' }
        )
      }
    }, [left, top, size, piece.stepsMoved])

    return (
      <div
        ref={glideRef}
        style={{
          left: `${left}%`,
          top: `${top}%`,
          width: `${size}%`,
          height: `${size}%`,
          zIndex,
          transformOrigin: '0 0',
        }}
        className="absolute pointer-events-auto"
      >
        <div ref={hopRef} className="w-full h-full">
          <SculptedPieceToken
            piece={piece}
            isMovable={isMovable}
            isSelected={isSelected}
            onSelect={onSelect}
            skinId={skinId}
            boardScale={compact ? 'compact' : 'normal'}
          />
        </div>
      </div>
    )
  },
  (a, b) =>
    a.piece.id === b.piece.id &&
    a.piece.stepsMoved === b.piece.stepsMoved &&
    a.piece.faction === b.piece.faction &&
    a.piece.sculptType === b.piece.sculptType &&
    a.left === b.left &&
    a.top === b.top &&
    a.size === b.size &&
    a.zIndex === b.zIndex &&
    a.isMovable === b.isMovable &&
    a.isSelected === b.isSelected &&
    a.skinId === b.skinId &&
    a.compact === b.compact &&
    a.onSelect === b.onSelect
)

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
  movingPieceId = null,
}: LudoEmpireBoardProps) {
  const boardSkin = BOARD_SKINS[boardSkinId] || BOARD_SKINS.obsidian
  const currentPlayer = players[currentPlayerIndex]
  const centerPct = playerCount === 6 ? 23 : 20

  // Stable handler so memoized pieces don't re-render just because the parent passed a new inline callback
  const onSelectRef = useRef(onSelectPiece)
  useEffect(() => {
    onSelectRef.current = onSelectPiece
  })
  const handleSelectPiece = useCallback(
    (piece: PieceInstance) => onSelectRef.current(piece),
    []
  )

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
      {/* Outer Altar Frame — cinematic meteor bezel (same 2px border + padding, so the cell grid keeps its exact size) */}
      <div
        className="relative w-full h-full rounded-2xl p-1.5 sm:p-2.5 border-2 border-transparent"
        style={{
          background: `linear-gradient(135deg, rgba(250,204,21,0.2) 0%, rgba(250,204,21,0) 30%, rgba(139,92,246,0) 70%, rgba(139,92,246,0.22) 100%), ${boardSkin.stoneBorder}`,
          boxShadow:
            '0 25px 80px rgba(0,0,0,0.96), 0 0 26px rgba(250,204,21,0.12), 0 0 52px rgba(124,58,237,0.14)',
        }}
      >
        <MeteorBezel />
        {/* Inner Board Coordinate Container (overflow-visible so 3D pieces never get clipped by any border) */}
        <div className="relative w-full h-full">
          {/* Clipped Surface Layer for Board Tiles & Corner Sanctuaries */}
          <div
            className="relative w-full h-full rounded-xl overflow-hidden border-2"
            style={{
              background: boardSkin.woodGradient,
              borderColor: 'rgba(250, 204, 21, 0.22)',
              boxShadow: 'inset 0 0 50px rgba(0,0,0,0.88)',
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
                          ? `${startFaction.primaryHex}a6`
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
                            boxShadow: `0 0 5px ${boardSkin.runeColor}`,
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
                        background: `radial-gradient(circle at 50% 42%, ${faction.primaryHex} 0%, ${faction.primaryHex}c4 46%, ${faction.secondaryHex} 100%)`,
                        borderColor: 'rgba(255, 255, 255, 0.28)',
                      }}
                      className="absolute border flex items-center justify-center"
                    >
                      <div
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-white/70"
                        style={{
                          backgroundColor: faction.glowHex,
                          boxShadow: `0 0 5px ${faction.glowHex}`,
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
                        background: `radial-gradient(circle at 50% 50%, ${faction.primaryHex}55 0%, ${faction.secondaryHex}f0 45%, #06080f 100%)`,
                        borderColor: isCurrentTurn
                          ? '#fef08a'
                          : `${faction.primaryHex}b3`,
                        boxShadow: isCurrentTurn
                          ? `inset 0 0 28px ${faction.primaryHex}99, inset 0 0 0 1px ${faction.glowHex}88`
                          : 'inset 0 0 22px rgba(0,0,0,0.9)',
                      }}
                      className="absolute border-2 rounded-lg overflow-hidden transition-[border-color] duration-300"
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
                          borderColor: `${faction.primaryHex}99`,
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

            {/* CENTER BLACK HOLE — a true circle confined to the centre space; glow, vortex & light burst are all clipped inside it so no cell is ever covered */}
            <div
              className="bh-slot absolute z-10 pointer-events-none"
              style={{
                left: `${50 - centerPct / 2}%`,
                top: `${50 - centerPct / 2}%`,
                width: `${centerPct}%`,
                height: `${centerPct}%`,
              }}
            >
              <div
                className="bh-circle relative rounded-full overflow-hidden"
                style={{ background: BLACK_HOLE_WELL }}
              >
                <div className="absolute inset-[9%]">
                  <BlackHoleSingularity
                    absorbedPieces={absorbedPieces}
                    recentAbsorbedPiece={recentAbsorbedPiece}
                    size="board"
                  />
                </div>
              </div>
            </div>
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
                !movingPieceId &&
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
                <BoardPiece
                  key={piece.id}
                  piece={piece}
                  left={coord.x + sx * shiftPct}
                  top={coord.y + sy * shiftPct}
                  size={sizePct}
                  zIndex={piece.id === movingPieceId ? 50 : undefined}
                  isMovable={Boolean(isMovable)}
                  isSelected={selectedPieceId === piece.id}
                  skinId={pieceSkinId}
                  compact={playerCount === 6}
                  onSelect={handleSelectPiece}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
