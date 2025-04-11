import { Logo3D } from '@/components/logo3d';

export default function Hero() {
  return (
    <div className="relative w-full h-full">
      {/* Background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background pointer-events-none" />
      
      {/* 3D Logo container with interaction hints */}
      <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
        <Logo3D />
        
        {/* Mouse interaction hints */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="px-6 py-3 rounded-full bg-background/80 backdrop-blur-sm border border-border/50">
            <p className="text-sm text-muted-foreground">
              Drag to rotate • Scroll to zoom
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
