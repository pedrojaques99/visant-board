'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree, OrbitControls, useGLTF, THREE, ensureComponent, isThreeAvailable, Canvas } from '@/lib/three-imports';
import type { RootState } from '@/lib/three-imports';

interface ProjectMedia3DProps {
  modelUrl: string;
  color: string;
}

// Type guard for THREE.Mesh
function isMesh(obj: any): obj is THREE.Mesh {
  return THREE && obj instanceof THREE.Mesh;
}

// Helper function to calculate luminance
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Helper function to get contrasting color
function getContrastingColor(hexColor: string): string {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate luminance
  const luminance = getLuminance(r, g, b);
  
  // Return dark or light color based on luminance
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function ProjectMedia3D({ modelUrl, color }: ProjectMedia3DProps) {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contrastingColor = getContrastingColor(color);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Don't render on server or if THREE is not available
  if (!mounted || !isThreeAvailable() || !useGLTF || !useThree || !useFrame || !ensureComponent(OrbitControls)) {
    return null;
  }

  // Check if modelUrl is valid
  if (!modelUrl) {
    return <div className="w-full h-full flex items-center justify-center text-muted-foreground">No 3D model available</div>;
  }

  // Log the model URL for debugging
  console.log('3D Model URL:', modelUrl);
  
  // Now we know THREE is available, so render the component
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden">
      <Canvas
        camera={{
          position: [0, 0, 20],
          fov: 45,
          near: 0.1,
          far: 200
        }}
        style={{
          background: contrastingColor,
          width: '100%',
          height: '100%'
        }}
      >
        <color attach="background" args={[contrastingColor]} />
        <ambientLight intensity={2} />
        <pointLight position={[10, 20, 10]} />
        <directionalLight position={[0, 90, 100]} /> 
        <ProjectMedia3DInner modelUrl={modelUrl} color={color} onError={setError} />
        {error && (
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="red" />
          </mesh>
        )}
      </Canvas>
    </div>
  );
}

function ProjectMedia3DInner({ modelUrl, color, onError }: { modelUrl: string; color: string; onError: (error: string) => void }) {
  const { scene } = useGLTF(modelUrl, true);
  const { gl } = useThree();
  const modelRef = useRef<THREE.Group>();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    try {
      if (!scene) {
        throw new Error('Failed to load 3D model');
      }
      console.log('3D Model loaded successfully:', scene);
    } catch (error) {
      console.error('Error loading 3D model:', error);
      onError('Failed to load 3D model');
    }
  }, [scene, onError]);

  useEffect(() => {
    if (modelRef.current) {
      try {
        // Center the model
        const box = new THREE.Box3().setFromObject(modelRef.current);
        const center = box.getCenter(new THREE.Vector3());
        modelRef.current.position.sub(center);
        
        // Apply metallic material to all meshes
        modelRef.current.traverse((child: any) => {
          if (isMesh(child)) {
            const material = new THREE.MeshStandardMaterial({
              color: color,
              metalness: 0.9,
              roughness: 0.2,
              envMapIntensity: 1.0
            });
            child.material = material;
            child.material.needsUpdate = true;
          }
        });
      } catch (error) {
        console.error('Error processing 3D model:', error);
        onError('Error processing 3D model');
      }
    }
  }, [scene, color, onError]);

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
      <OrbitControls 
        enableZoom={true}
        minDistance={5}
        maxDistance={20}
        enablePan={true}
      />
      <primitive
        ref={modelRef}
        object={scene}
        scale={10}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
    </>
  );
} 