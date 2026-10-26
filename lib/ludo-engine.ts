import {
  FactionId,
  MatchMode,
  PieceInstance,
  PlayerCountOption,
  PlayerState,
  SCULPTED_PIECES,
} from './game-types'

export interface BoardCoord {
  x: number // 0..100 percentage of board width
  y: number // 0..100 percentage of board height
}

function rcToPercent(row: number, col: number): BoardCoord {
  return {
    x: ((col + 0.5) / 15) * 100,
    y: ((row + 0.5) / 15) * 100,
  }
}

// 52-tile clockwise outer track on standard 15x15 grid
// Index 0 is Bottom-Left (Red/Crimson) start at (row 13, col 6)
export const OUTER_TRACK_4P_RC: [number, number][] = [
  [13, 6],
  [12, 6],
  [11, 6],
  [10, 6],
  [9, 6],
  [8, 5],
  [8, 4],
  [8, 3],
  [8, 2],
  [8, 1],
  [8, 0],
  [7, 0],
  [6, 0],
  [6, 1],
  [6, 2],
  [6, 3],
  [6, 4],
  [6, 5],
  [5, 6],
  [4, 6],
  [3, 6],
  [2, 6],
  [1, 6],
  [0, 6],
  [0, 7],
  [0, 8],
  [1, 8],
  [2, 8],
  [3, 8],
  [4, 8],
  [5, 8],
  [6, 9],
  [6, 10],
  [6, 11],
  [6, 12],
  [6, 13],
  [6, 14],
  [7, 14],
  [8, 14],
  [8, 13],
  [8, 12],
  [8, 11],
  [8, 10],
  [8, 9],
  [9, 8],
  [10, 8],
  [11, 8],
  [12, 8],
  [13, 8],
  [14, 8],
  [14, 7],
  [14, 6],
]

export const SAFE_INDICES_4P = new Set([0, 8, 13, 21, 26, 34, 39, 47])

export const HOME_STRETCH_4P_RC: Record<number, [number, number][]> = {
  0: [
    [13, 7],
    [12, 7],
    [11, 7],
    [10, 7],
    [9, 7],
  ],
  1: [
    [7, 1],
    [7, 2],
    [7, 3],
    [7, 4],
    [7, 5],
  ],
  2: [
    [1, 7],
    [2, 7],
    [3, 7],
    [4, 7],
    [5, 7],
  ],
  3: [
    [7, 13],
    [7, 12],
    [7, 11],
    [7, 10],
    [7, 9],
  ],
}

/**
 * Exact mathematical centers for each of the 4 pedestals inside each 6x6 corner sanctuary.
 * Each 6x6 sanctuary occupies 40% x 40% of the board:
 * - Corner 0 (Bottom-Left): x in [0%, 40%], y in [60%, 100%]
 * - Corner 1 (Top-Left):    x in [0%, 40%], y in [0%, 40%]
 * - Corner 2 (Top-Right):   x in [60%, 100%], y in [0%, 40%]
 * - Corner 3 (Bottom-Right):x in [60%, 100%], y in [60%, 100%]
 *
 * Inside each 40%x40% sanctuary, the 4 pedestals are placed symmetrically at
 * 31% and 69% of the sanctuary's width and height so every 3D piece sits
 * dead-center inside its pedestal chamber with zero border collision.
 */
export function getSanctuaryPedestalCoord4P(
  cornerIdx: number,
  sculptIdx: number
): BoardCoord {
  const originX = cornerIdx === 0 || cornerIdx === 1 ? 0 : 60
  const originY = cornerIdx === 1 || cornerIdx === 2 ? 0 : 60

  const colOffset = sculptIdx % 2 === 0 ? 40 * 0.31 : 40 * 0.69
  const rowOffset = sculptIdx < 2 ? 40 * 0.31 : 40 * 0.69

  return {
    x: originX + colOffset,
    y: originY + rowOffset,
  }
}

// ---------------------------------------------------------------------------
// 6-Player Radial Hex-Star Board Geometry (0..100%)
// ---------------------------------------------------------------------------
export const OUTER_TRACK_6P_COORDS: BoardCoord[] = (() => {
  const coords: BoardCoord[] = []
  const total = 48
  for (let i = 0; i < total; i++) {
    const angleDeg = 150 + (i / total) * 360
    const angleRad = (angleDeg * Math.PI) / 180
    const sectorPhase = (i % 8) / 8
    const starMod = Math.cos(sectorPhase * Math.PI * 2) * 3.6
    const radius = 34.2 + starMod
    coords.push({
      x: 50 + Math.cos(angleRad) * radius,
      y: 50 + Math.sin(angleRad) * radius,
    })
  }
  return coords
})()

