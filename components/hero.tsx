import { Logo3D } from '@/components/logo3d';

export default function Hero() {
  return (
    <div className="relative w-full h-full">
      {/* Background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90" />
      
      {/* 3D Logo container */}
      <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
        <Logo3D />
      </div>
    </div>
  );
}
