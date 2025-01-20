import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';
import WinnerOverlay from './page';
import { supabase } from '@/lib/supabase/client';

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnValue({
        unsubscribe: vi.fn()
      })
    })
  }
}));

describe('WinnerOverlay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not render when no winner is selected', () => {
    render(<WinnerOverlay />);
    expect(screen.queryByText(/Winner!/)).not.toBeInTheDocument();
  });

  it('should show and hide winner announcement', async () => {
    render(<WinnerOverlay />);

    // Get the callback from the mock
    const onMock = vi.mocked(supabase.channel('entries').on);
    const callback = onMock.mock.calls[0][2];

    // Simulate winner selection
    await act(async () => {
      callback({
        schema: 'public',
        table: 'entries',
        commit_timestamp: '2024-01-01T00:00:00Z',
        eventType: 'UPDATE',
        new: { twitch_username: 'testuser' },
        old: { twitch_username: '' },
        errors: []
      });
    });

    // Check if winner is shown
    expect(screen.getByText(/Winner!/)).toBeInTheDocument();
    expect(screen.getByText(/testuser/)).toBeInTheDocument();

    // Fast-forward 10 seconds
    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    // Check if winner is hidden
    expect(screen.queryByText(/Winner!/)).not.toBeInTheDocument();
  });

  it('should subscribe to Supabase changes on mount', () => {
    render(<WinnerOverlay />);
    
    const channelMock = vi.mocked(supabase.channel);
    const channel = channelMock('entries');
    const onMock = vi.mocked(channel.on);
    
    expect(channelMock).toHaveBeenCalledWith('entries');
    expect(onMock).toHaveBeenCalledWith(
      'postgres_changes',
      expect.objectContaining({
        event: 'UPDATE',
        filter: 'is_winner=eq.true'
      }),
      expect.any(Function)
    );
  });
}); 