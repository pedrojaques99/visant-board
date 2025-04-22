'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree, OrbitControls, useGLTF, THREE, ensureComponent, isThreeAvailable } from '@/lib/three-imports';
import type { RootState } from '@/lib/three-imports';

interface ProjectMedia3DProps {
  modelUrl: string;
  color: string;
}

// Type guard for THREE.Mesh
function isMesh(obj: any): obj is THREE.Mesh {
  return THREE && obj instanceof THREE.Mesh;
}

export function ProjectMedia3D({ modelUrl, color }: ProjectMedia3DProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Don't render on server or if THREE is not available
  if (!mounted || !isThreeAvailable() || !useGLTF || !useThree || !useFrame || !ensureComponent(OrbitControls)) {
    return null;
  }
  
  // Now we know THREE is available, so render the component
  return <ProjectMedia3DInner modelUrl={modelUrl} color={color} />;
}

function ProjectMedia3DInner({ modelUrl, color }: ProjectMedia3DProps) {
  const { scene } = useGLTF(modelUrl);
  const { gl } = useThree();
  const modelRef = useRef<THREE.Group>();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (modelRef.current) {
      // Center the model
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = box.getCenter(new THREE.Vector3());
      modelRef.current.position.sub(center);
      
      // Apply minimal wireframe only to main meshes
      modelRef.current.traverse((child: any) => {
        if (isMesh(child)) {
          child.material = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true,
            opacity: 0.5,
            transparent: true,
          });
        }
      });
    }
  }, [scene, color]);

  useEffect(() => {
    if (gl) {
      gl.outputColorSpace = THREE.SRGBColorSpace;
    }
  }, [gl]);

  useFrame((state: RootState, delta: number) => {
    if (modelRef.current && !hovered) {
      modelRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <>
      <OrbitControls enableZoom={false} />
      <primitive
        ref={modelRef}
        object={scene}
        scale={13.5}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
    </>
  );
} 