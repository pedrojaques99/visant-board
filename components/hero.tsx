import { Logo3D } from '@/components/logo3d';

export default function Hero() {
  return (
    <div className="relative w-full h-full">
      {/* Background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background pointer-events-none" />
      
      {/* 3D Logo container with interaction hints */}
      <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing [&:hover]:cursor-[url('data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;32&quot; height=&quot;32&quot; viewport=&quot;0 0 32 32&quot; style=&quot;fill:black;font-size:24px&quot;><circle cx=&quot;16&quot; cy=&quot;16&quot; r=&quot;8&quot; fill=&quot;%2352ddeb&quot; filter=&quot;url(%23glow)&quot;/><defs><filter id=&quot;glow&quot;><feGaussianBlur stdDeviation=&quot;2&quot; result=&quot;coloredBlur&quot;/><feMerge><feMergeNode in=&quot;coloredBlur&quot;/><feMergeNode in=&quot;SourceGraphic&quot;/></feMerge></filter></defs></svg>')_16_16,_grab]">
        <Logo3D />
        
        {/* Mouse interaction hints */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="px-6 py-3 rounded-full bg-background/80 backdrop-blur-sm border border-border/50">
            <p className="text-sm text-muted-foreground">
              Click and drag to rotate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
