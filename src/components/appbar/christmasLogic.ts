import * as React from 'react'

export function useChristmas(isXs: boolean) {
  const [isChristmasMode, setIsChristmasMode] = React.useState(false)
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const animRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    try {
      const month = new Date().getMonth()
      setIsChristmasMode(month === 10 || month === 0)
    } catch (e) {
      setIsChristmasMode(false)
    }
  }, [])

  React.useEffect(() => {
    if (!isChristmasMode) {
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
      swayAmp: number
      swayFreq: number
      phase: number
      opacity: number
      isCrystal?: boolean
      rot?: number
      rotSpeed?: number
    }

    const count = isXs ? 30 : 60
    const particles: Particle[] = []
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        r: 1 + Math.random() * 6,
        vy: 0.3 + Math.random() * 1.6,
        swayAmp: 8 + Math.random() * 40,
        swayFreq: 0.002 + Math.random() * 0.006,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.6 + Math.random() * 0.4,
        isCrystal: Math.random() < 0.12,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.06,
      })
    }

    let last = performance.now()

    const drawParticle = (p: Particle) => {
      const x = p.x
      const y = p.y
      const r = Math.max(0.5, p.r)
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, `rgba(255,255,255,${p.opacity})`)
      g.addColorStop(0.6, `rgba(255,255,255,${Math.max(0, p.opacity - 0.15)})`)
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    const drawCrystal = (p: Particle) => {
      const x = p.x
      const y = p.y
      const size = Math.max(1, Math.min(6, p.r))
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(p.rot || 0)
      ctx.globalAlpha = Math.max(0.15, Math.min(1, p.opacity))
      ctx.strokeStyle = 'rgba(255,255,255,1)'
      ctx.lineWidth = Math.max(0.8, size * 0.12)
      ctx.lineCap = 'round'

      // simple 4-point crystal (like a small star)
      ctx.beginPath()
      ctx.moveTo(-size, 0)
      ctx.lineTo(size, 0)
      ctx.moveTo(0, -size)
      ctx.lineTo(0, size)
      ctx.stroke()

      // diagonal cross for sparkle
      ctx.globalAlpha = (p.opacity || 0.8) * 0.7
      ctx.beginPath()
      ctx.moveTo(-size * 0.7, -size * 0.7)
      ctx.lineTo(size * 0.7, size * 0.7)
      ctx.moveTo(-size * 0.7, size * 0.7)
      ctx.lineTo(size * 0.7, -size * 0.7)
      ctx.stroke()

      ctx.restore()
    }

    const step = (now: number) => {
      const dt = Math.min(40, now - last)
      last = now
      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.y += p.vy * (dt / 16)
        p.x += Math.sin(p.phase + p.y * p.swayFreq) * (p.swayAmp * 0.02) * (dt / 16)
        p.phase += 0.002 * (dt / 16)

        if (p.y - p.r > height) {
          p.y = -10 - Math.random() * 40
          p.x = Math.random() * width
          p.r = 1 + Math.random() * 6
          p.vy = 0.3 + Math.random() * 1.6
          p.swayAmp = 8 + Math.random() * 40
          p.swayFreq = 0.002 + Math.random() * 0.006
          p.phase = Math.random() * Math.PI * 2
          p.opacity = 0.6 + Math.random() * 0.4
        }

        if (p.x < -50) p.x = width + 50
        if (p.x > width + 50) p.x = -50

        // draw either soft round snow or a small crystal
        if (p.isCrystal) {
          // slowly rotate crystal
          p.rot = (p.rot || 0) + (p.rotSpeed || 0) * (dt / 16)
          drawCrystal(p)
        } else {
          drawParticle(p)
        }
      }
      animRef.current = requestAnimationFrame(step)
    }

    animRef.current = requestAnimationFrame(step)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      if (ro) ro.disconnect()
      else window.removeEventListener('resize', resize)
    }
  }, [isChristmasMode, isXs])

  return { isChristmasMode, canvasRef }
}

export default useChristmas
