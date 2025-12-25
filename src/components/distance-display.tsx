'use client';
import { useMqtt } from '@/contexts/mqtt-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DistanceDisplay = () => {
  const { distance } = useMqtt();

  return (
    <Card className="text-center">
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground font-medium">FRONT DISTANCE</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-6xl font-bold font-headline text-accent">
          {distance !== null ? distance.toFixed(1) : '---'}
          {distance !== null && <span className="text-3xl text-muted-foreground ml-2">cm</span>}
        </p>
      </CardContent>
    </Card>
  );
};
