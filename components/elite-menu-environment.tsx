'use client'

import React, { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  z: number
  r: number
  tw: number
  hue: number
}

interface Mote {
  x: number
  y: number
  r: number
  vy: number
  vx: number
  a: number
}

interface Streak {
  x: number
  y: number
  len: number
  life: number
  max: number
  speed: number
}

const NEBULAE = [
  { x: 0.18, y: 0.22, r: 0.75, c: [92, 46, 168], a: 0.32, sx: 0.00011, sy: 0.00008 },
  { x: 0.85, y: 0.35, r: 0.6, c: [28, 64, 140], a: 0.3, sx: -0.00009, sy: 0.00012 },
  { x: 0.5, y: 0.82, r: 0.7, c: [150, 92, 32], a: 0.16, sx: 0.00007, sy: -0.0001 },
  { x: 0.7, y: 0.1, r: 0.45, c: [168, 38, 88], a: 0.12, sx: -0.00013, sy: 0.00006 },
]

export function EliteMenuEnvironment() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let dpr = 1
    let stars: Star[] = []
    let motes: Mote[] = []
    const streaks: Streak[] = []
    let raf = 0
    let last = performance.now()
    let nextStreak = 2500

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const area = w * h
      stars = Array.from({ length: Math.min(420, Math.floor(area / 2600)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 0.9 + 0.1,
        r: Math.random() * 1.1 + 0.2,
        tw: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.15 ? 40 : Math.random() < 0.3 ? 220 : 0,
      }))
      motes = Array.from({ length: Math.min(60, Math.floor(area / 18000)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.6,
        vy: -(Math.random() * 6 + 3),
        vx: Math.random() * 4 - 2,
        a: Math.random() * 0.35 + 0.1,
      }))
    }

    const draw = (t: number) => {
      const dt = Math.min(50, t - last)
      last = t

      const base = ctx.createLinearGradient(0, 0, 0, h)
      base.addColorStop(0, '#05030d')
      base.addColorStop(0.55, '#0a0718')
      base.addColorStop(1, '#030208')
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = base
      ctx.fillRect(0, 0, w, h)

      // Drifting volumetric nebula clouds
      ctx.globalCompositeOperation = 'lighter'
      const m = Math.max(w, h)
      for (const n of NEBULAE) {
        const cx = (n.x + Math.sin(t * n.sx) * 0.08) * w
        const cy = (n.y + Math.cos(t * n.sy) * 0.06) * h
        const breathe = 1 + Math.sin(t * 0.0003 + n.x * 10) * 0.06
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, n.r * m * breathe)
        const [r, gg, b] = n.c
        g.addColorStop(0, `rgba(${r},${gg},${b},${n.a})`)
        g.addColorStop(0.45, `rgba(${r},${gg},${b},${n.a * 0.35})`)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }

      // Slow god-ray sweep from the upper center
      const rayAngle = Math.sin(t * 0.00012) * 0.35
      ctx.save()
      ctx.translate(w / 2, -h * 0.1)
      ctx.rotate(rayAngle)
      const ray = ctx.createLinearGradient(0, 0, 0, h * 1.2)
      ray.addColorStop(0, 'rgba(255,214,140,0.07)')
      ray.addColorStop(1, 'rgba(255,214,140,0)')
      ctx.fillStyle = ray
      ctx.beginPath()
      ctx.moveTo(-w * 0.05, 0)
      ctx.lineTo(w * 0.05, 0)
      ctx.lineTo(w * 0.45, h * 1.2)
      ctx.lineTo(-w * 0.45, h * 1.2)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // Parallax starfield drifting toward the viewer's lower-left
      for (const s of stars) {
        if (!reduceMotion) {
          s.x -= s.z * 0.012 * dt
          s.y += s.z * 0.004 * dt
          if (s.x < -2) s.x = w + 2
          if (s.y > h + 2) s.y = -2
        }
        const tw = 0.55 + Math.sin(t * 0.0015 * (0.5 + s.z) + s.tw) * 0.45
        const alpha = tw * (0.35 + s.z * 0.65)
        ctx.fillStyle =
          s.hue === 40
            ? `rgba(255,220,160,${alpha})`
            : s.hue === 220
              ? `rgba(180,205,255,${alpha})`
              : `rgba(255,255,255,${alpha})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * (0.6 + s.z * 0.6), 0, Math.PI * 2)
        ctx.fill()
      }

      // Rising golden embers / dust in the foreground
      for (const p of motes) {
        if (!reduceMotion) {
          p.y += (p.vy * dt) / 1000
          p.x += ((p.vx + Math.sin(t * 0.001 + p.r) * 3) * dt) / 1000
          if (p.y < -10) {
            p.y = h + 10
            p.x = Math.random() * w
          }
        }
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
        g.addColorStop(0, `rgba(255,200,120,${p.a})`)
        g.addColorStop(1, 'rgba(255,200,120,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
        ctx.fill()
      }

      // Rare, thin cinematic shooting streaks
      if (!reduceMotion) {
        nextStreak -= dt
        if (nextStreak <= 0) {
          nextStreak = 4000 + Math.random() * 5000
          streaks.push({
            x: w * (0.4 + Math.random() * 0.7),
            y: h * Math.random() * 0.4,
            len: 120 + Math.random() * 140,
            life: 0,
            max: 900 + Math.random() * 500,
            speed: 0.7 + Math.random() * 0.4,
          })
        }
      }
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i]
        s.life += dt
        s.x -= s.speed * dt
        s.y += s.speed * 0.45 * dt
        const k = s.life / s.max
        const a = Math.sin(Math.PI * Math.min(1, k)) * 0.75
        const tx = s.x + s.len
        const ty = s.y - s.len * 0.45
        const g = ctx.createLinearGradient(s.x, s.y, tx, ty)
        g.addColorStop(0, `rgba(255,255,255,${a})`)
        g.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.strokeStyle = g
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(tx, ty)
        ctx.stroke()
        if (s.life >= s.max) streaks.splice(i, 1)
      }

      // Cinematic vignette
      ctx.globalCompositeOperation = 'source-over'
      const v = ctx.createRadialGradient(w / 2, h * 0.45, Math.min(w, h) * 0.25, w / 2, h / 2, m * 0.8)
      v.addColorStop(0, 'rgba(0,0,0,0)')
      v.addColorStop(1, 'rgba(0,0,0,0.78)')
      ctx.fillStyle = v
      ctx.fillRect(0, 0, w, h)

      raf = requestAnimationFrame(draw)
    }

    const onVisibility = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) {
        last = performance.now()
        raf = requestAnimationFrame(draw)
      }
    }

    resize()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05030d]">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
