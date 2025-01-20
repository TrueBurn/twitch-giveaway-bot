'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { getBotInstance, initializeTwitchBot } from '@/utils/twitch/bot-manager';

interface BotStatus {
  isConnected: boolean;
  channels: string[];
  lastError?: string;
}

interface BotConfig {
  joinCommand: string;
  drawCommand: string;
  channelName: string;
}

export default function BotDashboard() {
  const [status, setStatus] = useState<BotStatus>({
    isConnected: false,
    channels: [],
  });
  const [config, setConfig] = useState<BotConfig>({
    joinCommand: '!join',
    drawCommand: '!draw',
    channelName: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load saved config
    const loadConfig = async () => {
      const { data, error } = await supabase
        .from('bot_config')
        .select('*')
        .single();

      if (data && !error) {
        setConfig(data);
      }
    };

    loadConfig();
  }, []);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await initializeTwitchBot({
        username: process.env.NEXT_PUBLIC_TWITCH_BOT_USERNAME!,
        token: process.env.NEXT_PUBLIC_TWITCH_BOT_TOKEN!,
        channels: [config.channelName],
        giveawayConfig: {
          joinCommand: config.joinCommand,
          drawCommand: config.drawCommand,
        },
      });

      setStatus({
        isConnected: true,
        channels: [config.channelName],
      });
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        lastError: (error as Error).message,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      const bot = getBotInstance();
      if (bot) {
        await bot.disconnect();
        setStatus({
          isConnected: false,
          channels: [],
        });
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        lastError: (error as Error).message,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bot_config')
        .upsert({
          joinCommand: config.joinCommand,
          drawCommand: config.drawCommand,
          channelName: config.channelName,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bot Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your Twitch bot connection and settings
          </p>
        </div>

        <div className="grid gap-6">
          {/* Status Card */}
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <h3 className="text-lg font-semibold">Bot Status</h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`h-3 w-3 rounded-full ${
                    status.isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span>{status.isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
                {status.channels.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Connected to: {status.channels.join(', ')}
                  </p>
                )}
                {status.lastError && (
                  <p className="text-sm text-red-500">
                    Error: {status.lastError}
                  </p>
                )}
              </div>
              <div className="mt-4">
                <Button
                  onClick={status.isConnected ? handleDisconnect : handleConnect}
                  disabled={isLoading}
                  variant={status.isConnected ? 'danger' : 'default'}
                >
                  {isLoading ? 'Processing...' : 
                    status.isConnected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            </div>
          </div>

          {/* Configuration Card */}
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <h3 className="text-lg font-semibold">Bot Configuration</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium">
                    Channel Name
                  </label>
                  <input
                    type="text"
                    value={config.channelName}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      channelName: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-md border px-3 py-2"
                    placeholder="Enter channel name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Join Command
                  </label>
                  <input
                    type="text"
                    value={config.joinCommand}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      joinCommand: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-md border px-3 py-2"
                    placeholder="!join"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Draw Command
                  </label>
                  <input
                    type="text"
                    value={config.drawCommand}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      drawCommand: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-md border px-3 py-2"
                    placeholder="!draw"
                  />
                </div>
                <Button
                  onClick={saveConfig}
                  disabled={isLoading}
                >
                  Save Configuration
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 