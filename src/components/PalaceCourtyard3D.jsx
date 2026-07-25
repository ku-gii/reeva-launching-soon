import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, PointMaterial, Points } from '@react-three/drei'
import * as THREE from 'three'

const GOLD = '#c79a43'
const IVORY = '#d9cdb5'
const EMERALD = '#123d35'
const MAROON = '#701a34'

function Column({ x, z, height = 3.9 }) {
  return (
    <group position={[x, 0, z]}>
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.18, 0.23, height, 20]} />
        <meshStandardMaterial color={IVORY} roughness={0.62} metalness={0.04} />
      </mesh>
      <mesh castShadow position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.38, 0.42, 0.3, 24]} />
        <meshStandardMaterial color={GOLD} metalness={0.62} roughness={0.32} />
      </mesh>
      <mesh castShadow position={[0, height - 0.12, 0]}>
        <cylinderGeometry args={[0.35, 0.25, 0.3, 24]} />
        <meshStandardMaterial color={GOLD} metalness={0.62} roughness={0.32} />
      </mesh>
    </group>
  )
}

function Archway({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <Column x={-1.8} z={0} />
      <Column x={1.8} z={0} />
      <mesh castShadow receiveShadow position={[0, 3.87, 0]}>
        <torusGeometry args={[1.8, 0.23, 14, 64, Math.PI]} />
        <meshStandardMaterial color={IVORY} roughness={0.62} metalness={0.04} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 4.08, -0.06]}>
        <boxGeometry args={[4.15, 0.34, 0.44]} />
        <meshStandardMaterial color={IVORY} roughness={0.65} />
      </mesh>
      <mesh position={[0, 4.1, 0.19]}>
        <boxGeometry args={[3.82, 0.055, 0.03]} />
        <meshStandardMaterial color={GOLD} metalness={0.75} roughness={0.25} />
      </mesh>
    </group>
  )
}

