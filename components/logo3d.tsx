'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Environment, OrbitControls, Float, useProgress, Html } from '@react-three/drei';
import * as THREE from 'three';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <span className="text-foreground">{progress.toFixed(0)}%</span>
    </Html>
  );
}

function Model() {
  const gltf = useLoader(GLTFLoader, '/models/visant 3d gradient.glb');
  const modelRef = useRef<THREE.Group>();
  const [hovered, setHovered] = useState(false);

  // Smooth rotation on mouse move
  useFrame((state, delta) => {
    if (modelRef.current) {
      // Gentle auto-rotation when not hovered
      if (!hovered) {
        modelRef.current.rotation.y += delta * 0.1;
        modelRef.current.rotation.x += delta * 0.1;
      }
      
      // Smooth position lerping
      modelRef.current.position.y = THREE.MathUtils.lerp(
        modelRef.current.position.y,
        hovered ? 0.5 : 0,
        0.9
      );
    }
  });

  return (
    <Float
      speed={0.1} // Animation speed
      rotationIntensity={0.5} // Rotation intensity
      floatIntensity={0.5} // Float intensity
    >
      <primitive
        ref={modelRef}
        object={gltf.scene}
        scale={5} // Adjust scale as needed
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        position={[0, 0, 0]}
      />
    </Float>
  );
}

export function Logo3D() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 95,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputEncoding: THREE.sRGBEncoding,
          alpha: true
        }}
      >
        <Suspense fallback={<Loader />}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={0.5}
            castShadow
          />
          <directionalLight
            position={[-10, -10, -5]}
            intensity={0.5}
          />

          {/* Model */}
          <Model />

          {/* Environment and effects */}
          <Environment preset="night" />
          
          {/* Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={true}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
            rotateSpeed={0.2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}