'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree, Float, Points, Point, useGLTF, THREE, ensureComponent, isThreeAvailable } from '@/lib/three-imports';
import type { RootState } from '@/lib/three-imports';

// Type guard for THREE.Mesh
function isMesh(obj: any): obj is THREE.Mesh {
  return THREE && obj instanceof THREE.Mesh;
}

// Type guard for THREE.Points 
function isPoints(obj: any): obj is THREE.Points {
  return THREE && obj instanceof THREE.Points;
}

// Add prop types
interface ModelProps {
  modelUrl: string;
  color?: string;
  scale?: number;
}

// Only export components when THREE is available
export function ActualMobileModel({ modelUrl, color = '#52ddeb', scale = 12 }: ModelProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Don't render on server or if THREE is not available
  if (!mounted || !isThreeAvailable() || !useGLTF || !useFrame) {
    return null;
  }
  
  // Now we know THREE is available, so render the component
  return <ActualMobileModelInner modelUrl={modelUrl} color={color} scale={scale} />;
}

function ActualMobileModelInner({ modelUrl, color, scale }: ModelProps) {
  const { scene } = useGLTF(modelUrl);
  const modelRef = useRef<THREE.Group>();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (modelRef.current) {
      // Center the model
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = box.getCenter(new THREE.Vector3());
      modelRef.current.position.sub(center);
      
      // Apply minimal wireframe only to main meshes with reduced complexity
      modelRef.current.traverse((child: any) => {
        if (isMesh(child)) {
          // Reduce geometry complexity for mobile
          const geometry = child.geometry;
          if (geometry.attributes.position.count > 100) {
            const decimatedGeometry = geometry.clone();
            // Reduce vertex count by ~50%
            const positions = geometry.attributes.position.array;
            const newPositions = new Float32Array(positions.length / 2);
            for (let i = 0; i < positions.length; i += 6) {
              newPositions[i/2] = positions[i];
              newPositions[i/2 + 1] = positions[i + 1];
              newPositions[i/2 + 2] = positions[i + 2];
            }
            decimatedGeometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
            child.geometry = decimatedGeometry;
          }
          child.material = new THREE.MeshBasicMaterial({
            color,
            wireframe: true,
            opacity: 0.5,
            transparent: true,
          });
        }
      });
    }
  }, [scene]);

  useFrame((state: RootState, delta: number) => {
    if (modelRef.current && !hovered) {
      modelRef.current.rotation.y += delta * 0.1; // Reduced rotation speed
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={scale}
      position={[0, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  );
}

export function ActualModel({ modelUrl, color = '#52ddeb', scale = 13.5 }: ModelProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Don't render on server or if THREE is not available
  if (!mounted || !isThreeAvailable() || !useGLTF || !useThree || !useFrame || !ensureComponent(Float)) {
    return null;
  }
  
  // Now we know THREE is available, so render the component
  return <ActualModelInner modelUrl={modelUrl} color={color} scale={scale} />;
}

function ActualModelInner({ modelUrl, color, scale }: ModelProps) {
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
            color,
            wireframe: true,
            opacity: 0.5,
            transparent: true,
          });
        }
      });
    }
  }, [scene]);

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
    <Float
      speed={1}
      rotationIntensity={0.8}
      floatIntensity={0.6}
    >
      <primitive
        ref={modelRef}
        object={scene}
        scale={scale}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
    </Float>
  );
}

export function ActualMobileParticles() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Don't render on server or if THREE is not available
  if (!mounted || !isThreeAvailable() || !useFrame) {
    return null;
  }
  
  // Now we know THREE is available, so render the component
  return <ActualMobileParticlesInner />;
}

function ActualMobileParticlesInner() {
  const count = 20; // Reduced number of particles for mobile
  const particlesRef = useRef<THREE.Points>(null);
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 8;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  });

  useFrame((state: RootState) => {
    if (particlesRef.current && state.clock) {
      particlesRef.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        transparent
        opacity={0.3}
        color="#666666"
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export function ActualParticles() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Don't render on server or if THREE is not available
  if (!mounted || !isThreeAvailable() || !useFrame) {
    return null;
  }
  
  // Now we know THREE is available, so render the component
  return <ActualParticlesInner />;
}

function ActualParticlesInner() {
  const count = 50;
  const particlesRef = useRef<THREE.Points>(null);
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 8;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  });

  useFrame((state: RootState) => {
    if (particlesRef.current && state.clock) {
      particlesRef.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        transparent
        opacity={0.4}
        color="#666666"
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
} 