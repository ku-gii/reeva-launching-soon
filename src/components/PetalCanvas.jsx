import { useEffect, useRef } from 'react'

const palette = ['#A10063', '#D73E8C', '#F3A6CB', '#8A6846']

export default function PetalCanvas({ intensity = 1 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const context = canvas.getContext('2d', { alpha: true })
    let frame = 0
    let width = 0
    let height = 0
    let particles = []
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const createParticle = (randomY = false) => ({
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -30 - Math.random() * height * 0.35,
      size: 5 + Math.random() * 9,
      speed: (0.25 + Math.random() * 0.55) * intensity,
      drift: -0.35 + Math.random() * 0.7,
      rotation: Math.random() * Math.PI,
      rotationSpeed: -0.012 + Math.random() * 0.024,
      sway: 18 + Math.random() * 44,
      phase: Math.random() * Math.PI * 2,
      color: palette[Math.floor(Math.random() * palette.length)],
      opacity: 0.22 + Math.random() * 0.58,
    })

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = reducedMotion
        ? 10
        : Math.round(Math.min(42, Math.max(18, width / 42)) * intensity)

      particles = Array.from({ length: count }, () => createParticle(true))
    }

    const drawPetal = (particle) => {
      context.save()
      context.translate(
        particle.x + Math.sin(particle.phase + particle.y * 0.006) * particle.sway,
        particle.y,
      )
      context.rotate(particle.rotation)
      context.globalAlpha = particle.opacity
      context.fillStyle = particle.color
      context.beginPath()
      context.moveTo(0, -particle.size)
      context.bezierCurveTo(
        particle.size * 0.9,
        -particle.size * 0.45,
        particle.size * 0.72,
        particle.size * 0.68,
        0,
        particle.size,
      )
      context.bezierCurveTo(
        -particle.size * 0.72,
        particle.size * 0.68,
        -particle.size * 0.9,
        -particle.size * 0.45,
        0,
        -particle.size,
      )
      context.fill()
      context.restore()
    }

    const animate = () => {
      context.clearRect(0, 0, width, height)

      particles.forEach((particle) => {
        particle.y += reducedMotion ? particle.speed * 0.25 : particle.speed
        particle.x += particle.drift
        particle.rotation += particle.rotationSpeed

        if (particle.y > height + 40) {
          Object.assign(particle, createParticle(false), {
            x: Math.random() * width,
            y: -40,
          })
        }

        drawPetal(particle)
      })

      frame = requestAnimationFrame(animate)
    }

    resize()
    animate()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [intensity])

  return <canvas ref={ref} className="petal-canvas" aria-hidden="true" />
}