export const SAFE_INDICES_6P = new Set([
  0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44,
])

export const HOME_STRETCH_6P_COORDS: Record<number, BoardCoord[]> = (() => {
  const stretches: Record<number, BoardCoord[]> = {}
  for (let p = 0; p < 6; p++) {
    const angleDeg = 150 + p * 60
    const angleRad = (angleDeg * Math.PI) / 180
    const radii = [27.5, 22.5, 17.8, 13.5]
    stretches[p] = radii.map((r) => ({
      x: 50 + Math.cos(angleRad) * r,
      y: 50 + Math.sin(angleRad) * r,
    }))
  }
  return stretches
})()

export const BASE_PEDESTALS_6P_COORDS: Record<number, BoardCoord[]> = (() => {
  const bases: Record<number, BoardCoord[]> = {}
  for (let p = 0; p < 6; p++) {
    const centerAngleDeg = 150 + p * 60 - 22
    const centerRad = (centerAngleDeg * Math.PI) / 180
    const baseCenterX = 50 + Math.cos(centerRad) * 42.5
    const baseCenterY = 50 + Math.sin(centerRad) * 42.5
    const offsets = [
      [-3.4, -3.8],
      [3.4, -3.8],
      [-3.4, 3.8],
      [3.4, 3.8],
    ]
    bases[p] = offsets.map(([dx, dy]) => ({
      x: Math.max(6, Math.min(94, baseCenterX + dx)),
      y: Math.max(6, Math.min(94, baseCenterY + dy)),
    }))
  }
  return bases
})()

export function getGoalSteps(playerCount: PlayerCountOption): number {
  return playerCount === 6 ? 50 : 56
}

export function getHomeStretchStartStep(
  playerCount: PlayerCountOption
): number {
  return playerCount === 6 ? 46 : 51
}

export function getCornerForPlayer(
  playerIndex: number,
  playerCount: PlayerCountOption
): number {
  if (playerCount === 2) {
    return playerIndex === 0 ? 0 : 2
  }
  return playerIndex
}

export function getGlobalOuterIndex(
  playerIndex: number,
  stepsMoved: number,
  playerCount: PlayerCountOption
): number | null {
  if (stepsMoved < 0 || stepsMoved >= getHomeStretchStartStep(playerCount)) {
    return null
  }
  if (playerCount === 6) {
    const startOffset = playerIndex * 8
    return (startOffset + stepsMoved) % 48
  } else {
    const corner = getCornerForPlayer(playerIndex, playerCount)
    const startOffset = corner * 13
    return (startOffset + stepsMoved) % 52
  }
}

export function getPieceBoardCoord(
  piece: PieceInstance,
  playerCount: PlayerCountOption
): BoardCoord {
  const goalStep = getGoalSteps(playerCount)
  if (piece.isFinished || piece.stepsMoved >= goalStep) {
    return { x: 50, y: 50 }
  }

  if (playerCount === 6) {
    if (piece.stepsMoved < 0) {
      return BASE_PEDESTALS_6P_COORDS[piece.playerIndex][piece.sculptIndex]
    }
    if (piece.stepsMoved < 46) {
      const globalIdx = getGlobalOuterIndex(
        piece.playerIndex,
        piece.stepsMoved,
        6
      )!
      return OUTER_TRACK_6P_COORDS[globalIdx]
    }
    const stretchIdx = piece.stepsMoved - 46
    return (
      HOME_STRETCH_6P_COORDS[piece.playerIndex][stretchIdx] || { x: 50, y: 50 }
    )
  }

  const corner = getCornerForPlayer(piece.playerIndex, playerCount)
  if (piece.stepsMoved < 0) {
    return getSanctuaryPedestalCoord4P(corner, piece.sculptIndex)
  }

  if (piece.stepsMoved < 51) {
    const globalIdx = getGlobalOuterIndex(
      piece.playerIndex,
      piece.stepsMoved,
      playerCount
    )!
    const [r, c] = OUTER_TRACK_4P_RC[globalIdx]
    return rcToPercent(r, c)
  }

  const stretchIdx = piece.stepsMoved - 51
  const stretch = HOME_STRETCH_4P_RC[corner]
  if (stretch && stretch[stretchIdx]) {
    const [r, c] = stretch[stretchIdx]
    return rcToPercent(r, c)
  }

  return { x: 50, y: 50 }
}

