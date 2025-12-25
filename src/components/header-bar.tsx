'use client';

import { useState, useEffect } from 'react';
import { useMqtt } from '@/contexts/mqtt-context';
import { StatusIndicator } from './status-indicator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, Check, X } from 'lucide-react';

export const HeaderBar = () => {
  const { vehicleName, setVehicleName, brokerStatus, vehicleStatus } = useMqtt();
  const [isEditing, setIsEditing] = useState(false);
  const [editableName, setEditableName] = useState(vehicleName);

  useEffect(() => {
    if (vehicleName) {
      setEditableName(vehicleName);
    }
  }, [vehicleName]);

  const handleSave = () => {
    setVehicleName(editableName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableName(vehicleName);
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <header className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <h1 className="text-2xl font-headline font-bold text-accent">RoboPilot</h1>
      
      <div className="flex items-center gap-2">
        {!isEditing ? (
          <>
            <span className="text-lg font-medium font-headline">{vehicleName}</span>
            <Button aria-label="Edit vehicle name" variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setIsEditing(true); setEditableName(vehicleName); }}>
              <Pencil className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-1">
            <Input
              type="text"
              value={editableName}
              onChange={(e) => setEditableName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-9"
              autoFocus
            />
            <Button aria-label="Save vehicle name" variant="ghost" size="icon" className="h-8 w-8 text-green-400" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
            <Button aria-label="Cancel editing" variant="ghost" size="icon" className="h-8 w-8" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
        <StatusIndicator status={brokerStatus} label="Broker" />
        <StatusIndicator status={vehicleStatus} label="Vehicle" />
      </div>
    </header>
  );
};
