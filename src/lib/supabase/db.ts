import { supabase } from './client';
import type { Database } from '@/types/database';

export async function createGiveaway(
  title: string,
  prizeDescription: string,
  createdBy: string
) {
  return supabase
    .from('giveaways')
    .insert({
      title,
      prize_description: prizeDescription,
      created_by: createdBy,
      status: 'active',
      ended_at: null,
    } satisfies Database['public']['Tables']['giveaways']['Insert']);
}

export async function endGiveaway(giveawayId: string) {
  return supabase
    .from('giveaways')
    .update({
      status: 'completed',
      ended_at: new Date().toISOString(),
    })
    .eq('id', giveawayId);
}

export async function getActiveGiveaway() {
  return supabase
    .from('giveaways')
    .select('*')
    .eq('status', 'active')
    .single();
}

export async function getGiveawayEntries(giveawayId: string) {
  return supabase
    .from('entries')
    .select('*')
    .eq('giveaway_id', giveawayId);
} 