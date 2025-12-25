"use client";

import { MqttProvider } from "@/contexts/mqtt-context";
import { HeaderBar } from "@/components/header-bar";
import { DirectionalPad } from "@/components/directional-pad";
import { DistanceDisplay } from "@/components/distance-display";
import { DebugConsole } from "@/components/debug-console";
import { Card } from "@/components/ui/card";
import { VehicleNameSetup } from "@/components/vehicle-name-setup";

export default function Home() {
  return (
    <MqttProvider>
      <div className="flex flex-col h-dvh bg-background text-foreground">
        <HeaderBar />
        <main className="flex-grow flex flex-col items-center justify-around p-4 md:p-6 gap-4">
          <div className="w-full max-w-md mx-auto flex flex-col gap-4">
            <DistanceDisplay />
            <Card className="flex items-center justify-center p-4 aspect-square bg-card/50 shadow-inner">
              <DirectionalPad />
            </Card>
          </div>
          <div className="w-full max-w-md mx-auto">
             <DebugConsole />
          </div>
        </main>
        <VehicleNameSetup />
      </div>
    </MqttProvider>
  );
}
