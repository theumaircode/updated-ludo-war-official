'use client'

import React, { useEffect, useRef } from 'react'
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

export function LiveForestEnvironment({
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

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const particleCount = intensity === 'match' ? 90 : 75
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
          isVortexBound: i < 24,
          angle,
          dist: Math.min(dist, Math.hypot(cx, cy)),
        }
      }
    )

    // Shooting space meteors
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

    const render = () => {
      tick += 1
      ctx.clearRect(0, 0, width, height)

      // 1. Cosmic Nebula Atmosphere Glow
      const rayGrad = ctx.createLinearGradient(0, 0, width, height)
      rayGrad.addColorStop(0, `${skin.sporeColor1}18`)
      rayGrad.addColorStop(0.5, `${skin.sporeColor2}10`)
      rayGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = rayGrad
      ctx.fillRect(0, 0, width, height)

      // 2. Distant Orbiting Planet Silhouettes when space skin hasPlanets is true
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

        ctx.save()
        ctx.globalAlpha = 0.35
        ctx.fillStyle = planetGrad
        ctx.beginPath()
        ctx.arc(px, py, pr, 0, Math.PI * 2)
        ctx.fill()

        // Planetary Ring
        ctx.strokeStyle = skin.sporeColor1
        ctx.lineWidth = 1.8
        ctx.beginPath()
        ctx.ellipse(px, py, pr * 1.85, pr * 0.42, -0.35, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      }

      // 3. Shooting Space Meteors
      if (skin.hasMeteors) {
        for (const m of meteors) {
          if (!m.active) {
            m.cooldown -= 1
            if (m.cooldown <= 0) {
              m.active = true
              m.x = Math.random() * width * 0.7
              m.y = Math.random() * height * 0.35
              m.alpha = 0.95
            }
          } else {
            m.x += m.vx
            m.y += m.vy
            m.alpha -= 0.016

            const tailX = m.x - m.vx * (m.length / 8)
            const tailY = m.y - m.vy * (m.length / 8)
            const meteorGrad = ctx.createLinearGradient(
              m.x,
              m.y,
              tailX,
              tailY
            )
            meteorGrad.addColorStop(0, '#ffffff')
            meteorGrad.addColorStop(0.3, skin.sporeColor1)
            meteorGrad.addColorStop(1, 'transparent')

            ctx.save()
            ctx.globalAlpha = Math.max(0, m.alpha)
            ctx.strokeStyle = meteorGrad
            ctx.lineWidth = 2.2
            ctx.beginPath()
            ctx.moveTo(m.x, m.y)
            ctx.lineTo(tailX, tailY)
            ctx.stroke()
            ctx.restore()

            if (m.alpha <= 0 || m.x > width + 100 || m.y > height + 100) {
              m.active = false
              m.cooldown = 120 + Math.floor(Math.random() * 180)
            }
          }
        }
      }

      const centerX = width / 2
      const centerY = height / 2

      // 4. Starlight Spores & Black Hole Singularity Dust
      for (const p of particles) {
        const pulse =
          0.5 + 0.5 * Math.sin(tick * p.pulseSpeed + p.pulseOffset)
        const currentAlpha = p.alpha * (0.4 + 0.6 * pulse)
        const color = p.isPrimaryColor ? skin.sporeColor1 : skin.sporeColor2

        if (p.isVortexBound) {
          p.angle += 0.0045 + (140 / Math.max(80, p.dist)) * 0.004
          p.dist -= 0.18
          if (p.dist < 28) {
            p.dist = 180 + Math.random() * 220
          }
          p.x = centerX + Math.cos(p.angle) * p.dist
          p.y = centerY + Math.sin(p.angle) * p.dist * 0.85
        } else {
          p.x += p.vx + Math.sin(tick * 0.012 + p.pulseOffset) * 0.28
          p.y += p.vy

          if (p.y < -20) {
            p.y = height + 15
            p.x = Math.random() * width
          }
          if (p.x < -20) p.x = width + 15
          if (p.x > width + 20) p.x = -15
        }

        const glow = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.radius * 4.5
        )
        glow.addColorStop(0, color)
        glow.addColorStop(0.4, `${color}66`)
        glow.addColorStop(1, 'transparent')

        ctx.globalAlpha = currentAlpha
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 4.5, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 0.65, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      animationFrameId = requestAnimationFrame(render)
    }

    render()

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

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
