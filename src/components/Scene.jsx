import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PointMaterial, Points, Preload } from '@react-three/drei'
import { gsap } from 'gsap'
import * as THREE from 'three'
import Envelope3D from './Envelope3D.jsx'
import PalaceCourtyard3D from './PalaceCourtyard3D.jsx'

function GoldDust({ count = 650, palace = false }) {
  const points = useRef()
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      const radius = palace ? 15 : 9
      data[i * 3] = (Math.random() - 0.5) * radius * 2
      data[i * 3 + 1] = (Math.random() - 0.5) * (palace ? 9 : 8)
      data[i * 3 + 2] = (Math.random() - 0.5) * (palace ? 20 : 10)
    }
    return data
  }, [count, palace])

  useFrame((state, delta) => {
    if (!points.current) return
    points.current.rotation.y += delta * (palace ? 0.01 : 0.025)
    points.current.position.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.18
  })

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color={palace ? '#f4d783' : '#d7ad55'}
        size={palace ? 0.035 : 0.045}
        sizeAttenuation
        depthWrite={false}
        opacity={0.72}
      />
    </Points>
  )
}

function CameraJourney({ phase, reducedMotion, onPortalComplete }) {
  const { camera } = useThree()
  const portalPlayed = useRef(false)

  useEffect(() => {
    camera.lookAt(0, 0, 0)

    if (phase === 'sealed' || phase === 'opening' || phase === 'revealed') {
      portalPlayed.current = false
      gsap.killTweensOf(camera.position)
      gsap.killTweensOf(camera)
      gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 8,
        duration: reducedMotion ? 0 : 0.8,
        ease: 'power2.out',
        onUpdate: () => camera.lookAt(0, 0, 0),
      })
      gsap.to(camera, {
        fov: 38,
        duration: reducedMotion ? 0 : 0.8,
        onUpdate: () => camera.updateProjectionMatrix(),
      })
    }

    if (phase === 'portal' && !portalPlayed.current) {
      portalPlayed.current = true
      let completed = false
      const timeline = gsap.timeline({
        onComplete: () => {
          completed = true
          onPortalComplete()
        },
      })

      timeline
        .to(camera.position, {
          x: 0,
          y: 0.3,
          z: 3.2,
          duration: reducedMotion ? 0.2 : 1.15,
          ease: 'power2.in',
          onUpdate: () => camera.lookAt(0, 0.25, 0),
        })
        .to(
          camera,
          {
            fov: 58,
            duration: reducedMotion ? 0.2 : 1.15,
            ease: 'power2.in',
            onUpdate: () => camera.updateProjectionMatrix(),
          },
          '<',
        )
        .to(camera.position, {
          z: 0.38,
          y: 0.5,
          duration: reducedMotion ? 0.25 : 1.35,
          ease: 'power4.in',
          onUpdate: () => camera.lookAt(0, 0.45, -2),
        })

      return () => {
        timeline.kill()
        if (!completed) portalPlayed.current = false
      }
    }

    if (phase === 'palace') {
      gsap.killTweensOf(camera.position)
      gsap.killTweensOf(camera)
      camera.position.set(0, 2.15, 10.5)
      camera.fov = 44
      camera.updateProjectionMatrix()
      camera.lookAt(0, 1.1, -4)

      gsap.to(camera.position, {
        z: 8.8,
        y: 1.8,
        duration: reducedMotion ? 0 : 2.2,
        ease: 'power2.out',
        onUpdate: () => camera.lookAt(0, 1.1, -4),
      })
    }
  }, [camera, onPortalComplete, phase, reducedMotion])

  useFrame(() => {
    if (phase === 'palace') {
      camera.lookAt(0, 1.05, -4)
    }
  })

  return null
}

function SceneContent({
  phase,
  reducedMotion,
  celebrationSignal,
  onEnvelopeOpened,
  onPortalComplete,
}) {
  const palace = phase === 'palace'

  return (
    <>
      <color attach="background" args={[palace ? '#06110f' : '#050b13']} />
      <fog attach="fog" args={[palace ? '#071713' : '#050b13', palace ? 9 : 7, palace ? 35 : 23]} />

      <ambientLight intensity={palace ? 0.58 : 0.72} color={palace ? '#b9d2bd' : '#6d82a5'} />
      <directionalLight
        castShadow
        position={palace ? [5, 11, 8] : [4, 6, 8]}
        intensity={palace ? 2.3 : 2.1}
        color={palace ? '#f6d895' : '#e8c36f'}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-5, 1, 4]} intensity={palace ? 18 : 10} distance={18} color="#7f1835" />
      <pointLight position={[5, 3, 2]} intensity={palace ? 14 : 8} distance={20} color="#d4a64f" />

      <GoldDust palace={palace} count={palace ? 850 : 650} />

      {palace ? (
        <PalaceCourtyard3D celebrationSignal={celebrationSignal} reducedMotion={reducedMotion} />
      ) : (
        <Envelope3D phase={phase} reducedMotion={reducedMotion} onOpened={onEnvelopeOpened} />
      )}

      <CameraJourney phase={phase} reducedMotion={reducedMotion} onPortalComplete={onPortalComplete} />
      <Preload all />
    </>
  )
}

export default function Scene(props) {
  return (
    <div className="scene-shell" aria-hidden="true">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 8], fov: 38, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
        }}
        fallback={<div className="webgl-fallback" />}
      >
        <Suspense fallback={null}>
          <SceneContent {...props} />
        </Suspense>
      </Canvas>
    </div>
  )
}
