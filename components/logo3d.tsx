'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Environment, OrbitControls, Float, useProgress, Html, PerspectiveCamera, Points, Point } from '@react-three/drei';
import * as THREE from 'three';
import { useMediaQuery } from '@/hooks/use-media-query';

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

function MobileModel() {
  const gltf = useLoader(GLTFLoader, '/models/visant-3d-simple-2.glb');
  const modelRef = useRef<THREE.Group>();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (modelRef.current) {
      // Center the model
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = box.getCenter(new THREE.Vector3());
      modelRef.current.position.sub(center);
      // Apply minimal wireframe only to main meshes with reduced complexity
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
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
            color: '#52ddeb',
            wireframe: true,
            opacity: 0.5,
            transparent: true,
          });
        }
      });
    }
  }, [gltf]);

  useFrame((state, delta) => {
    if (modelRef.current && !hovered) {
      modelRef.current.rotation.y += delta * 0.1; // Reduced rotation speed
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      scale={8}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      position={[0, 0, 0]}
    />
  );
}

function Model() {
  const gltf = useLoader(GLTFLoader, '/models/visant-3d-simple-2.glb');
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
      modelRef.current.traverse((child) => {
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
  }, [gltf]);

  useEffect(() => {
    if (gl) {
      gl.outputColorSpace = THREE.SRGBColorSpace;
    }
  }, [gl]);

  useFrame((state, delta) => {
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
        object={gltf.scene}
        scale={10}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        position={[0, -2, 0]}
      />
    </Float>
  );
}

function MobileParticles() {
  const count = 20; // Reduced number of particles for mobile
  const positions = useRef<number[]>([]);

  useEffect(() => {
    positions.current = [];
    for (let i = 0; i < count; i++) {
      const radius = 8;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions.current.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
    }
  }, []);

  useFrame((state) => {
    if (state.clock) {
      const time = state.clock.getElapsedTime() * 0.05; // Reduced animation speed
      state.scene.traverse((child) => {
        if (child instanceof THREE.Points) {
          child.rotation.y = time * 0.05;
        }
      });
    }
  });

  return (
    <Points limit={count}>
      <pointsMaterial
        size={0.15}
        transparent
        opacity={0.3}
        color="#666666"
        sizeAttenuation
        depthWrite={false}
      />
      {positions.current.map((_, i) => (
        i % 3 === 0 && (
          <Point
            key={i}
            position={[
              positions.current[i],
              positions.current[i + 1],
              positions.current[i + 2]
            ]}
          />
        )
      ))}
    </Points>
  );
}

function Particles() {
  const count = 50;
  const positions = useRef<number[]>([]);

  useEffect(() => {
    positions.current = [];
    for (let i = 0; i < count; i++) {
      const radius = 8;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions.current.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
    }
  }, []);

  useFrame((state) => {
    if (state.clock) {
      const time = state.clock.getElapsedTime() * 0.1;
      state.scene.traverse((child) => {
        if (child instanceof THREE.Points) {
          child.rotation.y = time * 0.05;
        }
      });
    }
  });

  return (
    <Points limit={count}>
      <pointsMaterial
        size={0.15}
        transparent
        opacity={0.4}
        color="#666666"
        sizeAttenuation
        depthWrite={false}
      />
      {positions.current.map((_, i) => (
        i % 3 === 0 && (
          <Point
            key={i}
            position={[
              positions.current[i],
              positions.current[i + 1],
              positions.current[i + 2]
            ]}
          />
        )
      ))}
    </Points>
  );
}

export function Logo3D() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isPerformant, setIsPerformant] = useState(true);

  useEffect(() => {
    checkPerformance();
  }, []);

  const checkPerformance = () => {
    // Check if device can handle 3D well
    if (isMobile) {
      // Check if device has enough memory and cores
      if (
        // @ts-ignore - navigator.deviceMemory is not in TypeScript types
        (navigator.deviceMemory && navigator.deviceMemory < 4) ||
        // @ts-ignore - navigator.hardwareConcurrency is not in TypeScript types
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)
      ) {
        setIsPerformant(false);
        return;
      }
      
      // Test WebGL capabilities
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      if (!gl) {
        setIsPerformant(false);
        return;
      }
      
      // Check if device supports enough texture units
      const maxTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
      if (maxTextureUnits < 8) {
        setIsPerformant(false);
        return;
      }
    }
  };

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 0], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={<Loader />}>
          <OrbitControls
            enablePan={false}
            enableZoom={!isMobile}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.5}
            rotateSpeed={0.5}
            enableDamping
            dampingFactor={0.05}
            minDistance={0.5}
            maxDistance={20}
            touches={{
              ONE: isMobile ? undefined : THREE.TOUCH.ROTATE,
              TWO: isMobile ? THREE.TOUCH.ROTATE : THREE.TOUCH.DOLLY_ROTATE
            }}
          />
          {isPerformant ? (
            <>
              {isMobile ? <MobileModel /> : <Model />}
              {isMobile ? <MobileParticles /> : <Particles />}
            </>
          ) : (
            <MobileModel />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}