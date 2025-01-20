import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Twitch Giveaway Bot</h1>
        <p className="text-xl text-muted-foreground">
          Manage your Twitch giveaways with ease
        </p>
        <div className="space-x-4">
          <Link href="/admin">
            <Button size="lg">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
