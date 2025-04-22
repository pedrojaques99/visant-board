'use client';

import { Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { useI18n } from '@/context/i18n-context';
import { t } from '@/utils/translations';
import * as THREE from 'three';

interface Logo3DProps {
  isMobile: boolean;
}

function Stars() {
  const count = 200;
  const mesh = useRef<THREE.Points>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const sizes = useRef(new Float32Array(count));
  
  // Generate random positions for stars
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 15 + Math.random() * 5; // Stars between 15-20 units away
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Initialize sizes
      sizes.current[i] = 0.2;
    }
    return positions;
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse position to normalized device coordinates
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.05;
      
      // Update particle sizes based on distance from cursor
      const positions = mesh.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const x = positions[i * 3];
        const y = positions[i * 3 + 1];
        
        // Calculate distance from cursor in normalized device coordinates
        const dx = x - mousePosition.current.x;
        const dy = y - mousePosition.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Smoothly transition size based on distance
        const targetSize = distance < 0.3 ? 0.4 : 0.2;
        sizes.current[i] += (targetSize - sizes.current[i]) * 0.1;
      }
      
      // Update the geometry
      mesh.current.geometry.attributes.size.needsUpdate = true;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes.current}
          itemSize={1}
          args={[sizes.current, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        color="#52ddeb"
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        vertexColors={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>();

  // Apply wireframe material to all meshes
  if (scene) {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshBasicMaterial({
          color: '#52ddeb',
          wireframe: true,
          opacity: 0.5,
          transparent: true,
        });
      }
    });
  }

  return <primitive ref={modelRef} object={scene} scale={12} />;
}

export default function Logo3D({ isMobile }: Logo3DProps) {
  const modelUrl = '/models/visant-3d-simple-2.glb';
  const { messages } = useI18n();

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{
          position: [0, 0, 20],
          fov: 45,
          near: 0.1,
          far: 200
        }}
        style={{
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
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Stars />
          <Model url={modelUrl} />
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
        </Suspense>
      </Canvas>
    </div>
  );
}