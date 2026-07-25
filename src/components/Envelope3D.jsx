import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { gsap } from 'gsap'
import * as THREE from 'three'

function createInvitationTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1600
  canvas.height = 1000
  const ctx = canvas.getContext('2d')

  const ivory = '#f4ead3'
  const ink = '#17362f'
  const gold = '#b9882e'
  const maroon = '#6e1830'

  ctx.fillStyle = ivory
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const paperGradient = ctx.createRadialGradient(800, 470, 50, 800, 470, 850)
  paperGradient.addColorStop(0, 'rgba(255,255,255,.38)')
  paperGradient.addColorStop(1, 'rgba(112,60,20,.11)')
  ctx.fillStyle = paperGradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = gold
  ctx.lineWidth = 12
  ctx.strokeRect(48, 48, 1504, 904)
  ctx.lineWidth = 3
  ctx.strokeRect(72, 72, 1456, 856)

  // Pichwai-inspired corner florals.
  const corners = [
    [115, 115, 1, 1],
    [1485, 115, -1, 1],
    [115, 885, 1, -1],
    [1485, 885, -1, -1],
  ]

  corners.forEach(([x, y, sx, sy]) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(sx, sy)
    ctx.strokeStyle = maroon
    ctx.fillStyle = 'rgba(185,136,46,.2)'
    ctx.lineWidth = 6
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath()
      ctx.ellipse(18 + i * 24, 18 + i * 18, 15, 30, -0.7, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(50, 22, 72, 70, 150, 115)
    ctx.stroke()
    ctx.restore()
  })

  ctx.textAlign = 'center'
  ctx.fillStyle = maroon
  ctx.font = '600 32px Georgia, serif'
  ctx.letterSpacing = '9px'
  ctx.fillText('BY ROYAL REQUEST', 800, 235)

  ctx.fillStyle = gold
  ctx.font = '700 150px Georgia, serif'
  ctx.shadowColor = 'rgba(89,55,10,.35)'
  ctx.shadowBlur = 14
  ctx.shadowOffsetY = 8
  ctx.fillText('REEVA', 800, 485)
  ctx.shadowColor = 'transparent'

  ctx.strokeStyle = gold
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(520, 555)
  ctx.lineTo(1080, 555)
  ctx.stroke()

  ctx.fillStyle = ink
  ctx.font = 'italic 52px Georgia, serif'
  ctx.fillText('Touch of Magic', 800, 640)

  ctx.fillStyle = '#5b4b37'
  ctx.font = '32px Georgia, serif'
  ctx.fillText('An unveiling of luxury Indian fashion', 800, 735)
  ctx.fillText('crafted for the modern royal.', 800, 785)

  // Subtle paper grain.
  const grain = ctx.getImageData(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < grain.data.length; i += 4) {
    const noise = Math.random() * 8 - 4
    grain.data[i] += noise
    grain.data[i + 1] += noise
    grain.data[i + 2] += noise
  }
  ctx.putImageData(grain, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

function createTriangleGeometry(width, height, pointDown = true) {
  const half = width / 2
  const tipY = pointDown ? -height : height
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array([-half, 0, 0, half, 0, 0, 0, tipY, 0]), 3),
  )
  geometry.setAttribute(
    'uv',
    new THREE.BufferAttribute(new Float32Array([0, 1, 1, 1, 0.5, 0]), 2),
  )
  geometry.setIndex([0, 1, 2])
  geometry.computeVertexNormals()
  return geometry
}

