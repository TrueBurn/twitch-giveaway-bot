"use client";

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Giveaways', href: '/admin/giveaways' },
  { name: 'Settings', href: '/admin/settings' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-orokin-900 bg-orokin-pattern">
      <nav className="border-b border-energy-gold/20 bg-black/40 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <span className="text-xl font-bold text-energy-gold">Giveaway Bot</span>
              </div>
              <div className="ml-6 flex space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors',
                      pathname === item.href
                        ? 'border-energy-blue text-energy-white'
                        : 'border-transparent text-energy-white/60 hover:border-energy-gold/50 hover:text-energy-white'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-energy-gold/20 bg-black/40 backdrop-blur-sm p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 