function JaliPanel({ position }) {
  const bars = useMemo(() => Array.from({ length: 11 }, (_, index) => index - 5), [])

  return (
    <group position={position}>
      <mesh receiveShadow>
        <boxGeometry args={[3.5, 3.35, 0.15]} />
        <meshStandardMaterial color="#1a332f" roughness={0.75} />
      </mesh>
      {bars.map((offset) => (
        <group key={`jali-${offset}`} position={[0, 0, 0.11]}>
          <mesh position={[offset * 0.34, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.05, 4.6, 0.06]} />
            <meshStandardMaterial color={GOLD} metalness={0.58} roughness={0.35} />
          </mesh>
          <mesh position={[offset * 0.34, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.05, 4.6, 0.06]} />
            <meshStandardMaterial color={GOLD} metalness={0.58} roughness={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Drape({ position, flip = false, reducedMotion }) {
  const drape = useRef()

  useFrame((state) => {
    if (!drape.current || reducedMotion) return
    drape.current.rotation.z = (flip ? -1 : 1) * (0.09 + Math.sin(state.clock.elapsedTime * 0.7) * 0.025)
    drape.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.5 + (flip ? 2 : 0)) * 0.08
  })

  return (
    <Float speed={reducedMotion ? 0 : 0.8} rotationIntensity={reducedMotion ? 0 : 0.06} floatIntensity={reducedMotion ? 0 : 0.12}>
      <mesh ref={drape} position={position} rotation={[0, flip ? -0.15 : 0.15, flip ? -0.1 : 0.1]} castShadow>
        <planeGeometry args={[1.35, 5.6, 16, 32]} />
        <meshPhysicalMaterial
          color={MAROON}
          roughness={0.42}
          metalness={0.05}
          sheen={1}
          sheenColor="#e7a3b4"
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  )
}

function Diya({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.28, 0.12, 24]} />
        <meshStandardMaterial color="#9b4b21" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.09, 18, 18]} />
        <meshBasicMaterial color="#ffd87c" toneMapped={false} />
      </mesh>
    </group>
  )
}

function CelebrationBurst({ signal }) {
  const count = 180
  const pointsRef = useRef()
  const active = useRef(false)
  const age = useRef(0)
  const velocities = useRef(Array.from({ length: count }, () => new THREE.Vector3()))
  const positions = useMemo(() => new Float32Array(count * 3), [])

  useEffect(() => {
    if (!signal || !pointsRef.current) return

    age.current = 0
    active.current = true
    pointsRef.current.visible = true

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 0.6
      positions[i * 3 + 1] = 0.2 + Math.random() * 0.35
      positions[i * 3 + 2] = -0.8 + (Math.random() - 0.5) * 0.4

      const angle = Math.random() * Math.PI * 2
      const speed = 1.8 + Math.random() * 3.8
      velocities.current[i].set(
        Math.cos(angle) * speed,
        1.4 + Math.random() * 4.2,
        Math.sin(angle) * speed,
      )
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  }, [positions, signal])

  useFrame((_, delta) => {
    if (!active.current || !pointsRef.current) return
    age.current += delta

    for (let i = 0; i < count; i += 1) {
      const velocity = velocities.current[i]
      velocity.y -= 3.7 * delta
      positions[i * 3] += velocity.x * delta
      positions[i * 3 + 1] += velocity.y * delta
      positions[i * 3 + 2] += velocity.z * delta
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.material.opacity = Math.max(0, 1 - age.current / 2.2)

    if (age.current > 2.2) {
      active.current = false
      pointsRef.current.visible = false
    }
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} visible={false} frustumCulled={false}>
      <PointMaterial transparent color="#ffd977" size={0.095} sizeAttenuation depthWrite={false} opacity={1} />
    </Points>
  )
}

export default function PalaceCourtyard3D({ celebrationSignal, reducedMotion }) {
  const palace = useRef()
  const water = useRef()
  const { viewport } = useThree()
  const scale = Math.min(1.08, Math.max(0.72, viewport.width / 12))

  const diyaPositions = useMemo(
    () => [
      [-3.8, 0.18, 1.4],
      [3.8, 0.18, 1.4],
      [-3.3, 0.18, -1.2],
      [3.3, 0.18, -1.2],
      [-2.7, 0.18, -4.4],
      [2.7, 0.18, -4.4],
      [-1.25, 0.18, -6.3],
      [1.25, 0.18, -6.3],
    ],
    [],
  )

  useFrame((state) => {
    if (!water.current || reducedMotion) return
    water.current.material.emissiveIntensity = 0.08 + Math.sin(state.clock.elapsedTime * 1.2) * 0.025
  })

  return (
    <group ref={palace} scale={scale} position={[0, -1.25, -2.2]}>
      <mesh receiveShadow position={[0, -0.06, -2.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#b8ad98" roughness={0.72} metalness={0.05} />
      </mesh>

      <mesh ref={water} receiveShadow position={[0, 0.015, -2.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.6, 12, 32, 32]} />
        <meshStandardMaterial
          color="#153d3b"
          emissive="#0c2c2b"
          emissiveIntensity={0.08}
          roughness={0.12}
          metalness={0.72}
          transparent
          opacity={0.88}
        />
      </mesh>

      <mesh position={[0, 0.035, -2.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.76, 64]} />
        <meshBasicMaterial color="#d4b35e" transparent opacity={0.45} />
      </mesh>

      <Archway position={[0, 0, -7.2]} scale={1.18} />
      <Archway position={[-5.15, 0, -3.6]} scale={0.78} />
      <Archway position={[5.15, 0, -3.6]} scale={0.78} />
      <Archway position={[-5.15, 0, 0.1]} scale={0.78} />
      <Archway position={[5.15, 0, 0.1]} scale={0.78} />

      <mesh castShadow receiveShadow position={[0, 3.1, -8.05]}>
        <boxGeometry args={[10.7, 6.2, 0.8]} />
        <meshStandardMaterial color={EMERALD} roughness={0.68} />
      </mesh>
      <mesh castShadow position={[0, 6.4, -8.05]}>
        <sphereGeometry args={[2.3, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#17483f" roughness={0.55} metalness={0.12} />
      </mesh>
      <mesh position={[0, 8.55, -8.05]}>
        <coneGeometry args={[0.12, 1.25, 20]} />
        <meshStandardMaterial color={GOLD} metalness={0.78} roughness={0.25} />
      </mesh>

      <JaliPanel position={[-3.6, 3.0, -7.56]} />
      <JaliPanel position={[3.6, 3.0, -7.56]} />

      <Drape position={[-4.6, 3.25, -1.2]} reducedMotion={reducedMotion} />
      <Drape position={[4.6, 3.25, -1.2]} flip reducedMotion={reducedMotion} />

      {diyaPositions.map((position, index) => (
        <Diya key={position.join('-')} position={position} scale={index > 5 ? 0.8 : 1} />
      ))}

      <pointLight position={[-3.8, 1.1, 0.8]} color="#ffb34f" intensity={18} distance={7} decay={2} />
      <pointLight position={[3.8, 1.1, 0.8]} color="#ffb34f" intensity={18} distance={7} decay={2} />
      <pointLight position={[0, 4.2, -6.5]} color="#e9c779" intensity={22} distance={12} decay={2} />

      <CelebrationBurst signal={celebrationSignal} />
    </group>
  )
}
