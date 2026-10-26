import {
  CommentaryLanguage,
  CommentaryPopupData,
  FACTIONS,
  PieceInstance,
  PieceSculptType,
  PlayerCountOption,
  PlayerState,
} from './game-types'
import {
  getGlobalOuterIndex,
  getGoalSteps,
  getHomeStretchStartStep,
  SAFE_INDICES_4P,
  SAFE_INDICES_6P,
} from './ludo-engine'

const PIECE_DISPLAY_NAME: Record<PieceSculptType, string> = {
  crown: 'Crown',
  horse: 'Horse',
  alien: 'Alien',
  human: 'Human',
}

/**
 * Deterministic, 100% accurate real-time board state analyzer for English & Hinglish commentary.
 * Never guesses or hallucinates: every color, piece type, target, capture, and distance is
 * computed strictly from the verified board coordinates.
 */
export function generateMoveCommentary(params: {
  moverPlayer: PlayerState
  movedPiece: PieceInstance
  rolledValue: number
  isDeploying: boolean
  targetSteps: number
  reachedBlackHole: boolean
  capturedPieces: { player: PlayerState; piece: PieceInstance }[]
  allPlayersAfterMove: PlayerState[]
  playerCount: PlayerCountOption
  requiredToWin: number
  language: CommentaryLanguage
}): CommentaryPopupData {
  const {
    moverPlayer,
    movedPiece,
    rolledValue,
    isDeploying,
    targetSteps,
    reachedBlackHole,
    capturedPieces,
    allPlayersAfterMove,
    playerCount,
    requiredToWin,
    language,
  } = params

  const faction = FACTIONS[movedPiece.faction]
  const colorLabel = faction.colorName // 'Red' | 'Green' | 'Blue' | 'Yellow' | 'Purple' | 'Cyan'
  const pieceLabel = PIECE_DISPLAY_NAME[movedPiece.sculptType] // 'Crown' | 'Horse' | 'Alien' | 'Human'
  const actorTitle = `${colorLabel} ${pieceLabel}`

  const goalStep = getGoalSteps(playerCount)
  const homeStart = getHomeStretchStartStep(playerCount)
  const safeSet = playerCount === 6 ? SAFE_INDICES_6P : SAFE_INDICES_4P

  // 1. CAPTURE / ELIMINATION EVENT (Highest Drama)
  if (capturedPieces.length > 0) {
    const victim = capturedPieces[0]
    const victimColor = FACTIONS[victim.piece.faction].colorName
    const victimPiece = PIECE_DISPLAY_NAME[victim.piece.sculptType]
    const victimTitle = `${victimColor} ${victimPiece}`

    if (language === 'hinglish') {
      return {
        id: Date.now(),
        title: `${actorTitle.toUpperCase()} ELIMINATES ${victimTitle.toUpperCase()}!`,
        text: `BHAIII KYA SHOT HAI! ${actorTitle} ne ${victimTitle} ko beech raaste uda diya aur seedha base wapas bhej diya! Ab Universe Ruling Ring pe kabza pakka!`,
        accentHex: faction.primaryHex,
        eventType: 'capture',
      }
    }
    return {
      id: Date.now(),
      title: `${actorTitle.toUpperCase()} ELIMINATES ${victimTitle.toUpperCase()}!`,
      text: `Ruthless strike! The ${actorTitle} has eliminated the ${victimTitle} and banished it back to base while marching toward the Universe Ruling Ring!`,
      accentHex: faction.primaryHex,
      eventType: 'capture',
    }
  }

  // 2. ENTERED THE BLACK HOLE & UNIVERSE RULING RING
  if (reachedBlackHole) {
    const updatedMover =
      allPlayersAfterMove.find((p) => p.index === moverPlayer.index) ||
      moverPlayer
    const ringCount = updatedMover.finishedCount
    const remaining = Math.max(0, requiredToWin - ringCount)

    if (remaining === 0) {
      if (language === 'hinglish') {
        return {
          id: Date.now(),
          title: `${actorTitle.toUpperCase()} CONQUERS THE UNIVERSE RING!`,
          text: `ITIHAS RACH DIYA! ${actorTitle} Black Hole mein utar gaya aur poora brahmand jeet liya! Universe Ruling Ring ab aapki hai!`,
          accentHex: '#facc15',
          eventType: 'ring',
        }
      }
      return {
        id: Date.now(),
        title: `${actorTitle.toUpperCase()} CONQUERS THE UNIVERSE RING!`,
        text: `The ${actorTitle} enters the Black Hole Singularity and claims the Universe Ruling Ring! Supreme victory over the cosmos!`,
        accentHex: '#facc15',
        eventType: 'ring',
      }
    }

    if (language === 'hinglish') {
      return {
        id: Date.now(),
        title: `${actorTitle.toUpperCase()} ENTERS THE BLACK HOLE!`,
        text: `KAMAAL HO GAYA YAAR! ${actorTitle} seedha Black Hole ke andar! Ab Universe Ruling Ring jeetne ke liye sirf ${remaining} aur piece chahiye! Bonus Roll!`,
        accentHex: '#c084fc',
        eventType: 'ring',
      }
    }
    return {
      id: Date.now(),
      title: `${actorTitle.toUpperCase()} ENTERS THE BLACK HOLE!`,
      text: `The ${actorTitle} plunges into the Black Hole Singularity! Only ${remaining} more needed to claim the Universe Ruling Ring! Bonus roll granted!`,
      accentHex: '#c084fc',
      eventType: 'ring',
    }
  }

  // 3. DEPLOYING OUT OF BASE ON A 6
  if (isDeploying) {
    if (language === 'hinglish') {
      return {
        id: Date.now(),
        title: `${actorTitle.toUpperCase()} ENTERS THE WAR!`,
        text: `Chhakka aaya dost! ${actorTitle} base se bahar maidan mein utar chuka hai — nishana seedha Black Hole aur Universe Ruling Ring!`,
        accentHex: faction.primaryHex,
        eventType: 'spawn',
      }
    }
    return {
      id: Date.now(),
      title: `${actorTitle.toUpperCase()} DEPLOYED ON 6!`,
      text: `Rolled a 6! The ${actorTitle} deploys onto the battlefield, beginning its march toward the Black Hole and the Universe Ruling Ring!`,
      accentHex: faction.primaryHex,
      eventType: 'spawn',
    }
  }

  // 4. CHECK IF STALKING / HUNTING AN OPPONENT PIECE 1..6 STEPS AHEAD ON OUTER TRACK
  if (targetSteps < homeStart) {
    let huntedTarget: {
      colorName: string
      pieceName: string
      distance: number
    } | null = null

    for (let dist = 1; dist <= 6; dist++) {
      const checkStep = targetSteps + dist
      if (checkStep >= homeStart) break
      const checkGlobalIdx = getGlobalOuterIndex(
        movedPiece.playerIndex,
        checkStep,
        playerCount
      )
      if (checkGlobalIdx === null || safeSet.has(checkGlobalIdx)) continue

      for (const otherP of allPlayersAfterMove) {
        if (otherP.index === movedPiece.playerIndex) continue
        for (const opPiece of otherP.pieces) {
          if (opPiece.isFinished || opPiece.stepsMoved < 0) continue
          const opGlobalIdx = getGlobalOuterIndex(
            opPiece.playerIndex,
            opPiece.stepsMoved,
            playerCount
          )
          if (opGlobalIdx === checkGlobalIdx) {
            huntedTarget = {
              colorName: FACTIONS[opPiece.faction].colorName,
              pieceName: PIECE_DISPLAY_NAME[opPiece.sculptType],
              distance: dist,
            }
            break
          }
        }
        if (huntedTarget) break
      }
      if (huntedTarget) break
    }

    if (huntedTarget) {
      const targetName = `${huntedTarget.colorName} ${huntedTarget.pieceName}`
      if (language === 'hinglish') {
        return {
          id: Date.now(),
          title: `${actorTitle.toUpperCase()} HUNTING ${targetName.toUpperCase()}!`,
          text: `Bach ke rehna bhai! ${actorTitle} ${rolledValue} kadam aage badha aur ab ${targetName} ko udata hua Universe Ruling Ring ki taraf badh raha hai (sirf ${huntedTarget.distance} kadam door)!`,
          accentHex: faction.primaryHex,
          eventType: 'stalk',
        }
      }
      return {
        id: Date.now(),
        title: `${actorTitle.toUpperCase()} STALKING ${targetName.toUpperCase()}!`,
        text: `The ${actorTitle} moves ${rolledValue} steps forward toward capturing the ${targetName} (${huntedTarget.distance} steps ahead) and closing in on the Universe Ruling Ring!`,
        accentHex: faction.primaryHex,
        eventType: 'stalk',
      }
    }
  }

  // 5. INSIDE THE FINAL HOME STRETCH LANE
  if (targetSteps >= homeStart) {
    const stepsLeft = goalStep - targetSteps
    if (language === 'hinglish') {
      return {
        id: Date.now(),
        title: `${actorTitle.toUpperCase()} IN FINAL RING LANE!`,
        text: `Full tension! ${actorTitle} safe home line mein pahunch gaya hai — Universe Ruling Ring aur Black Hole ab bas ${stepsLeft} kadam door hai!`,
        accentHex: faction.primaryHex,
        eventType: 'move',
      }
    }
    return {
      id: Date.now(),
      title: `${actorTitle.toUpperCase()} APPROACHING THE RING!`,
      text: `The ${actorTitle} surges into the final cosmic lane — only ${stepsLeft} steps remain to enter the Black Hole and seize the Universe Ruling Ring!`,
      accentHex: faction.primaryHex,
      eventType: 'move',
    }
  }

  // 6. LANDED ON A PROTECTED SAFE STAR TILE
  const currentGlobalIdx = getGlobalOuterIndex(
    movedPiece.playerIndex,
    targetSteps,
    playerCount
  )
  if (currentGlobalIdx !== null && safeSet.has(currentGlobalIdx)) {
    if (language === 'hinglish') {
      return {
        id: Date.now(),
        title: `${actorTitle.toUpperCase()} SECURED SAFE STAR!`,
        text: `Dimag se khela yaar! ${actorTitle} ${rolledValue} kadam chal ke Safe Star pe baith gaya hai — yahan koi hath nahi laga sakta, seedha Universe Ring pe nazar!`,
        accentHex: faction.primaryHex,
        eventType: 'move',
      }
    }
    return {
      id: Date.now(),
      title: `${actorTitle.toUpperCase()} ON SAFE STAR!`,
      text: `Calculated maneuver! The ${actorTitle} advances ${rolledValue} steps onto a protected Safe Star, fortifying its path to the Universe Ruling Ring.`,
      accentHex: faction.primaryHex,
      eventType: 'move',
    }
  }

  // 7. STANDARD ADVANCE ON THE COSMIC TRACK
  const stepsRemainingToRing = goalStep - targetSteps
  if (language === 'hinglish') {
    return {
      id: Date.now(),
      title: `${actorTitle.toUpperCase()} ADVANCES ${rolledValue} STEPS`,
      text: `Shandaar chaal! ${actorTitle} ${rolledValue} kadam tezi se aage badha — Black Hole ki Universe Ruling Ring ab ${stepsRemainingToRing} kadam door hai!`,
      accentHex: faction.primaryHex,
      eventType: 'move',
    }
  }
  return {
    id: Date.now(),
    title: `${actorTitle.toUpperCase()} ADVANCES ${rolledValue} STEPS`,
    text: `The ${actorTitle} marches ${rolledValue} steps across the cosmic track, closing to within ${stepsRemainingToRing} steps of the Universe Ruling Ring!`,
    accentHex: faction.primaryHex,
    eventType: 'move',
  }
}

export function generateNoMoveCommentary(params: {
  player: PlayerState
  rolledValue: number
  language: CommentaryLanguage
}): CommentaryPopupData {
  const { player, rolledValue, language } = params
  const faction = FACTIONS[player.faction]
  const colorLabel = faction.colorName

  if (language === 'hinglish') {
    return {
      id: Date.now(),
      title: `${colorLabel.toUpperCase()} ROLLED ${rolledValue} — NO MOVE`,
      text: `Arre yaar! ${colorLabel} team ka ${rolledValue} aaya par abhi koi piece chal nahi sakta. Agle khiladi ki baari!`,
      accentHex: faction.primaryHex,
      eventType: 'roll',
    }
  }
  return {
    id: Date.now(),
    title: `${colorLabel.toUpperCase()} ROLLED ${rolledValue} — TURN PASSED`,
    text: `${colorLabel} rolled a ${rolledValue} with no legal move available on the board. Passing the cosmic dice to the next commander.`,
    accentHex: faction.primaryHex,
    eventType: 'roll',
  }
}
