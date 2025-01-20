import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCommands } from './commands';
import type { Commands, CommandContext } from './commands';


// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(),
      update: vi.fn(),
      eq: vi.fn()
    }))
  }
}));

describe('Twitch Commands', () => {
  const mockSay = vi.fn();
  let commands: Commands;

  const defaultConfig = {
    joinCommand: '!join',
    drawCommand: '!draw',
    rerollCommand: '!reroll',
    messages: {
      noActiveGiveaway: 'No active giveaway',
      alreadyEntered: 'Already entered',
      successfulEntry: 'Entry successful',
      entryError: 'Entry error',
      noPermission: 'Only moderators',
      noWinnerFound: 'No winner found',
      winnerAnnouncement: 'Winner: {username}',
      drawError: 'Draw error',
      rerollSuccess: 'Reroll: {username}',
      rerollError: 'Reroll error',
      noEligibleEntries: 'No eligible entries'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSay.mockClear();
    commands = createCommands(defaultConfig);
  });

  describe('drawCommand', () => {
    it('should prevent non-mods from drawing winners', async () => {
      await (commands[defaultConfig.drawCommand] as (context: CommandContext) => Promise<void>)({
        tags: { mod: false, badges: {}, username: 'testuser' },
        activeGiveawayId: '123',
        say: mockSay,
        config: defaultConfig,
        channel: 'testchannel',
        message: '!draw'
      });

      expect(mockSay).toHaveBeenCalledWith('Only moderators');
    });

    it('should handle no active giveaway', async () => {
      await (commands[defaultConfig.drawCommand] as (context: CommandContext) => Promise<void>)({
        tags: { mod: true, badges: {}, username: 'testuser' },
        activeGiveawayId: null,
        say: mockSay,
        config: defaultConfig,
        channel: 'testchannel',
        message: '!draw'
      });

      expect(mockSay).toHaveBeenCalledWith(expect.stringContaining('No active giveaway'));
    });

  });
}); 