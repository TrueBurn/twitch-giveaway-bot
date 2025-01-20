import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/providers/auth-provider';
import './globals.css';
import { ToastContainer } from '@/components/ui/toast';
import { ErrorBoundary } from '@/components/error-boundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Twitch Giveaway Bot',
  description: 'A serverless Twitch bot for managing stream giveaways',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <ErrorBoundary>
          <AuthProvider>
            {children}
            <ToastContainer />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}