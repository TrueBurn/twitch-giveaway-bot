'use client';

import { useEffect, useState, useCallback } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { getBotInstance } from '@/utils/twitch/bot-manager';
import { CreateGiveawayModal } from '@/components/giveaways/create-giveaway-modal';
import { toast } from '@/components/ui/toast';
import { GiveawayListSkeleton } from '@/components/skeletons/giveaway-list-skeleton';

interface Giveaway {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  created_at: string;
  ended_at?: string;
  entry_count: number;
}

export default function GiveawaysPage() {
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeGiveaway, setActiveGiveaway] = useState<Giveaway | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadGiveaways = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('giveaways')
        .select(`
          *,
          entry_count:entries(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGiveaways(data || []);
      
      // Set active giveaway
      const active = data?.find(g => g.status === 'active');
      setActiveGiveaway(active || null);
    } catch (error) {
      console.error('Error loading giveaways:', error);
      toast.error('Failed to load giveaways');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGiveaways();

    const subscription = supabase
      .channel('giveaways')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'giveaways' },
        loadGiveaways
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [loadGiveaways]);

  const startGiveaway = async (giveawayId: string) => {
    try {
      const { error } = await supabase
        .from('giveaways')
        .update({ status: 'active' })
        .eq('id', giveawayId);

      if (error) throw error;
      toast.success('Giveaway started successfully');

      // Update bot's active giveaway
      const bot = getBotInstance();
      if (bot) {
        bot.setActiveGiveaway(giveawayId);
      }

      await loadGiveaways();
    } catch (error) {
      console.error('Error starting giveaway:', error);
      toast.error('Failed to start giveaway');
    }
  };

  const endGiveaway = async (giveawayId: string) => {
    try {
      const { error } = await supabase
        .from('giveaways')
        .update({ 
          status: 'completed',
          ended_at: new Date().toISOString()
        })
        .eq('id', giveawayId);

      if (error) throw error;

      // Clear bot's active giveaway
      const bot = getBotInstance();
      if (bot) {
        bot.setActiveGiveaway(null);
      }

      await loadGiveaways();
    } catch (error) {
      console.error('Error ending giveaway:', error);
      toast.error('Failed to end giveaway');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <GiveawayListSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Giveaways</h1>
            <p className="text-muted-foreground">
              Create and manage your Twitch giveaways
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            Create Giveaway
          </Button>
        </div>

        {/* Active Giveaway Section */}
        {activeGiveaway && (
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Active Giveaway</h2>
                <p className="text-muted-foreground">{activeGiveaway.title}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm">
                  {activeGiveaway.entry_count} entries
                </p>
                <Button
                  variant="danger"
                  onClick={() => endGiveaway(activeGiveaway.id)}
                >
                  End Giveaway
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Giveaway List */}
        <div className="rounded-lg border">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Recent Giveaways</h3>
            <div className="mt-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-4 text-left">Title</th>
                    <th className="pb-4 text-left">Status</th>
                    <th className="pb-4 text-left">Entries</th>
                    <th className="pb-4 text-left">Created</th>
                    <th className="pb-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {giveaways.map((giveaway) => (
                    <tr key={giveaway.id} className="border-b">
                      <td className="py-4">{giveaway.title}</td>
                      <td className="py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          giveaway.status === 'active' 
                            ? 'bg-green-100 text-green-700'
                            : giveaway.status === 'completed'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {giveaway.status}
                        </span>
                      </td>
                      <td className="py-4">{giveaway.entry_count}</td>
                      <td className="py-4">
                        {new Date(giveaway.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        {giveaway.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => startGiveaway(giveaway.id)}
                          >
                            Start
                          </Button>
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

      <CreateGiveawayModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadGiveaways}
      />
    </AdminLayout>
  );
} 