function WaxSeal({ sealRef, particleRefs }) {
  const fragments = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        angle: (index / 18) * Math.PI * 2,
        radius: 0.05 + Math.random() * 0.22,
        size: 0.025 + Math.random() * 0.055,
      })),
    [],
  )

  return (
    <group ref={sealRef} position={[0, -0.18, 0.43]}>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.43, 0.46, 0.12, 48]} />
        <meshStandardMaterial color="#8f1734" roughness={0.48} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0, 0.073]}>
        <torusGeometry args={[0.28, 0.035, 10, 36]} />
        <meshStandardMaterial color="#c39036" metalness={0.8} roughness={0.25} />
      </mesh>
      <group position={[0, -0.01, 0.08]}>
        <mesh position={[-0.055, 0.04, 0]}>
          <boxGeometry args={[0.07, 0.35, 0.035]} />
          <meshStandardMaterial color="#d7ad55" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0.04, 0.18, 0]} rotation={[0, 0, -0.2]}>
          <torusGeometry args={[0.12, 0.035, 8, 22, Math.PI * 1.45]} />
          <meshStandardMaterial color="#d7ad55" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0.11, -0.08, 0]} rotation={[0, 0, -0.65]}>
          <boxGeometry args={[0.07, 0.3, 0.035]} />
          <meshStandardMaterial color="#d7ad55" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {fragments.map((fragment, index) => (
        <mesh
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          ref={(node) => {
            particleRefs.current[index] = node
          }}
          position={[
            Math.cos(fragment.angle) * fragment.radius,
            Math.sin(fragment.angle) * fragment.radius,
            0.08,
          ]}
          rotation={[Math.random(), Math.random(), Math.random()]}
        >
          <icosahedronGeometry args={[fragment.size, 0]} />
          <meshStandardMaterial color={index % 3 === 0 ? '#d7ad55' : '#9e1f3f'} metalness={0.32} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

export default function Envelope3D({ phase, reducedMotion, onOpened }) {
  const root = useRef()
  const flap = useRef()
  const card = useRef()
  const cardGlow = useRef()
  const seal = useRef()
  const sealParticles = useRef([])
  const played = useRef(false)
  const { viewport } = useThree()

  const cardTexture = useMemo(() => createInvitationTexture(), [])
  const flapGeometry = useMemo(() => createTriangleGeometry(5.05, 1.85, true), [])
  const sideGeometry = useMemo(() => createTriangleGeometry(3.2, 1.3, false), [])
  const responsiveScale = Math.min(1, Math.max(0.58, viewport.width / 7.2))

  useEffect(() => () => cardTexture.dispose(), [cardTexture])
  useEffect(() => () => flapGeometry.dispose(), [flapGeometry])
  useEffect(() => () => sideGeometry.dispose(), [sideGeometry])

  useEffect(() => {
    if (phase !== 'opening' || played.current) return undefined

    played.current = true
    let completed = false
    const duration = reducedMotion ? 0.18 : 1
    const timeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: () => {
        completed = true
        onOpened()
      },
    })

    sealParticles.current.forEach((fragment, index) => {
      if (!fragment) return
      const angle = (index / Math.max(1, sealParticles.current.length)) * Math.PI * 2
      gsap.to(fragment.position, {
        x: Math.cos(angle) * (0.8 + Math.random() * 0.7),
        y: Math.sin(angle) * (0.7 + Math.random() * 0.7),
        z: 0.7 + Math.random() * 0.5,
        duration: reducedMotion ? 0.15 : 0.7,
        delay: reducedMotion ? 0 : index * 0.012,
        ease: 'power3.out',
      })
      gsap.to(fragment.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: reducedMotion ? 0.15 : 0.62,
        delay: reducedMotion ? 0 : 0.15 + index * 0.01,
        ease: 'power2.in',
      })
    })

    timeline
      .to(seal.current.scale, {
        x: 0.12,
        y: 0.12,
        z: 0.12,
        duration: 0.38 * duration,
        ease: 'back.in(2.4)',
      })
      .to(
        flap.current.rotation,
        {
          x: -Math.PI * 0.96,
          duration: 1.25 * duration,
          ease: 'power3.inOut',
        },
        0.18 * duration,
      )
      .to(
        card.current.position,
        {
          y: 1.02,
          z: 0.48,
          duration: 1.25 * duration,
          ease: 'power3.out',
        },
        0.62 * duration,
      )
      .to(
        card.current.rotation,
        {
          x: -0.045,
          duration: 1.1 * duration,
          ease: 'power2.out',
        },
        0.62 * duration,
      )
      .to(
        cardGlow.current.material,
        {
          opacity: 0.35,
          duration: 0.9 * duration,
          ease: 'sine.out',
        },
        0.74 * duration,
      )

    return () => {
      timeline.kill()
      if (!completed) played.current = false
    }
  }, [onOpened, phase, reducedMotion])

  useFrame((state, delta) => {
    if (!root.current) return
    if (reducedMotion) return

    const targetY = Math.sin(state.clock.elapsedTime * 0.7) * 0.1
    root.current.position.y = THREE.MathUtils.damp(root.current.position.y, targetY, 2.8, delta)
    root.current.rotation.y = THREE.MathUtils.damp(
      root.current.rotation.y,
      Math.sin(state.clock.elapsedTime * 0.35) * 0.055,
      2.4,
      delta,
    )
  })

  return (
    <group ref={root} scale={responsiveScale} position={[0, -0.15, 0]} rotation={[-0.03, 0, 0]}>
      <mesh ref={cardGlow} position={[0, 0.75, 0.02]} scale={[1.06, 1.08, 1]}>
        <planeGeometry args={[4.55, 2.85]} />
        <meshBasicMaterial color="#d8ae58" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh ref={card} castShadow receiveShadow position={[0, -0.34, 0.1]}>
        <planeGeometry args={[4.48, 2.82]} />
        <meshStandardMaterial map={cardTexture} roughness={0.66} metalness={0.05} />
      </mesh>

      <RoundedBox args={[5.2, 3.25, 0.18]} radius={0.08} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#5b1028" roughness={0.72} metalness={0.08} />
      </RoundedBox>

      <mesh position={[0, -0.82, 0.19]} castShadow receiveShadow>
        <planeGeometry args={[5.08, 1.58]} />
        <meshStandardMaterial color="#6e1830" roughness={0.68} metalness={0.1} />
      </mesh>

      <mesh position={[-1.85, -0.48, 0.205]} rotation={[0, 0, -Math.PI / 2]} geometry={sideGeometry}>
        <meshStandardMaterial color="#771b35" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[1.85, -0.48, 0.205]} rotation={[0, 0, Math.PI / 2]} geometry={sideGeometry}>
        <meshStandardMaterial color="#771b35" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>

      <group ref={flap} position={[0, 1.57, 0.23]}>
        <mesh geometry={flapGeometry} castShadow receiveShadow>
          <meshStandardMaterial color="#7d1d38" roughness={0.63} metalness={0.1} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.72, 0.018]} scale={[0.91, 0.91, 1]} geometry={flapGeometry}>
          <meshStandardMaterial color="#ad7742" roughness={0.82} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <WaxSeal sealRef={seal} particleRefs={sealParticles} />

      <mesh position={[0, -1.56, 0.31]}>
        <boxGeometry args={[4.7, 0.035, 0.025]} />
        <meshStandardMaterial color="#c79a41" metalness={0.78} roughness={0.25} />
      </mesh>
    </group>
  )
}
