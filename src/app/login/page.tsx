'use client';

import { useState } from 'react';
import { signInWithTwitch } from '@/lib/auth/auth-utils';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithTwitch();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sign in to Giveaway Bot
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage your Twitch giveaways
          </p>
        </div>

        <div className="mt-8">
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-[#9146FF] hover:bg-[#7c2cf1]"
          >
            {isLoading ? (
              'Connecting...'
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                </svg>
                <span>Sign in with Twitch</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 