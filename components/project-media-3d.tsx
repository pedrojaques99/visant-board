'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, OrbitControls, Float, useProgress, Html, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Group } from 'three';

interface ProjectMedia3DProps {
  svgUrl: string;
  color?: string;
  extrudeDepth?: number;
}

interface SVGModelProps {
  svgUrl: string;
  color?: string;
  extrudeDepth?: number;
}

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

function SVGModel({ svgUrl, color = '#52ddeb', extrudeDepth = 4 }: SVGModelProps) {
  const groupRef = useRef<Group>(new Group());
  const [hovered, setHovered] = useState(false);
  const { scene } = useThree();
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const loader = new SVGLoader();
    
    loader.load(svgUrl, (data) => {
      const paths = data.paths;
      const group = new THREE.Group();

      paths.forEach((path) => {
        const shapes = path.toShapes(true);
        
        shapes.forEach((shape) => {
          const extrudeSettings = {
            steps: 1,
            depth: extrudeDepth,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.2,
            bevelSegments: 1
          };

          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          
          const material = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true,
            opacity: 0.6,
            transparent: true,
          });

          const mesh = new THREE.Mesh(geometry, material);
          group.add(mesh);
        });
      });

      // Center the model
      const box = new THREE.Box3().setFromObject(group);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      group.position.sub(center);
      
      // Scale to fit
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 10 / maxDim;
      group.scale.multiplyScalar(scale);

      if (groupRef.current) {
        // Remove old content
        while (groupRef.current.children.length > 0) {
          groupRef.current.remove(groupRef.current.children[0]);
        }
        // Add new content
        groupRef.current.add(group);
      }
    });

    return () => {
      if (groupRef.current) {
        groupRef.current.clear();
      }
    };
  }, [svgUrl, color, extrudeDepth]);

  useFrame((state, delta) => {
    if (groupRef.current && !hovered) {
      groupRef.current.rotation.y += delta * (isMobile ? 0.1 : 0.15);
    }
  });

  return (
    <Float
      speed={1}
      rotationIntensity={0.6}
      floatIntensity={0.6}
      enabled={!hovered}
    >
      <primitive
        object={groupRef.current}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
    </Float>
  );
}

export function ProjectMedia3D({ svgUrl, color, extrudeDepth }: ProjectMedia3DProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isPerformant, setIsPerformant] = useState(true);

  useEffect(() => {
    checkPerformance();
  }, []);

  const checkPerformance = () => {
    if (isMobile) {
      // @ts-ignore - deviceMemory is not in TypeScript types yet
      if ((navigator.deviceMemory && navigator.deviceMemory < 4) ||
          (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)) {
        setIsPerformant(false);
        return;
      }
      
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      if (!gl) {
        setIsPerformant(false);
        return;
      }
      
      const maxTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
      if (maxTextureUnits < 8) {
        setIsPerformant(false);
        return;
      }
    }
  };

  return (
    <div className="w-full aspect-square rounded-lg overflow-hidden bg-background/5 backdrop-blur-sm">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 50 }}
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
            minDistance={10}
            maxDistance={30}
            touches={{
              ONE: isMobile ? undefined : THREE.TOUCH.ROTATE,
              TWO: isMobile ? THREE.TOUCH.ROTATE : THREE.TOUCH.DOLLY_ROTATE
            }}
          />
          {isPerformant && (
            <SVGModel 
              svgUrl={svgUrl} 
              color={color} 
              extrudeDepth={extrudeDepth} 
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
} 