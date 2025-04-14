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

  useEffect(() => {
    if (modelRef.current) {
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = box.getCenter(new THREE.Vector3());
      modelRef.current.position.sub(center);
      
      // Set wireframe for all materials
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.wireframe = true;
          child.material.transparent = true;
          child.material.opacity = 0.1;
          child.material.color.set('#52ddeb'); // Cor do wireframe
        }
      });
    }
  }, [gltf]);

  useFrame((state, delta) => {
    if (modelRef.current && !hovered) {
      modelRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Float
      speed={1}
      rotationIntensity={0.6}
      floatIntensity={0.6}
    >
      <primitive
        ref={modelRef}
        object={gltf.scene}
        scale={4.5}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        position={[0, 0, 0]}
      />
    </Float>
  );
}

export function Logo3D() {
  return (
    <div className="absolute inset-0">
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
        dpr={[1, 2]}
      >
        <Suspense fallback={<Loader />}>
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

          <Model />

          <Environment preset="city" />
          
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            minDistance={5}
            maxDistance={15}
            rotateSpeed={0.5}
            dampingFactor={0.1}
            enableDamping={true}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}