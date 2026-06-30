import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, MeshReflectorMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import ProductModel from './ProductModel';

export default function Scene() {
  return (
    <div className="w-full h-full absolute inset-0 z-10 pointer-events-none flex justify-center items-center">
      <Canvas 
        camera={{ position: [0, 1.5, 8], fov: 45 }}
        style={{ pointerEvents: 'auto' }}
        gl={{ antialias: false, alpha: false }} // Black background
        dpr={[1, 2]}
      >
        <color attach="background" args={['#020510']} />
        <fog attach="fog" args={['#020510', 5, 20]} />
        
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          
          {/* Key Light */}
          <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={3} castShadow color="#ffffff" />
          
          {/* Fill Light (Blueish) */}
          <spotLight position={[-5, 5, -5]} angle={0.5} penumbra={1} intensity={2} color="#1e3a8a" />
          
          <ProductModel />

          {/* Reflective Floor */}
          <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
              blur={[300, 100]}
              resolution={1024}
              mixBlur={1}
              mixStrength={80}
              roughness={1}
              depthScale={1.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#050505"
              metalness={0.8}
            />
          </mesh>

          <Environment preset="city" />

          <EffectComposer disableNormalPass>
            <Bloom 
              luminanceThreshold={0.2} 
              mipmapBlur 
              intensity={1.5} 
            />
            {/* Soft cinematic depth of field */}
            <DepthOfField target={[0, 0, 0]} focalLength={0.03} bokehScale={3} height={480} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
