import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export type AuthUser = {
  id: string;
  twitchId: string;
  username: string;
  isAdmin: boolean;
  isModerator: boolean;
};

export async function signInWithTwitch() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'twitch',
    options: {
      scopes: 'user:read:email channel:moderate chat:edit chat:read',
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  redirect('/');
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return null;

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('twitch_id', session.user.user_metadata.provider_id)
    .single();

  if (!user) return null;

  return {
    id: user.id,
    twitchId: user.twitch_id,
    username: user.username,
    isAdmin: user.is_admin,
    isModerator: user.is_moderator,
  };
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) redirect('/');
  return user;
} 