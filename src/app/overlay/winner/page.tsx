'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Entry = Database['public']['Tables']['entries']['Row'];

export default function WinnerOverlay() {
  const [winner, setWinner] = useState<Entry | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Subscribe to changes in the entries table
    const subscription = supabase
      .channel('entries')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'entries',
          filter: 'is_winner=eq.true'
        },
        (payload) => {
          // When a new winner is selected
          const newWinner = payload.new as Entry;
          setWinner(newWinner);
          
          // Show the winner animation
          setIsVisible(true);
          
          // Hide after 10 seconds
          setTimeout(() => {
            setIsVisible(false);
          }, 10000);
        }
      )
      .subscribe();

    return () => {
      // Cleanup subscription
      subscription.unsubscribe();
    };
  }, []);

  if (!isVisible || !winner) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="animate-winner-reveal bg-black/80 p-8 rounded-lg text-center">
        <h1 className="text-6xl font-bold text-white mb-4">
          🎉 Winner! 🎉
        </h1>
        <p className="text-4xl text-white">
          Congratulations @{winner.twitch_username}!
        </p>
      </div>
    </div>
  );
} 