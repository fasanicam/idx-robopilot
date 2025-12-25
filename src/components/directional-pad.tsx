'use client';

import { useMqtt } from '@/contexts/mqtt-context';
import { Button } from '@/components/ui/button';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  StopCircle,
} from 'lucide-react';

export const DirectionalPad = () => {
  const { publish } = useMqtt();
  const SPEED = '60000'; // Speed set to a high constant value

  const handleCommand = (command: string) => {
    publish('cmd', command);
    if (command !== 'stop') {
        publish('vitesse', SPEED);
    }
  };

  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-2 w-56 h-56 mx-auto">
      <div />
      <Button
        className="h-full w-full text-2xl"
        onMouseDown={() => handleCommand('avancer')}
        onMouseUp={() => handleCommand('stop')}
        onTouchStart={(e) => {e.preventDefault(); handleCommand('avancer');}}
        onTouchEnd={(e) => {e.preventDefault(); handleCommand('stop');}}
      >
        <ArrowUp size={48} />
      </Button>
      <div />

      <Button
        className="h-full w-full text-2xl"
        onMouseDown={() => handleCommand('rotation antihoraire')}
        onMouseUp={() => handleCommand('stop')}
        onTouchStart={(e) => {e.preventDefault(); handleCommand('rotation antihoraire');}}
        onTouchEnd={(e) => {e.preventDefault(); handleCommand('stop');}}
      >
        <ArrowLeft size={48} />
      </Button>
      <Button
        variant="destructive"
        className="h-full w-full"
        onClick={() => handleCommand('stop')}
      >
        <StopCircle size={48} />
      </Button>
      <Button
        className="h-full w-full text-2xl"
        onMouseDown={() => handleCommand('rotation horaire')}
        onMouseUp={() => handleCommand('stop')}
        onTouchStart={(e) => {e.preventDefault(); handleCommand('rotation horaire');}}
        onTouchEnd={(e) => {e.preventDefault(); handleCommand('stop');}}
      >
        <ArrowRight size={48} />
      </Button>

      <div />
      <Button
        className="h-full w-full text-2xl"
        onMouseDown={() => handleCommand('reculer')}
        onMouseUp={() => handleCommand('stop')}
        onTouchStart={(e) => {e.preventDefault(); handleCommand('reculer');}}
        onTouchEnd={(e) => {e.preventDefault(); handleCommand('stop');}}
      >
        <ArrowDown size={48} />
      </Button>
      <div />
    </div>
  );
};
