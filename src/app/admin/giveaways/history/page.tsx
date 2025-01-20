'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { GiveawayAnalytics } from '@/components/giveaways/giveaway-analytics';

interface GiveawayHistory {
  id: string;
  title: string;
  prize: string;
  status: 'pending' | 'active' | 'completed';
  created_at: string;
  ended_at: string | null;
  entry_count: number;
  winner: {
    twitch_username: string;
    entered_at: string;
  } | null;
}

export default function GiveawayHistoryPage() {
  const [giveaways, setGiveaways] = useState<GiveawayHistory[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'entries'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const loadGiveaways = useCallback(async () => {
    try {
      let query = supabase
        .from('giveaways')
        .select(`
          *,
          entry_count:entries(count),
          winner:entries(twitch_username, entered_at)
        `)
        .eq('entries.is_winner', true);

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      if (sortBy === 'date') {
        query = query.order('created_at', { ascending: sortOrder === 'asc' });
      } else {
        query = query.order('entry_count', { ascending: sortOrder === 'asc' });
      }

      const { data, error } = await query;

      if (error) throw error;
      setGiveaways(data || []);
    } catch (error) {
      console.error('Error loading giveaway history:', error);
    }
  }, [filter, sortBy, sortOrder]);

  useEffect(() => {
    loadGiveaways();
  }, [loadGiveaways]);

  const toggleSort = (field: 'date' | 'entries') => {
    if (sortBy === field) {
      setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const exportToCSV = () => {
    const headers = ['Title', 'Prize', 'Status', 'Created', 'Ended', 'Entries', 'Winner'];
    const rows = giveaways.map(g => [
      g.title,
      g.prize,
      g.status,
      new Date(g.created_at).toLocaleString(),
      g.ended_at ? new Date(g.ended_at).toLocaleString() : '-',
      g.entry_count,
      g.winner?.twitch_username || '-'
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `giveaway-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Giveaway History</h1>
            <p className="text-muted-foreground">
              View and analyze past giveaways
            </p>
          </div>
          <Button onClick={exportToCSV}>
            Export to CSV
          </Button>
        </div>

        {/* Add Analytics Section */}
        <GiveawayAnalytics />

        {/* Filters */}
        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="rounded-md border px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="active">Active</option>
          </select>
        </div>

        {/* Giveaway List */}
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Prize</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left cursor-pointer" onClick={() => toggleSort('date')}>
                    Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-4 text-left cursor-pointer" onClick={() => toggleSort('entries')}>
                    Entries {sortBy === 'entries' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-4 text-left">Winner</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {giveaways.map((giveaway) => (
                  <tr key={giveaway.id} className="border-b">
                    <td className="p-4">{giveaway.title}</td>
                    <td className="p-4">{giveaway.prize}</td>
                    <td className="p-4">
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
                    <td className="p-4">
                      {new Date(giveaway.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">{giveaway.entry_count}</td>
                    <td className="p-4">
                      {giveaway.winner?.twitch_username || '-'}
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/giveaways/${giveaway.id}`}>
                        <Button variant="secondary" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 