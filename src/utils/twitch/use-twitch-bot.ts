import { useEffect, useState } from 'react';
import { initializeTwitchBot, getBotInstance, disconnectBot } from './bot-manager';

export function useTwitchBot(channel: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function connectBot() {
      try {
        await initializeTwitchBot({
          username: process.env.NEXT_PUBLIC_TWITCH_BOT_USERNAME!,
          token: process.env.NEXT_PUBLIC_TWITCH_BOT_TOKEN!,
          channels: [channel],
          giveawayConfig: {
            joinCommand: '!join',
            drawCommand: '!draw'
          }
        });
        setIsConnected(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to connect to Twitch'));
      }
    }

    connectBot();

    return () => {
      disconnectBot();
      setIsConnected(false);
    };
  }, [channel]);

  return { isConnected, error, bot: getBotInstance };
}
