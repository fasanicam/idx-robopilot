'use client';
import { cn } from '@/lib/utils';

type Status = 'online' | 'offline' | 'connected' | 'disconnected' | 'connecting' | 'error';

interface StatusIndicatorProps {
  status: Status;
  label: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label }) => {
  const statusConfig: Record<Status, { color: string, label: string }> = {
    online: { color: 'bg-[hsl(var(--chart-2))]', label: 'Online' },
    connected: { color: 'bg-[hsl(var(--chart-2))]', label: 'Connected' },
    offline: { color: 'bg-destructive', label: 'Offline' },
    disconnected: { color: 'bg-destructive', label: 'Disconnected' },
    error: { color: 'bg-destructive', label: 'Error' },
    connecting: { color: 'bg-[hsl(var(--chart-4))] animate-pulse', label: 'Connecting' },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={cn('h-3 w-3 rounded-full', config.color)} />
      <span className="text-muted-foreground">{label}: <span className="text-foreground font-medium">{config.label}</span></span>
    </div>
  );
};
