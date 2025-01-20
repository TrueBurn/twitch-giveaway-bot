import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orokin-900 bg-orokin-pattern">
      <div className="text-center space-y-8 p-8 rounded-lg bg-black/40 backdrop-blur-sm border border-energy-gold/20">
        <h1 className="text-5xl font-bold text-energy-gold">
          Warframe Giveaway Bot
        </h1>
        <p className="text-xl text-energy-white/80">
          Manage your Twitch giveaways with Tenno style
        </p>
        <div className="space-x-4">
          <Link href="/admin">
            <Button 
              size="lg"
              className="bg-energy-blue/20 hover:bg-energy-blue/30 border border-energy-blue/50 text-energy-white"
            >
              Enter the Void
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
