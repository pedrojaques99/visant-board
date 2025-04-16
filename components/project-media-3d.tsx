'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useMediaQuery } from '@/hooks/use-media-query';

interface ProjectMedia3DProps {
  modelUrl: string;
  color?: string;
}

function Loader() {
  return (
    <Html center>
      <div className="px-4 py-2 rounded-md bg-background/80 backdrop-blur-sm">
        <span className="text-sm text-foreground">Loading...</span>
      </div>
    </Html>
  );
}

function GLBModel({ url, color = '#52ddeb' }: { url: string; color?: string }) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { scene } = useGLTF(url);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true,
            transparent: true,
            opacity: 0.6,
          });
        }
      });
    }
  }, [scene, color]);

  useFrame((state, delta) => {
    if (meshRef.current && !hovered) {
      meshRef.current.rotation.y += delta * (isMobile ? 0.2 : 0.3);
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={scene}
      scale={2}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  );
}

export function ProjectMedia3D({ modelUrl, color }: ProjectMedia3DProps) {
  if (!modelUrl) return null;

  return (
    <div className="w-full aspect-[21/9] rounded-lg overflow-hidden bg-background/5 backdrop-blur-sm">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <GLBModel url={modelUrl} color={color} />
        </Suspense>
      </Canvas>
    </div>
  );
} 