'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface GiveawayStats {
  totalGiveaways: number;
  totalEntries: number;
  averageEntries: number;
  completedGiveaways: number;
  totalWinners: number;
  mostActiveParticipant: {
    username: string;
    entries: number;
  } | null;
  recentActivity: {
    date: string;
    entries: number;
  }[];
}

export function GiveawayAnalytics() {
  const [stats, setStats] = useState<GiveawayStats>({
    totalGiveaways: 0,
    totalEntries: 0,
    averageEntries: 0,
    completedGiveaways: 0,
    totalWinners: 0,
    mostActiveParticipant: null,
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get total giveaways and status counts
      const { data: giveawayStats, error: giveawayError } = await supabase
        .from('giveaways')
        .select('status')
        .order('created_at', { ascending: false });

      if (giveawayError) throw giveawayError;

      const totalGiveaways = giveawayStats?.length || 0;
      const completedGiveaways = giveawayStats?.filter(g => g.status === 'completed').length || 0;

      // Get entry statistics
      const { data: entryStats, error: entryError } = await supabase
        .from('entries')
        .select('twitch_username, is_winner, entered_at');

      if (entryError) throw entryError;

      const totalEntries = entryStats?.length || 0;
      const totalWinners = entryStats?.filter(e => e.is_winner).length || 0;
      const averageEntries = totalGiveaways ? Math.round(totalEntries / totalGiveaways) : 0;

      // Get most active participant
      const participantCounts = entryStats?.reduce((acc, entry) => {
        acc[entry.twitch_username] = (acc[entry.twitch_username] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostActiveParticipant = participantCounts ? 
        Object.entries(participantCounts)
          .sort(([,a], [,b]) => b - a)[0] : null;

      // Get recent activity (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      });

      const recentActivity = last7Days.map(date => {
        const entries = entryStats?.filter(e => 
          e.entered_at.startsWith(date)
        ).length || 0;
        return { date, entries };
      }).reverse();

      setStats({
        totalGiveaways,
        totalEntries,
        averageEntries,
        completedGiveaways,
        totalWinners,
        mostActiveParticipant: mostActiveParticipant ? {
          username: mostActiveParticipant[0],
          entries: mostActiveParticipant[1],
        } : null,
        recentActivity,
      });
    } catch (error) {
      console.error('Error loading giveaway stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="h-48 animate-pulse bg-muted rounded-lg" />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Giveaways */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          Total Giveaways
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-2xl font-bold">{stats.totalGiveaways}</p>
          <p className="text-sm text-muted-foreground">
            {stats.completedGiveaways} completed
          </p>
        </div>
      </div>

      {/* Total Entries */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          Total Entries
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-2xl font-bold">{stats.totalEntries}</p>
          <p className="text-sm text-muted-foreground">
            ~{stats.averageEntries} avg/giveaway
          </p>
        </div>
      </div>

      {/* Winners */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          Total Winners
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-2xl font-bold">{stats.totalWinners}</p>
          <p className="text-sm text-muted-foreground">
            {Math.round((stats.totalWinners / stats.totalGiveaways) * 100)}% completion
          </p>
        </div>
      </div>

      {/* Most Active Participant */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          Most Active Participant
        </h3>
        <div className="mt-2">
          {stats.mostActiveParticipant ? (
            <>
              <p className="text-lg font-semibold">
                {stats.mostActiveParticipant.username}
              </p>
              <p className="text-sm text-muted-foreground">
                {stats.mostActiveParticipant.entries} entries
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No participants yet</p>
          )}
        </div>
      </div>

      {/* Recent Activity Chart */}
      <div className="col-span-full rounded-lg border bg-card p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Recent Activity
        </h3>
        <div className="h-48 flex items-end gap-2">
          {stats.recentActivity.map((day) => {
            const maxEntries = Math.max(...stats.recentActivity.map(d => d.entries));
            const height = maxEntries ? (day.entries / maxEntries) * 100 : 0;
            
            return (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full bg-primary/20 rounded-t"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-muted-foreground">
                  {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 