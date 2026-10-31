'use client'

import React, { memo, useEffect, useRef } from 'react'
import { ENVIRONMENT_SKINS, EnvironmentSkinId } from '@/lib/game-types'

interface LiveForestEnvironmentProps {
  skinId: EnvironmentSkinId
  intensity?: 'menu' | 'match'
}

interface SporeParticle {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  alpha: number
  pulseSpeed: number
  pulseOffset: number
  isPrimaryColor: boolean
  isVortexBound: boolean
  angle: number
  dist: number
}

interface ShootingMeteor {
  x: number
  y: number
  vx: number
  vy: number
  length: number
  alpha: number
  active: boolean
  cooldown: number
}

const SPRITE_RADIUS = 32
const FRAME_MS = 1000 / 60

function isLowEndDevice() {
  if (typeof navigator === 'undefined') return false
  const cores = navigator.hardwareConcurrency || 4
  const memory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4
  return cores <= 4 || memory <= 2
}

// Pre-rendered once per colour so each frame is a cheap drawImage instead of building ~90 gradients
function createSporeSprite(color: string) {
  const size = SPRITE_RADIUS * 2
  const sprite = document.createElement('canvas')
  sprite.width = size
  sprite.height = size
  const sctx = sprite.getContext('2d')
  if (!sctx) return sprite
  const glow = sctx.createRadialGradient(
    SPRITE_RADIUS,
    SPRITE_RADIUS,
    0,
    SPRITE_RADIUS,
    SPRITE_RADIUS,
    SPRITE_RADIUS
  )
  glow.addColorStop(0, color)
  glow.addColorStop(0.4, `${color}66`)
  glow.addColorStop(1, 'transparent')
  sctx.fillStyle = glow
  sctx.fillRect(0, 0, size, size)
  sctx.fillStyle = '#ffffff'
  sctx.beginPath()
  sctx.arc(
    SPRITE_RADIUS,
    SPRITE_RADIUS,
    SPRITE_RADIUS * (0.65 / 4.5),
    0,
    Math.PI * 2
  )
  sctx.fill()
  return sprite
}

