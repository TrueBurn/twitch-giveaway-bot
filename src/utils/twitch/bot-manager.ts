import { TwitchBot } from './bot-client';

let botInstance: TwitchBot | null = null;

interface TwitchBotConfig {
  username: string;
  token: string;
  channels: string[];
  giveawayConfig: {
    joinCommand: string;
    drawCommand: string;
  };
}

export const initializeTwitchBot = async (config: TwitchBotConfig) => {
  if (!process.env.TWITCH_BOT_USERNAME || !process.env.TWITCH_BOT_TOKEN) {
    throw new Error('Missing Twitch bot credentials');
  }

  if (!botInstance) {
    botInstance = new TwitchBot({
      username: process.env.TWITCH_BOT_USERNAME,
      token: process.env.TWITCH_BOT_TOKEN,
      channels: [config.channels[0]],
    });

    await botInstance.connect();
  }

  return botInstance;
};

export function getBotInstance() {
  if (!botInstance) {
    throw new Error('Bot not initialized');
  }
  return botInstance;
}

export async function disconnectBot() {
  if (botInstance) {
    await botInstance.disconnect();
    botInstance = null;
  }
}
