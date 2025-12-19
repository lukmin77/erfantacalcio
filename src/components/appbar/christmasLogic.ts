import * as React from 'react'

export function useChristmas(isXs: boolean, active = false) {
  const isChristmasMode = active
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const animRef = React.useRef<number | null>(null)


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

    const drawSnowman = (xPosition: number, yPosition: number) => {
      const baseX = xPosition
      const baseY = yPosition

      ctx.save()
      ctx.globalAlpha = 0.85

      // Corpo (pallina inferiore)
      ctx.fillStyle = 'rgba(255,255,255,1)'
      ctx.beginPath()
      ctx.arc(baseX, baseY, 8, 0, Math.PI * 2)
      ctx.fill()

      // Testa (pallina superiore)
      ctx.beginPath()
      ctx.arc(baseX, baseY - 13, 6, 0, Math.PI * 2)
      ctx.fill()

      // Occhi
      ctx.fillStyle = 'rgba(0,0,0,0.8)'
      ctx.beginPath()
      ctx.arc(baseX - 2, baseY - 14, 1, 0, Math.PI * 2)
      ctx.arc(baseX + 2, baseY - 14, 1, 0, Math.PI * 2)
      ctx.fill()

      // Naso (carota)
      ctx.fillStyle = 'rgba(255,140,0,0.9)'
      ctx.beginPath()
      ctx.moveTo(baseX, baseY - 12)
      ctx.lineTo(baseX + 4, baseY - 12)
      ctx.lineTo(baseX, baseY - 11)
      ctx.closePath()
      ctx.fill()

      // Bottoni
      ctx.fillStyle = 'rgba(0,0,0,0.7)'
      ctx.beginPath()
      ctx.arc(baseX, baseY - 3, 0.8, 0, Math.PI * 2)
      ctx.arc(baseX, baseY + 1, 0.8, 0, Math.PI * 2)
      ctx.fill()

      // Cappello
      ctx.fillStyle = 'rgba(50,50,50,0.9)'
      // Base cappello
      ctx.fillRect(baseX - 5, baseY - 19, 10, 1.5)
      // Cilindro
      ctx.fillRect(baseX - 3.5, baseY - 25, 7, 6)

      ctx.restore()
    }

    const drawChristmasTree = (xPosition: number, yPosition: number) => {
      const baseX = xPosition
      const baseY = yPosition

      ctx.save()
      ctx.globalAlpha = 0.9

      // Tronco
      ctx.fillStyle = 'rgba(101,67,33,0.9)'
      ctx.fillRect(baseX - 2, baseY - 3, 4, 5)

      // Albero - tre triangoli sovrapposti
      ctx.fillStyle = 'rgba(34,139,34,0.95)' // Verde brillante

      // Triangolo inferiore
      ctx.beginPath()
      ctx.moveTo(baseX, baseY - 8)
      ctx.lineTo(baseX - 10, baseY - 3)
      ctx.lineTo(baseX + 10, baseY - 3)
      ctx.closePath()
      ctx.fill()

      // Triangolo medio
      ctx.beginPath()
      ctx.moveTo(baseX, baseY - 15)
      ctx.lineTo(baseX - 8, baseY - 8)
      ctx.lineTo(baseX + 8, baseY - 8)
      ctx.closePath()
      ctx.fill()

      // Triangolo superiore
      ctx.beginPath()
      ctx.moveTo(baseX, baseY - 22)
      ctx.lineTo(baseX - 6, baseY - 15)
      ctx.lineTo(baseX + 6, baseY - 15)
      ctx.closePath()
      ctx.fill()

      // Stella in cima
      ctx.fillStyle = 'rgba(255,215,0,1)'
      ctx.beginPath()
      ctx.arc(baseX, baseY - 23, 2, 0, Math.PI * 2)
      ctx.fill()

      // Palline decorative
      ctx.fillStyle = 'rgba(255,0,0,0.8)'
      ctx.beginPath()
      ctx.arc(baseX - 4, baseY - 12, 1.5, 0, Math.PI * 2)
      ctx.arc(baseX + 3, baseY - 6, 1.5, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = 'rgba(255,215,0,0.8)'
      ctx.beginPath()
      ctx.arc(baseX + 4, baseY - 16, 1.5, 0, Math.PI * 2)
      ctx.arc(baseX - 2, baseY - 7, 1.5, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    const step = (now: number) => {
      const dt = Math.min(40, now - last)
      last = now
      ctx.clearRect(0, 0, width, height)

      if (isXs) {
        drawSnowman(30, height - 8)
        drawChristmasTree(width / 2 + 110, height - 2)
      } else {
        drawSnowman(width / 2, height - 8)
        drawChristmasTree(width / 2 + 110, height - 2)
        drawChristmasTree(width / 2 + 150, height - 2)
        drawChristmasTree(width / 2 + 170, height - 2)
        drawChristmasTree(width / 2 + 290, height - 2)
      }

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
