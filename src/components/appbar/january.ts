import * as React from 'react'

export function useJanuary(isXs: boolean, active = false) {
  const isJanuaryMode = active
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const animRef = React.useRef<number | null>(null)


  React.useEffect(() => {
    if (!isJanuaryMode) {
      const c = canvasRef.current
      if (c) {
        const ctx = c.getContext('2d')
        if (ctx) ctx.clearRect(0, 0, c.width, c.height)
      }
      return
    }

    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let dpr = window.devicePixelRatio || 1
    let width = canvas.clientWidth
    let height = canvas.clientHeight

    const resize = () => {
      width = canvas.clientWidth || window.innerWidth
      height = canvas.clientHeight || 48
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()

    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(resize)
      ro.observe(canvas)
    } else {
      window.addEventListener('resize', resize)
    }

    type Particle = {
      x: number
      y: number
      r: number
      vy: number
      vx: number
      opacity: number
      type: 'snow' | 'rain'
      sway?: number
    }

    const count = isXs ? 30 : 70
    const particles: Particle[] = []
    for (let i = 0; i < count; i++) {
      const isSnow = Math.random() < 0.6
      if (isSnow) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height - height,
          r: 0.8 + Math.random() * 4,
          vy: 0.2 + Math.random() * 1.2,
          vx: (Math.random() - 0.5) * 0.2,
          opacity: 0.5 + Math.random() * 0.5,
          type: 'snow',
          sway: 6 + Math.random() * 30,
        })
      } else {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height - height,
          r: 1 + Math.random() * 1.2,
          vy: 2 + Math.random() * 4,
          vx: (Math.random() - 0.5) * 0.6,
          opacity: 0.3 + Math.random() * 0.5,
          type: 'rain',
        })
      }
    }

    let last = performance.now()
    let sunPhase = Math.random() * Math.PI * 2

    const drawSnow = (p: Particle) => {
      const x = p.x
      const y = p.y
      const r = Math.max(0.4, p.r)
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, `rgba(255,255,255,${p.opacity})`)
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    const drawRain = (p: Particle) => {
      ctx.save()
      ctx.globalAlpha = Math.max(0.15, p.opacity)
      ctx.strokeStyle = 'rgba(200,220,255,0.7)'
      ctx.lineWidth = Math.max(1, p.r * 0.6)
      const len = 8 + p.r * 6
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(p.x - p.vx * 2, p.y - len)
      ctx.stroke()
      ctx.restore()
    }

    const drawBareTree = (xPosition: number, yPosition: number, scale = 1) => {
      ctx.save()
      ctx.translate(xPosition, yPosition)
      ctx.scale(scale, scale)
      ctx.lineWidth = 1.2
      ctx.strokeStyle = 'rgba(60,40,30,0.95)'
      // trunk
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(0, -12)
      ctx.stroke()

      // branches - recursive-like simple strokes
      const drawBranch = (x: number, y: number, len: number, angle: number, depth: number) => {
        if (depth <= 0 || len < 2) return
        ctx.beginPath()
        ctx.moveTo(x, y)
        const nx = x + Math.cos(angle) * len
        const ny = y + Math.sin(angle) * len
        ctx.lineTo(nx, ny)
        ctx.stroke()
        const spread = 0.6 + Math.random() * 0.6
        drawBranch(nx, ny, len * (0.7 - Math.random() * 0.2), angle - spread, depth - 1)
        drawBranch(nx, ny, len * (0.7 - Math.random() * 0.2), angle + spread, depth - 1)
      }

      drawBranch(0, -12, 10, -1.2, 3)
      drawBranch(0, -12, 8, -0.6, 3)
      drawBranch(0, -12, 9, -1.9, 3)
      ctx.restore()
    }

    const drawPaleSun = (cx: number, cy: number, baseR = 14) => {
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 3)
      glow.addColorStop(0, 'rgba(255,250,200,0.6)')
      glow.addColorStop(0.4, 'rgba(255,245,200,0.25)')
      glow.addColorStop(1, 'rgba(255,245,200,0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(cx, cy, baseR * 3, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.fillStyle = 'rgba(255,245,180,0.9)'
      ctx.arc(cx, cy, baseR, 0, Math.PI * 2)
      ctx.fill()
    }

    const step = (now: number) => {
      const dt = Math.min(40, now - last)
      last = now
      ctx.clearRect(0, 0, width, height)

      // pale sun top-right
      sunPhase += 0.0008 * dt
      const sunX = Math.floor(width / 2) - 120
      const sunY = Math.max(18, height * 0.35 + Math.sin(sunPhase) * 6)
      drawPaleSun(sunX + 200, sunY, isXs ? 8 : 12)

      // ground line (thin snowy ground)
      ctx.fillStyle = 'rgba(250,250,250,1)'
      ctx.fillRect(0, height - 6, width, 6)

      // place bare trees
      if (isXs) {
        drawBareTree(28, height - 6, 0.9)
        drawBareTree(width - 140, height - 6, 0.8)
      } else {
        const base = Math.floor(width / 2) - 120
        drawBareTree(base, height - 6, 1)
        drawBareTree(base + 90, height - 6, 0.9)
        drawBareTree(base + 170, height - 6, 1.1)
      }

      // particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        if (p.type === 'snow') {
          // sway snow
          p.x += Math.sin((p.y + now * 0.02) * 0.01) * (p.sway ? p.sway * 0.002 : 0.5) + p.vx
          p.y += p.vy * (dt / 16)
          p.y += Math.sin((p.x + now * 0.01) * 0.02) * 0.1
          drawSnow(p)
        } else {
          // rain falls faster and is elongated
          p.x += p.vx * (dt / 16)
          p.y += p.vy * (dt / 16)
          drawRain(p)
        }

        if (p.y - p.r > height) {
          p.y = -10 - Math.random() * 40
          p.x = Math.random() * width
          const makeSnow = Math.random() < 0.6
          if (makeSnow) {
            p.type = 'snow'
            p.r = 0.8 + Math.random() * 4
            p.vy = 0.2 + Math.random() * 1.2
            p.vx = (Math.random() - 0.5) * 0.2
            p.opacity = 0.5 + Math.random() * 0.5
            p.sway = 6 + Math.random() * 30
          } else {
            p.type = 'rain'
            p.r = 1 + Math.random() * 1.2
            p.vy = 2 + Math.random() * 4
            p.vx = (Math.random() - 0.5) * 0.6
            p.opacity = 0.3 + Math.random() * 0.5
            delete p.sway
          }
        }

        if (p.x < -50) p.x = width + 50
        if (p.x > width + 50) p.x = -50
      }

      animRef.current = requestAnimationFrame(step)
    }

    animRef.current = requestAnimationFrame(step)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      if (ro) ro.disconnect()
      else window.removeEventListener('resize', resize)
    }
  }, [isJanuaryMode, isXs])

  return { isJanuaryMode, canvasRef }
}

export default useJanuary
