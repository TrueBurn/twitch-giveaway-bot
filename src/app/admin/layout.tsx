import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Twitch Giveaway Bot',
  description: 'Manage your Twitch giveaways',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 