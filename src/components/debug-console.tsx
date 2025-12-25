'use client';

import { useMqtt, LogMessage } from '@/contexts/mqtt-context';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from './ui/card';

const LogLine: React.FC<{ log: LogMessage }> = ({ log }) => {
  const colorClasses: Record<LogMessage['type'], string> = {
    sent: 'text-accent',
    received: 'text-[hsl(var(--chart-2))]',
    system: 'text-[hsl(var(--chart-4))]',
  };

  return (
    <div className="font-code text-xs p-1 border-b border-border/50">
      <span className="text-muted-foreground mr-2">{log.timestamp}</span>
      <span className={cn('font-bold mr-2', colorClasses[log.type])}>[{log.type.toUpperCase()}]</span>
      {log.topic && <span className="text-muted-foreground mr-1">{log.topic}:</span>}
      <span>{log.message}</span>
    </div>
  );
};

export const DebugConsole = () => {
  const { logs, clearLogs } = useMqtt();

  return (
    <Collapsible>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center p-2">
            <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-left justify-start w-full [&[data-state=open]>svg]:rotate-180">
                    <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                    <h3 className="font-medium">Debug Console</h3>
                    <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">{logs.length}</span>
                </Button>
            </CollapsibleTrigger>
            <Button variant="ghost" size="icon" onClick={clearLogs} className="h-8 w-8 shrink-0">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Clear logs</span>
            </Button>
        </CardHeader>
        <CollapsibleContent>
            <CardContent className="p-0">
                <ScrollArea className="h-48 border-t border-border">
                    <div className="p-2">
                        {logs.length > 0 ? logs.map((log, i) => (
                        <LogLine key={`${log.timestamp}-${i}`} log={log} />
                        )) : (
                        <p className="text-center text-sm text-muted-foreground p-4">No logs yet.</p>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
