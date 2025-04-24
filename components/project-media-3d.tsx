'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree, OrbitControls, useGLTF, THREE, ensureComponent, isThreeAvailable, Canvas } from '@/lib/three-imports';
import type { RootState } from '@/lib/three-imports';
import { useMediaQuery } from '@/hooks/use-media-query';

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
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = getLuminance(r, g, b);
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function ProjectMedia3D({ modelUrl, color }: ProjectMedia3DProps) {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contrastingColor = getContrastingColor(color);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted || !isThreeAvailable() || !useGLTF || !useThree || !useFrame || !ensureComponent(OrbitControls)) {
    return (
      <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center">
        <div className="px-4 py-2 rounded-md bg-background/80 backdrop-blur-sm border border-border/50">
          <span className="text-sm text-foreground">Loading 3D viewer...</span>
        </div>
      </div>
    );
  }
  
  if (!modelUrl) {
    return (
      <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center text-muted-foreground">
        No 3D model available
      </div>
    );
  }
  
  return (
    <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] rounded-2xl overflow-hidden">
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
          height: '100%',
          cursor: isMobile ? 'default' : 'grab',
          touchAction: isMobile ? 'none' : 'auto'
        }}
        onPointerDown={() => {
          if (!isMobile) {
            document.body.style.cursor = 'grabbing';
          }
        }}
        onPointerUp={() => {
          if (!isMobile) {
            document.body.style.cursor = 'grab';
          }
        }}
        onPointerLeave={() => {
          if (!isMobile) {
            document.body.style.cursor = 'default';
          }
        }}
      >
        <color attach="background" args={[contrastingColor]} />
        <ambientLight intensity={2} />
        <pointLight position={[10, 20, 10]} />
        <directionalLight position={[0, 90, 100]} /> 
        <ProjectMedia3DInner modelUrl={modelUrl} color={color} onError={setError} isMobile={isMobile} />
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

function ProjectMedia3DInner({ modelUrl, color, onError, isMobile }: { 
  modelUrl: string; 
  color: string; 
  onError: (error: string) => void;
  isMobile: boolean;
}) {
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
        const size = box.getSize(new THREE.Vector3());
        
        // Calculate the scale to fit the model in the view
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 10 / maxDim;
        
      modelRef.current.position.sub(center);
        modelRef.current.scale.set(scale, scale, scale);
      
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
        enableZoom={!isMobile}
        enablePan={!isMobile}
        enableRotate={!isMobile}
        autoRotate
        autoRotateSpeed={0.5}
        minDistance={5}
        maxDistance={20}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
      />
      <primitive
        ref={modelRef}
        object={scene}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
    </>
  );
} 