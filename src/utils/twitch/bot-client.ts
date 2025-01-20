import tmi from 'tmi.js';
import { TwitchBotConfig, TwitchCommandHandler, TwitchUserState } from '@/types/twitch';
import { supabase } from '@/lib/supabase/client';

export class TwitchBot {
  private client: tmi.Client;
  private commands: Map<string, TwitchCommandHandler['handler']>;
  private activeGiveaway: string | null = null;

  constructor(config: TwitchBotConfig) {
    this.client = new tmi.Client({
      options: { debug: process.env.NODE_ENV === 'development' },
      identity: {
        username: config.username,
        password: config.token,
      },
      channels: config.channels,
    });

    this.commands = new Map();
    this.setupCommands();
  }

  private setupCommands() {
    // !join command
    this.commands.set('!join', async (channel, tags) => {
      if (!this.activeGiveaway || !tags.username) return;

      try {
        const { error } = await supabase.from('entries').insert({
          giveaway_id: this.activeGiveaway,
          twitch_username: tags.username,
          entered_at: new Date().toISOString(),
        });

        if (error) throw error;

        await this.client.say(channel, 
          `@${tags.username} has been entered into the giveaway!`
        );
      } catch (error) {
        console.error('Error adding entry:', error);
      }
    });

    // !draw command - restricted to mods
    this.commands.set('!draw', async (channel, tags) => {
      if (!tags.mod && !tags.badges?.broadcaster) {
        return;
      }

      if (!this.activeGiveaway) {
        await this.client.say(channel, 'No active giveaway to draw from!');
        return;
      }

      try {
        const { data: winner, error } = await supabase
          .from('entries')
          .select('twitch_username')
          .eq('giveaway_id', this.activeGiveaway)
          .order('random()')
          .limit(1)
          .single();

        if (error) throw error;

        if (winner) {
          await this.client.say(channel, 
            `🎉 The winner is @${winner.twitch_username}! Congratulations! 🎉`
          );
        } else {
          await this.client.say(channel, 'No entries found for the giveaway!');
        }
      } catch (error) {
        console.error('Error drawing winner:', error);
      }
    });
  }

  public async connect() {
    try {
      await this.client.connect();
      console.log('Connected to Twitch IRC');
    } catch (error) {
      console.error('Failed to connect to Twitch:', error);
    }
  }

  public async disconnect() {
    try {
      await this.client.disconnect();
      console.log('Disconnected from Twitch IRC');
    } catch (error) {
      console.error('Error disconnecting from Twitch:', error);
    }
  }

  public setActiveGiveaway(giveawayId: string | null) {
    this.activeGiveaway = giveawayId;
  }

  public async handleMessage(channel: string, tags: TwitchUserState, message: string, self: boolean) {
    if (self) return;

    const commandName = message.split(' ')[0].toLowerCase();
    const handler = this.commands.get(commandName);

    if (handler) {
      await handler(channel, tags);
    }
  }
}
