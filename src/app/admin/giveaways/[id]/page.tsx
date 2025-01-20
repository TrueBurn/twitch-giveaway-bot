'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { getBotInstance } from '@/utils/twitch/bot-manager';
import { toast } from '@/components/ui/toast';
import { GiveawayDetailsSkeleton } from '@/components/skeletons/giveaway-details-skeleton';

interface GiveawayDetails {
  id: string;
  title: string;
  description: string;
  prize: string;
  requirements: string;
  status: 'pending' | 'active' | 'completed';
  created_at: string;
  ended_at?: string;
  duration_minutes?: number;
}

interface Entry {
  id: string;
  twitch_username: string;
  entered_at: string;
  is_winner: boolean;
}

export default function GiveawayDetailsPage() {
  const { id } = useParams();
  const [giveaway, setGiveaway] = useState<GiveawayDetails | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWinner, setSelectedWinner] = useState<Entry | null>(null);

  const loadGiveaway = useCallback(async () => {
    try {
      const { data: giveawayData, error: giveawayError } = await supabase
        .from('giveaways')
        .select('*')
        .eq('id', id)
        .single();

      if (giveawayError) throw giveawayError;
      setGiveaway(giveawayData);

      const { data: entriesData, error: entriesError } = await supabase
        .from('entries')
        .select('*')
        .eq('giveaway_id', id)
        .order('entered_at', { ascending: true });

      if (entriesError) throw entriesError;
      setEntries(entriesData);

      const winner = entriesData.find(entry => entry.is_winner);
      if (winner) setSelectedWinner(winner);

    } catch (error) {
      console.error('Error loading giveaway details:', error);
      toast.error('Failed to load giveaway details');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const subscription = supabase
      .channel(`giveaway-${id}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'entries',
          filter: `giveaway_id=eq.${id}`
        },
        loadGiveaway
      )
      .subscribe();

    loadGiveaway();

    return () => {
      subscription.unsubscribe();
    };
  }, [id, loadGiveaway]);

  const startGiveaway = async () => {
    try {
      const { error } = await supabase
        .from('giveaways')
        .update({ status: 'active' })
        .eq('id', id);

      if (error) throw error;

      const bot = getBotInstance();
      if (bot) {
        bot.setActiveGiveaway(id as string);
      }

      toast.success('Giveaway started successfully');
      await loadGiveaway();
    } catch (error) {
      console.error('Error starting giveaway:', error);
      toast.error('Failed to start giveaway');
    }
  };

  const endGiveaway = async () => {
    try {
      const { error } = await supabase
        .from('giveaways')
        .update({ 
          status: 'completed',
          ended_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      const bot = getBotInstance();
      if (bot) {
        bot.setActiveGiveaway(null);
      }

      toast.success('Giveaway ended successfully');
      await loadGiveaway();
    } catch (error) {
      console.error('Error ending giveaway:', error);
      toast.error('Failed to end giveaway');
    }
  };

  const drawWinner = async () => {
    if (entries.length === 0) {
      toast.warning('No entries to draw from');
      return;
    }

    try {
      toast.info('Drawing winner...');
      const randomIndex = Math.floor(Math.random() * entries.length);
      const winner = entries[randomIndex];

      const { error } = await supabase
        .from('entries')
        .update({ is_winner: true })
        .eq('id', winner.id);

      if (error) throw error;

      setSelectedWinner(winner);
      toast.success(`Winner selected: ${winner.twitch_username}`);
    } catch (error) {
      console.error('Error drawing winner:', error);
      toast.error('Failed to select winner');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <GiveawayDetailsSkeleton />
      </AdminLayout>
    );
  }

  if (!giveaway) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">Giveaway not found</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{giveaway.title}</h1>
            <p className="text-muted-foreground">
              Created on {new Date(giveaway.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            {giveaway.status === 'pending' && (
              <Button onClick={startGiveaway}>Start Giveaway</Button>
            )}
            {giveaway.status === 'active' && (
              <>
                <Button onClick={drawWinner}>Draw Winner</Button>
                <Button variant="danger" onClick={endGiveaway}>
                  End Giveaway
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Giveaway Info */}
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <h2 className="text-lg font-semibold">Giveaway Details</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Prize</h3>
                  <p className="mt-1">{giveaway.prize}</p>
                </div>
                {giveaway.description && (
                  <div>
                    <h3 className="text-sm font-medium">Description</h3>
                    <p className="mt-1">{giveaway.description}</p>
                  </div>
                )}
                {giveaway.requirements && (
                  <div>
                    <h3 className="text-sm font-medium">Requirements</h3>
                    <p className="mt-1">{giveaway.requirements}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium">Status</h3>
                  <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    giveaway.status === 'active' 
                      ? 'bg-green-100 text-green-700'
                      : giveaway.status === 'completed'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {giveaway.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Entries */}
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Entries</h2>
                <span className="text-sm text-muted-foreground">
                  {entries.length} total
                </span>
              </div>
              <div className="mt-4 max-h-[400px] overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-2 text-left">Username</th>
                      <th className="pb-2 text-left">Entered At</th>
                      <th className="pb-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry.id} className="border-b">
                        <td className="py-2">{entry.twitch_username}</td>
                        <td className="py-2">
                          {new Date(entry.entered_at).toLocaleTimeString()}
                        </td>
                        <td className="py-2">
                          {selectedWinner?.id === entry.id && (
                            <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                              Winner
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 