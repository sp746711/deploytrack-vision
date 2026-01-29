import { cn } from "@/lib/utils";
import { CSSProperties, ReactNode, useRef, useState } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover3D?: boolean;
  glow?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export function GlassCard({ 
  children, 
  className, 
  hover3D = false,
  glow = false,
  onClick,
  style
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover3D || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`);
  };

  const handleMouseLeave = () => {
    if (!hover3D) return;
    setTransform("");
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "glass-card p-6 transition-all duration-300 ease-out",
        hover3D && "cursor-pointer",
        glow && "glow-primary",
        className
      )}
      style={{ transform: transform || undefined, ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
