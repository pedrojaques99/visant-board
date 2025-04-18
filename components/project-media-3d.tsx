'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';

interface ProjectMedia3DProps {
  modelUrl: string;
  color?: string;
}

function Loader() {
  const { messages } = useI18n();
  return (
    <Html center>
      <div className="px-4 py-2 rounded-md bg-background/80 backdrop-blur-sm">
        <span className="text-sm text-foreground">{t(messages, 'common.loading', 'Loading...')}</span>
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
            transparent: true,
            opacity: 0.9,
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
      scale={isMobile ? 10 : 6}
      position={[0, 1, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  );
}

export function ProjectMedia3D({ modelUrl, color }: ProjectMedia3DProps) {
  if (!modelUrl) return null;

  // Simple check to prevent loading non-GLB files
  if (!modelUrl.toLowerCase().endsWith('.glb')) {
    console.warn('Invalid model URL. Only GLB files are supported.');
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto aspect-[4/3] rounded-lg overflow-hidden bg-background/5 backdrop-blur-sm">
      <Canvas
        camera={{ position: [0, 0, 25], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.8} />
          <pointLight position={[15, 15, 15]} intensity={1.5} />
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
          />
          <GLBModel url={modelUrl} color={color} />
        </Suspense>
      </Canvas>
    </div>
  );
} 