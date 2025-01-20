'use client';

interface PreviewOverlayProps {
  prize: string;
  entries?: number;
  winner?: string;
}

export function PreviewOverlay({ prize, entries = 0, winner }: PreviewOverlayProps) {
  return (
    <div className="w-full h-[400px] bg-gray-900/50 rounded-lg border border-gray-800 relative overflow-hidden">
      {/* Simulated OBS viewport */}
      <div className="absolute inset-0 flex items-center justify-center font-['Orbitron']">
        <div className="relative w-full max-w-3xl p-6 overflow-hidden">
          <div className="relative p-8 rounded-2xl bg-gradient-to-br from-cyber-bg-light to-cyber-bg-dark border-2 border-cyber-border">
            <div className="absolute inset-[-2px] bg-gradient-to-r from-[#ff3d00] via-cyber-secondary to-cyber-primary animate-border-flow opacity-30 rounded-2xl" />
            
            <div className="relative z-10 space-y-4">
              <h1 className="text-5xl font-bold text-center uppercase tracking-wider">
                <span className="inline-block bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-primary bg-clip-text text-transparent animate-text-gradient">
                  {prize}
                </span>
              </h1>

              {winner ? (
                <h2 className="text-3xl text-center animate-winner-entrance">
                  Winner:{' '}
                  <span className="inline-block bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-accent bg-[length:200%_auto] bg-clip-text text-transparent animate-winner-gradient font-semibold tracking-wide">
                    {winner}
                  </span>
                </h2>
              ) : (
                <h2 className="text-2xl text-center text-white/90">
                  <span className="inline-block mr-2 bg-gradient-to-r from-cyber-primary to-cyber-secondary bg-clip-text text-transparent animate-count-pop">
                    {entries}
                  </span>
                  Entries
                </h2>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 