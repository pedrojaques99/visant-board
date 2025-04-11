'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Environment, OrbitControls, Float, useProgress, Html, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="px-4 py-2 rounded-md bg-background/80 backdrop-blur-sm border border-border/50">
        <span className="text-sm text-foreground">Loading {progress.toFixed(0)}%</span>
      </div>
    </Html>
  );
}

function Model() {
  const gltf = useLoader(GLTFLoader, '/models/visant 3d gradient 2.glb');
  const modelRef = useRef<THREE.Group>();
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();

  useEffect(() => {
    if (modelRef.current) {
      // Center the model
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = box.getCenter(new THREE.Vector3());
      modelRef.current.position.sub(center);
    }
  }, [gltf]);

  // Smooth rotation and interaction
  useFrame((state, delta) => {
    if (modelRef.current) {
      if (!hovered) {
        // Gentle continuous rotation when not interacting
        modelRef.current.rotation.y += delta * 0.15;
      }
      
      // Smooth camera movement
      if (hovered) {
        camera.position.lerp(new THREE.Vector3(0, 0, 8), 0.1);
      } else {
        camera.position.lerp(new THREE.Vector3(0, 0, 10), 0.1);
      }
    }
  });

  return (
    <Float
      speed={1} // Animation speed
      rotationIntensity={0.6} // Rotation intensity
      floatIntensity={0.6} // Float intensity
    >
      <primitive
        ref={modelRef}
        object={gltf.scene}
        scale={4.5} // Adjusted scale
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        position={[0, 0, 0]}
      />
    </Float>
  );
}

export function Logo3D() {
  return (
    <div className="absolute inset-0 -z-10 opacity-40">
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputEncoding: THREE.sRGBEncoding,
          alpha: true
        }}
        dpr={[1, 2]} // Responsive pixel ratio
      >
        <Suspense fallback={<Loader />}>
          {/* Enhanced lighting setup */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
          />
          <directionalLight
            position={[-10, -10, -5]}
            intensity={0.5}
          />
          <pointLight position={[0, 0, 5]} intensity={0.5} />

          {/* Model */}
          <Model />

          {/* Environment and effects */}
          <Environment preset="city" />
          
          {/* Enhanced controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={6}
            maxDistance={15}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            dampingFactor={0.1}
            enableDamping={true}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}