export function createMatchPlayers(
  playerCount: PlayerCountOption,
  mode: MatchMode,
  customNames?: string[]
): PlayerState[] {
  const factionOrder: FactionId[] =
    playerCount === 2
      ? ['crimson', 'gold']
      : playerCount === 4
        ? ['crimson', 'emerald', 'sapphire', 'gold']
        : ['crimson', 'emerald', 'sapphire', 'gold', 'amethyst', 'cyan']

  // Clean, elite, non-truncating commander names
  const aiNames = ['MALAKOR', 'VAELEN', 'XYLAR', 'KAEL', 'NYX']

  return factionOrder.map((faction, idx) => {
    const isHuman = mode === 'pass-and-play' ? true : idx === 0

    const defaultName =
      idx === 0
        ? customNames?.[0] || 'YOU'
        : mode === 'pass-and-play'
          ? customNames?.[idx] || `PLAYER ${idx + 1}`
          : aiNames[(idx - 1) % aiNames.length]

    const pieces: PieceInstance[] = SCULPTED_PIECES.map((sculpt, sIdx) => ({
      id: `${faction}-${sculpt.id}`,
      playerIndex: idx,
      faction,
      sculptIndex: sIdx,
      sculptType: sculpt.id,
      stepsMoved: mode === 'quick-blitz' && sIdx === 0 ? 0 : -1,
      isFinished: false,
    }))

    return {
      index: idx,
      name: defaultName,
      faction,
      isAI: !isHuman,
      avatarSculpt: SCULPTED_PIECES[idx % 4].id,
      pieces,
      finishedCount: 0,
      capturesCount: 0,
    }
  })
}

export function canPieceMove(
  piece: PieceInstance,
  diceValue: number,
  playerCount: PlayerCountOption
): boolean {
  if (piece.isFinished) return false
  const goalStep = getGoalSteps(playerCount)
  if (piece.stepsMoved === -1) {
    return diceValue === 6
  }
  return piece.stepsMoved + diceValue <= goalStep
}

export function selectBestAIMove(
  player: PlayerState,
  allPlayers: PlayerState[],
  diceValue: number,
  playerCount: PlayerCountOption
): PieceInstance | null {
  const movable = player.pieces.filter((p) =>
    canPieceMove(p, diceValue, playerCount)
  )
  if (movable.length === 0) return null
  if (movable.length === 1) return movable[0]

  const goalStep = getGoalSteps(playerCount)
  const safeSet = playerCount === 6 ? SAFE_INDICES_6P : SAFE_INDICES_4P

  let bestPiece = movable[0]
  let bestScore = -9999

  for (const piece of movable) {
    let score = 0
    const nextStep = piece.stepsMoved === -1 ? 0 : piece.stepsMoved + diceValue

    if (nextStep === goalStep) {
      score += 1000
    }

    const nextGlobalIdx = getGlobalOuterIndex(
      player.index,
      nextStep,
      playerCount
    )
    if (nextGlobalIdx !== null && !safeSet.has(nextGlobalIdx)) {
      const opponentsOnTarget = allPlayers
        .filter((op) => op.index !== player.index)
        .flatMap((op) => op.pieces)
        .filter(
          (opPiece) =>
            !opPiece.isFinished &&
            opPiece.stepsMoved >= 0 &&
            getGlobalOuterIndex(
              opPiece.playerIndex,
              opPiece.stepsMoved,
              playerCount
            ) === nextGlobalIdx
        )
      if (opponentsOnTarget.length >= 1) {
        score += 750
      }
    }

    if (piece.stepsMoved === -1 && diceValue === 6) {
      score += 420
    }

    if (nextGlobalIdx !== null && safeSet.has(nextGlobalIdx)) {
      score += 240
    }

    if (nextStep >= getHomeStretchStartStep(playerCount)) {
      score += 310
    }

    score += nextStep * 4

    if (score > bestScore) {
      bestScore = score
      bestPiece = piece
    }
  }

  return bestPiece
}
