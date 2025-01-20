import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giveaway Overlay',
  description: 'Twitch Giveaway Bot Overlay',
};

export default function OverlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-transparent">
      {children}
    </div>
  );
} 