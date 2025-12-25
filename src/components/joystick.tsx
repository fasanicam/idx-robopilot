'use client';

import { useState, useRef } from 'react';
import { useMqtt } from '@/contexts/mqtt-context';
import { cn } from '@/lib/utils';
import { ChevronsUp, ChevronsLeft, ChevronsRight, ChevronsDown } from 'lucide-react';

const SPEED_MIN = 30000;
const SPEED_MAX = 65535;

export const Joystick = () => {
  const { publish } = useMqtt();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const getDirectionAndSpeed = (x: number, y: number, radius: number) => {
    const angle = (Math.atan2(y, x) * 180) / Math.PI;
    const distance = Math.min(Math.sqrt(x * x + y * y), radius);
    
    let direction = 'stop';
    // Deadzone check
    if (distance > radius * 0.1) {
      if (angle > -22.5 && angle <= 22.5) direction = 'droite';
      else if (angle > 22.5 && angle <= 67.5) direction = 'diagonale_ar_droite';
      else if (angle > 67.5 && angle <= 112.5) direction = 'reculer';
      else if (angle > 112.5 && angle <= 157.5) direction = 'diagonale_ar_gauche';
      else if (angle > 157.5 || angle <= -157.5) direction = 'gauche';
      else if (angle > -157.5 && angle <= -112.5) direction = 'diagonale_av_gauche';
      else if (angle > -112.5 && angle <= -67.5) direction = 'avancer';
      else if (angle > -67.5 && angle <= -22.5) direction = 'diagonale_av_droite';
    }

    const speed = Math.round(SPEED_MIN + ((distance / radius) * (SPEED_MAX - SPEED_MIN)));
    return { direction, speed: direction === 'stop' ? 0 : speed };
  };

  const handleInteraction = (e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const radius = rect.width / 2;
    const touch = 'touches' in e ? e.touches[0] : e;

    const x = touch.clientX - rect.left - radius;
    const y = touch.clientY - rect.top - radius;
    
    const constrainedDistance = Math.min(Math.sqrt(x*x + y*y), radius);
    const angle = Math.atan2(y, x);

    const newX = constrainedDistance * Math.cos(angle);
    const newY = constrainedDistance * Math.sin(angle);
    
    setPosition({ x: newX, y: newY });

    const { direction, speed } = getDirectionAndSpeed(newX, newY, radius);
    publish('cmd', direction);
    if(speed > 0) publish('vitesse', speed.toString());
  };

  const startDrag = (e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleInteraction(e);
  };

  const onDrag = (e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    handleInteraction(e);
  };

  const endDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    publish('cmd', 'stop');
  };

  return (
    <div
      ref={containerRef}
      className="relative w-56 h-56 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center touch-none select-none cursor-pointer"
      onTouchStart={startDrag}
      onTouchMove={onDrag}
      onTouchEnd={endDrag}
      onMouseDown={startDrag}
      onMouseMove={onDrag}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
    >
      <div className="absolute w-full h-full text-primary/30">
        <ChevronsUp className="absolute top-2 left-1/2 -translate-x-1/2" />
        <ChevronsDown className="absolute bottom-2 left-1/2 -translate-x-1/2" />
        <ChevronsLeft className="absolute left-2 top-1/2 -translate-y-1/2" />
        <ChevronsRight className="absolute right-2 top-1/2 -translate-y-1/2" />
      </div>
      <div
        className={cn(
          'absolute w-20 h-20 rounded-full bg-primary shadow-lg ring-4 ring-primary/50 flex items-center justify-center transition-transform duration-75 ease-linear',
          isDragging && 'scale-110 ring-accent'
        )}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <div className="w-8 h-8 rounded-full bg-primary-foreground/20"></div>
      </div>
    </div>
  );
};
