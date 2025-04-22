'use client';

// Import React first to ensure it's initialized before other dependencies
import * as React from 'react';
import type { RootState } from '@react-three/fiber';

// Import and re-export Three.js and related modules
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls,
  useGLTF,
  Float,
  Points,
  Point,
  PerspectiveCamera 
} from '@react-three/drei';

// Export types
export type { RootState };

// Export Three.js
export { THREE };

// Export React Three Fiber components and hooks
export { Canvas, useFrame, useThree };

// Export Drei components
export { 
  OrbitControls,
  useGLTF,
  Float,
  Points,
  Point,
  PerspectiveCamera 
};

// Utility functions
export function isThreeAvailable(): boolean {
  return typeof window !== 'undefined' && typeof THREE !== 'undefined';
}

export function isComponentAvailable(component: string): boolean {
  return typeof window !== 'undefined' && component in THREE;
}

export function ensureComponent<T>(component: T | null | undefined): component is T {
  return component !== null && component !== undefined;
}
