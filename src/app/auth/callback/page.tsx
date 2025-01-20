'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth error:', error);
        router.push('/login');
        return;
      }

      if (session) {
        // Create or update user in our database
        const { error: upsertError } = await supabase
          .from('users')
          .upsert({
            twitch_id: session.user.user_metadata.provider_id,
            username: session.user.user_metadata.preferred_username,
            // New users are not admins by default
            is_admin: false,
            is_moderator: false,
          }, {
            onConflict: 'twitch_id',
          });

        if (upsertError) {
          console.error('Error updating user:', upsertError);
        }

        router.push('/admin');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Completing sign in...</h2>
        <div className="mt-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    </div>
  );
} 