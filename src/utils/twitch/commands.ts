import { supabase } from '@/lib/supabase/client';
import type { TwitchUserState } from '@/types/twitch';

export interface CommandContext {
  channel: string;
  tags: TwitchUserState;
  message: string;
  activeGiveawayId: string | null;
  say: (message: string) => Promise<void>;
  config: GiveawayConfig;
}

interface GiveawayConfig {
  joinCommand: string;
  drawCommand: string;
  rerollCommand: string;
  messages: {
    noActiveGiveaway: string;
    alreadyEntered: string;
    successfulEntry: string;
    entryError: string;
    noPermission: string;
    noWinnerFound: string;
    winnerAnnouncement: string;
    drawError: string;
    rerollSuccess: string;
    rerollError: string;
    noEligibleEntries: string;
  };
}

const defaultConfig: GiveawayConfig = {
  joinCommand: '!join',
  drawCommand: '!draw',
  rerollCommand: '!reroll',
  messages: {
    noActiveGiveaway: 'No active giveaway to join!',
    alreadyEntered: '@{username} you\'re already in the giveaway!',
    successfulEntry: '@{username} has been entered into the giveaway! Good luck! 🍀',
    entryError: '@{username} there was an error entering you into the giveaway. Please try again!',
    noPermission: 'Only moderators and broadcasters can use this command!',
    noWinnerFound: 'No eligible entries found!',
    winnerAnnouncement: '🎉 Congratulations @{username}! You\'ve won the giveaway! 🎉',
    drawError: 'There was an error drawing a winner. Please try again!',
    rerollSuccess: '🎲 Rerolling... New winner is @{username}! 🎉',
    rerollError: 'Failed to reroll. Please try again!',
    noEligibleEntries: 'No eligible entries found for reroll!'
  }
};

export const createCommands = (customConfig: Partial<GiveawayConfig> = {}) => {
  const config = { ...defaultConfig, ...customConfig };

  return {
    [config.joinCommand]: async ({ tags, activeGiveawayId, say, config }: CommandContext) => {
      if (!activeGiveawayId) {
        await say(config.messages.noActiveGiveaway);
        return;
      }

      if (!tags.username) {
        await say('Could not determine username!');
        return;
      }

      try {
        // Check if already entered
        const { data: existingEntry } = await supabase
          .from('entries')
          .select('id')
          .eq('giveaway_id', activeGiveawayId)
          .eq('twitch_username', tags.username)
          .single();

        if (existingEntry) {
          await say(config.messages.alreadyEntered.replace('{username}', tags.username));
          return;
        }

        // Add entry
        const { error } = await supabase
          .from('entries')
          .insert({
            giveaway_id: activeGiveawayId,
            twitch_username: tags.username,
            entered_at: new Date().toISOString(),
          });

        if (error) throw error;

        await say(config.messages.successfulEntry.replace('{username}', tags.username));
      } catch (error) {
        console.error('Error handling join command:', error);
        await say(config.messages.entryError.replace('{username}', tags.username));
      }
    },

    [config.drawCommand]: async ({ tags, activeGiveawayId, say, config }: CommandContext) => {
      // Check permissions
      if (!tags.mod && !tags.badges?.broadcaster) {
        await say(config.messages.noPermission);
        return;
      }

      if (!activeGiveawayId) {
        await say(config.messages.noActiveGiveaway);
        return;
      }

      try {
        // Get random entry
        const { data: winner, error: selectError } = await supabase
          .from('entries')
          .select('twitch_username')
          .eq('giveaway_id', activeGiveawayId)
          .eq('is_winner', false)
          .order('random()')
          .limit(1)
          .single();

        if (selectError || !winner) {
          await say(config.messages.noWinnerFound);
          return;
        }

        // Update entry as winner
        const { error: updateError } = await supabase
          .from('entries')
          .update({ is_winner: true })
          .eq('giveaway_id', activeGiveawayId)
          .eq('twitch_username', winner.twitch_username);

        if (updateError) throw updateError;

        // Announce winner
        await say(config.messages.winnerAnnouncement.replace('{username}', winner.twitch_username));

        // Update giveaway status if needed
        const { error: giveawayError } = await supabase
          .from('giveaways')
          .update({ 
            status: 'completed',
            ended_at: new Date().toISOString()
          })
          .eq('id', activeGiveawayId);

        if (giveawayError) {
          console.error('Error updating giveaway status:', giveawayError);
        }
      } catch (error) {
        console.error('Error handling draw command:', error);
        await say(config.messages.drawError);
      }
    },

    [config.rerollCommand]: async ({ tags, activeGiveawayId, say, config }: CommandContext) => {
      // Check permissions
      if (!tags.mod && !tags.badges?.broadcaster) {
        await say(config.messages.noPermission);
        return;
      }

      if (!activeGiveawayId) {
        await say(config.messages.noActiveGiveaway);
        return;
      }

      try {
        // Get random entry excluding previous winners
        const { data: newWinner, error: selectError } = await supabase
          .from('entries')
          .select('twitch_username')
          .eq('giveaway_id', activeGiveawayId)
          .eq('is_winner', false) // Only select non-winners
          .order('random()')
          .limit(1)
          .single();

        if (selectError || !newWinner) {
          await say(config.messages.noEligibleEntries);
          return;
        }

        // Update entry as winner
        const { error: updateError } = await supabase
          .from('entries')
          .update({ is_winner: true })
          .eq('giveaway_id', activeGiveawayId)
          .eq('twitch_username', newWinner.twitch_username);

        if (updateError) throw updateError;

        // Announce new winner
        await say(config.messages.rerollSuccess.replace('{username}', newWinner.twitch_username));

      } catch (error) {
        console.error('Error handling reroll command:', error);
        await say(config.messages.rerollError);
      }
    },

    handleCommand: async (commandName: string, context: CommandContext) => {
      if (commandName === config.joinCommand) {
        // @ts-expect-error - We know this command exists
        return this[config.joinCommand](context);
      }
      if (commandName === config.drawCommand) {
        // @ts-expect-error - We know this command exists
        return this[config.drawCommand](context);
      }
      if (commandName === config.rerollCommand) {
        // @ts-expect-error - We know this command exists
        return this[config.rerollCommand](context);
      }
    }
  };
};

export type Commands = ReturnType<typeof createCommands>; 