import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export default function ProductModel() {
  const group = useRef();
  const lidRef = useRef();
  const orbitRef = useRef();

  useFrame((state, delta) => {
    // Smooth cinematic rotation of the whole jar
    group.current.rotation.y += delta * 0.05;
    
    // Orbital rotation for sparkles
    if (orbitRef.current) {
      orbitRef.current.rotation.y -= delta * 0.15;
      orbitRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
    
    // Tilt based on mouse position
    const targetX = (state.mouse.x * Math.PI) / 8;
    const targetY = (state.mouse.y * Math.PI) / 8;
    
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -targetY, 0.05);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -targetX * 0.5, 0.05);

    // Lid floating animation independent of the base (breathing effect)
    lidRef.current.position.y = 1.9 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    lidRef.current.rotation.x = -0.3 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    lidRef.current.rotation.z = 0.2 + Math.cos(state.clock.elapsedTime * 1.2) * 0.05;
  });

  return (
    <Float
      speed={1.5} // Slow cinematic breathing
      rotationIntensity={0.2}
      floatIntensity={1.2}
      floatingRange={[-0.15, 0.15]}
    >
      <group ref={group} dispose={null} position={[0, -0.5, 0]}>
        
        {/* Main Jar Body */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.5, 1.5, 2, 64]} />
          <meshPhysicalMaterial 
            color="#0c2b85"
            metalness={0.4}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transmission={0.1}
            ior={1.5}
            thickness={0.5}
          />
        </mesh>

        {/* Jar Label (White band) */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.51, 1.51, 1, 64]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Soap Inside */}
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[1.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial 
            color="#1e3a8a"
            metalness={0.1}
            roughness={0.6}
            clearcoat={0.5}
          />
        </mesh>

        {/* Floating Lid Group */}
        <group ref={lidRef} position={[1, 1.9, 1]} rotation={[-0.3, 0, 0.2]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.55, 1.55, 0.3, 64]} />
            <meshStandardMaterial 
              color="#f8fafc" 
              metalness={0.3}
              roughness={0.1}
            />
          </mesh>
          {/* Inner Lid (dark part) */}
          <mesh position={[0, -0.15, 0]} castShadow>
            <cylinderGeometry args={[1.45, 1.45, 0.05, 64]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
          </mesh>
        </group>

        {/* Orbiting Sparkles */}
        <group ref={orbitRef}>
          <Sparkles count={80} scale={6} size={2.5} speed={0.4} opacity={0.6} color="#3b82f6" />
          <Sparkles count={40} scale={4} size={5} speed={0.2} opacity={0.9} color="#93c5fd" />
          <Sparkles count={20} scale={7} size={8} speed={0.1} opacity={0.4} color="#60a5fa" />
        </group>
      </group>
    </Float>
  );
}
