"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import mqtt, { MqttClient } from 'mqtt';
import { generateVehicleName } from '@/lib/vehicle-name-generator';
import { useToast } from "@/hooks/use-toast";

export type BrokerStatus = 'connecting' | 'connected' | 'disconnected' | 'error';
export type VehicleStatus = 'online' | 'offline';
export type LogMessage = {
  type: 'sent' | 'received' | 'system';
  topic?: string;
  message: string;
  timestamp: string;
};

interface MqttContextType {
  brokerStatus: BrokerStatus;
  vehicleStatus: VehicleStatus;
  vehicleName: string;
  setVehicleName: (name: string) => void;
  distance: number | null;
  logs: LogMessage[];
  publish: (topic: string, message: string) => void;
  clearLogs: () => void;
}

const MqttContext = createContext<MqttContextType | undefined>(undefined);

const BROKER_URL = 'wss://mqtt.dev.icam.school:443/mqtt';
const VEHICLE_STATUS_TIMEOUT = 10000; // 10 seconds

export const MqttProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [brokerStatus, setBrokerStatus] = useState<BrokerStatus>('disconnected');
  const [vehicleStatus, setVehicleStatus] = useState<VehicleStatus>('offline');
  const [vehicleName, setVehicleNameState] = useState<string>('');
  const [distance, setDistance] = useState<number | null>(null);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const vehicleStatusTimer = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const addLog = useCallback((log: Omit<LogMessage, 'timestamp'>) => {
    const newLog: LogMessage = {
      ...log,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 99)]);
  }, []);

  const setVehicleName = (newName: string) => {
    if (/^[a-z]+([A-Z][a-z]*)*$/.test(newName) && !newName.includes('+') && !newName.includes('#')) {
      localStorage.setItem('robopilot_vehicle_name', newName);
      setVehicleNameState(newName);
      addLog({ type: 'system', message: `Vehicle name changed to: ${newName}` });
      toast({
        title: "Name Updated",
        description: `Vehicle name is now ${newName}. Reconnecting.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Name",
        description: "Name must be camelCase and cannot contain '#' or '+'.",
      });
    }
  };

  const clearLogs = () => setLogs([]);

  const connectToBroker = useCallback((name: string) => {
    if (!name) return;

    setBrokerStatus('connecting');
    addLog({ type: 'system', message: `Connecting to ${BROKER_URL}...` });
    
    const newClient = mqtt.connect(BROKER_URL, {
      clientId: `robopilot-ui-${Math.random().toString(16).substr(2, 8)}`,
      reconnectPeriod: 5000,
    });
    setClient(newClient);

    newClient.on('connect', () => {
      setBrokerStatus('connected');
      addLog({ type: 'system', message: 'Connected to MQTT broker.' });
      const topic = `bzh/iot/voiture/${name}/#`;
      newClient.subscribe(topic, (err) => {
        if (!err) {
          addLog({ type: 'system', message: `Subscribed to ${topic}` });
        } else {
          addLog({ type: 'system', message: `Subscription failed: ${err.message}` });
          toast({ variant: "destructive", title: "Subscription Failed", description: err.message });
        }
      });
    });

    newClient.on('error', (err) => {
      setBrokerStatus('error');
      addLog({ type: 'system', message: `Connection error: ${err.message}` });
      toast({ variant: "destructive", title: "Connection Error", description: "Could not connect to MQTT broker." });
      newClient.end();
    });

    newClient.on('reconnect', () => {
      setBrokerStatus('connecting');
      addLog({ type: 'system', message: 'Reconnecting...' });
    });

    newClient.on('close', () => {
      if (brokerStatus !== 'error') {
        setBrokerStatus('disconnected');
        addLog({ type: 'system', message: 'Disconnected from broker.' });
      }
    });

    newClient.on('message', (topic, payload) => {
      const message = payload.toString();
      addLog({ type: 'received', topic, message });

      if (vehicleStatusTimer.current) clearTimeout(vehicleStatusTimer.current);
      setVehicleStatus('online');
      vehicleStatusTimer.current = setTimeout(() => {
        setVehicleStatus('offline');
        addLog({ type: 'system', message: 'Vehicle timed out, now offline.' });
      }, VEHICLE_STATUS_TIMEOUT);

      const topicParts = topic.split('/');
      const lastPart = topicParts[topicParts.length - 1];

      if (lastPart === 'distance') {
        const distValue = parseFloat(message);
        setDistance(isNaN(distValue) ? null : distValue);
      }
    });
  }, [addLog, brokerStatus, toast]);

  useEffect(() => {
    const storedName = localStorage.getItem('robopilot_vehicle_name') || generateVehicleName();
    if (!localStorage.getItem('robopilot_vehicle_name')) {
      localStorage.setItem('robopilot_vehicle_name', storedName);
      addLog({ type: 'system', message: `Generated vehicle name: ${storedName}` });
    }
    setVehicleNameState(storedName);
  }, [addLog]);

  useEffect(() => {
    if (client) {
      client.end(true);
    }
    if (vehicleName) {
      connectToBroker(vehicleName);
    }
    return () => {
      if(client) client.end(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleName]);
  
  const publish = (topicSuffix: string, message: string) => {
    if (client && client.connected && vehicleName) {
      const topic = `bzh/iot/voiture/${vehicleName}/${topicSuffix}`;
      client.publish(topic, message, (err) => {
        if (err) {
          addLog({ type: 'system', message: `Publish error on ${topic}: ${err.message}` });
        }
      });
      addLog({ type: 'sent', topic, message });
    }
  };

  return (
    <MqttContext.Provider value={{ brokerStatus, vehicleStatus, vehicleName, setVehicleName, distance, logs, publish, clearLogs }}>
      {children}
    </MqttContext.Provider>
  );
};

export const useMqtt = (): MqttContextType => {
  const context = useContext(MqttContext);
  if (context === undefined) {
    throw new Error('useMqtt must be used within an MqttProvider');
  }
  return context;
};
