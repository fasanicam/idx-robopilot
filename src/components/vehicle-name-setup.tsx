'use client';

import { useState, useEffect } from 'react';
import { useMqtt } from '@/contexts/mqtt-context';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCcw } from 'lucide-react';
import { generateVehicleName } from '@/lib/vehicle-name-generator';

export const VehicleNameSetup = () => {
  const { isVehicleNameSet, setVehicleName, vehicleName } = useMqtt();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(vehicleName);

  useEffect(() => {
    if (!isVehicleNameSet) {
      setOpen(true);
      setName(vehicleName)
    } else {
      setOpen(false);
    }
  }, [isVehicleNameSet, vehicleName]);

  useEffect(() => {
    setName(vehicleName);
  }, [vehicleName]);


  const handleSave = () => {
    if (name.trim()) {
      setVehicleName(name);
      setOpen(false);
    }
  };

  const handleGenerate = () => {
    setName(generateVehicleName());
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Welcome to RoboPilot!</AlertDialogTitle>
          <AlertDialogDescription>
            To get started, please set a name for your vehicle. This name is used for MQTT communication. You can use the randomly generated one or create your own.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter vehicle name..."
              autoFocus
            />
            <Button variant="outline" size="icon" onClick={handleGenerate} aria-label="Generate new name">
                <RefreshCcw className="h-4 w-4" />
            </Button>
        </div>
        <AlertDialogFooter>
          <Button onClick={handleSave}>Save and Connect</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