export const LiveForestEnvironment = memo(function LiveForestEnvironment({
  skinId,
  intensity = 'match',
}: LiveForestEnvironmentProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const skin =
    ENVIRONMENT_SKINS[skinId] || ENVIRONMENT_SKINS['eclipse-singularity']

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const lowEnd = isLowEndDevice()
    const reduceMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    // Low-end devices draw the ambient layer at ~30fps so the game itself keeps the frame budget
    const minFrameGap = lowEnd ? 1000 / 30 - 2 : 0

    let animationFrameId = 0
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const sprite1 = createSporeSprite(skin.sporeColor1)
    const sprite2 = createSporeSprite(skin.sporeColor2)

    const particleCount = lowEnd ? 45 : intensity === 'match' ? 80 : 70
    const vortexCount = Math.round(particleCount * 0.27)
    const particles: SporeParticle[] = Array.from(
      { length: particleCount },
      (_, i) => {
        const cx = width / 2
        const cy = height / 2
        const angle = Math.random() * Math.PI * 2
        const dist = 70 + Math.random() * Math.max(width, height) * 0.55
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 1.0 + Math.random() * 2.5,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.2 - Math.random() * 0.5,
          alpha: 0.25 + Math.random() * 0.7,
          pulseSpeed: 0.015 + Math.random() * 0.03,
          pulseOffset: Math.random() * Math.PI * 2,
          isPrimaryColor: i % 3 !== 0,
          isVortexBound: i < vortexCount,
          angle,
          dist: Math.min(dist, Math.hypot(cx, cy)),
        }
      }
    )

    const meteors: ShootingMeteor[] = Array.from({ length: 3 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.4,
      vx: 6 + Math.random() * 5,
      vy: 3 + Math.random() * 3,
      length: 55 + Math.random() * 45,
      alpha: 0,
      active: false,
      cooldown: 60 + i * 110,
    }))

    let tick = 0
    let lastTime = 0

    const draw = (dt: number) => {
      tick += dt
      ctx.clearRect(0, 0, width, height)

      if (skin.hasPlanets) {
        const px = width * 0.85 + Math.sin(tick * 0.002) * 12
        const py = height * 0.16 + Math.cos(tick * 0.002) * 8
        const pr = Math.min(width, height) * 0.065

        const planetGrad = ctx.createRadialGradient(
          px - pr * 0.3,
          py - pr * 0.3,
          pr * 0.1,
          px,
          py,
          pr
        )
        planetGrad.addColorStop(0, skin.sporeColor1)
        planetGrad.addColorStop(0.55, `${skin.sporeColor2}55`)
        planetGrad.addColorStop(1, 'rgba(0,0,0,0.9)')

        ctx.globalAlpha = 0.35
        ctx.fillStyle = planetGrad
        ctx.beginPath()
        ctx.arc(px, py, pr, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = skin.sporeColor1
        ctx.lineWidth = 1.8
        ctx.beginPath()
        ctx.ellipse(px, py, pr * 1.85, pr * 0.42, -0.35, 0, Math.PI * 2)
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      if (skin.hasMeteors) {
        for (const m of meteors) {
          if (!m.active) {
            m.cooldown -= dt
            if (m.cooldown <= 0) {
              m.active = true
              m.x = Math.random() * width * 0.7
              m.y = Math.random() * height * 0.35
              m.alpha = 0.95
            }
            continue
          }
          m.x += m.vx * dt
          m.y += m.vy * dt
          m.alpha -= 0.016 * dt

          const tailX = m.x - m.vx * (m.length / 8)
          const tailY = m.y - m.vy * (m.length / 8)
          const meteorGrad = ctx.createLinearGradient(m.x, m.y, tailX, tailY)
          meteorGrad.addColorStop(0, '#ffffff')
          meteorGrad.addColorStop(0.3, skin.sporeColor1)
          meteorGrad.addColorStop(1, 'transparent')

          ctx.globalAlpha = Math.max(0, m.alpha)
          ctx.strokeStyle = meteorGrad
          ctx.lineWidth = 2.2
          ctx.beginPath()
          ctx.moveTo(m.x, m.y)
          ctx.lineTo(tailX, tailY)
          ctx.stroke()

          if (m.alpha <= 0 || m.x > width + 100 || m.y > height + 100) {
            m.active = false
            m.cooldown = 120 + Math.floor(Math.random() * 180)
          }
        }
      }

      const centerX = width / 2
      const centerY = height / 2

      for (const p of particles) {
        const pulse =
          0.5 + 0.5 * Math.sin(tick * p.pulseSpeed + p.pulseOffset)

        if (p.isVortexBound) {
          p.angle += (0.0045 + (140 / Math.max(80, p.dist)) * 0.004) * dt
          p.dist -= 0.18 * dt
          if (p.dist < 28) {
            p.dist = 180 + Math.random() * 220
          }
          p.x = centerX + Math.cos(p.angle) * p.dist
          p.y = centerY + Math.sin(p.angle) * p.dist * 0.85
        } else {
          p.x += (p.vx + Math.sin(tick * 0.012 + p.pulseOffset) * 0.28) * dt
          p.y += p.vy * dt

          if (p.y < -20) {
            p.y = height + 15
            p.x = Math.random() * width
          }
          if (p.x < -20) p.x = width + 15
          if (p.x > width + 20) p.x = -15
        }

        const d = p.radius * 9
        ctx.globalAlpha = p.alpha * (0.4 + 0.6 * pulse)
        ctx.drawImage(
          p.isPrimaryColor ? sprite1 : sprite2,
          p.x - d / 2,
          p.y - d / 2,
          d,
          d
        )
      }

      ctx.globalAlpha = 1
    }

    const frame = (now: number) => {
      animationFrameId = requestAnimationFrame(frame)
      if (lastTime && now - lastTime < minFrameGap) return
      const dt = lastTime ? Math.min(3, (now - lastTime) / FRAME_MS) : 1
      lastTime = now
      draw(dt)
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      if (reduceMotion) draw(0)
    }
    window.addEventListener('resize', handleResize)

    if (reduceMotion) draw(0)
    else animationFrameId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [skin, intensity])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div
        className="absolute inset-[-4%] bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: `url('/images/forest-arena.jpg')`,
          filter:
            skinId === 'eclipse-singularity'
              ? 'brightness(0.44) contrast(1.22) saturate(1.3) hue-rotate(25deg)'
              : skinId === 'blood-moon-altar'
                ? 'brightness(0.42) contrast(1.25) saturate(1.35) hue-rotate(-32deg)'
                : skinId === 'deep-space-nebula'
                  ? 'brightness(0.42) contrast(1.25) saturate(1.4) hue-rotate(165deg)'
                  : 'brightness(0.48) contrast(1.18) saturate(1.2)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(4, 6, 12, 0.28) 0%, rgba(3, 5, 10, 0.76) 68%, rgba(2, 3, 6, 0.96) 100%)',
        }}
      />

      {/* Static nebula wash (was re-filled on the canvas every frame) */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom right, ${skin.sporeColor1}18 0%, ${skin.sporeColor2}10 50%, transparent 100%)`,
        }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
})
