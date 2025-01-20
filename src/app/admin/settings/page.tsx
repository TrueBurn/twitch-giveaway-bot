"use client";

import Link from 'next/link';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your bot and giveaway settings
          </p>
        </div>

        <div className="grid gap-6">
          <div className="rounded-lg border">
            <div className="p-6">
              <h3 className="text-lg font-semibold">Bot Settings</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Configure your Twitch bot settings and behavior
              </p>
              <div className="mt-4 space-y-4">
                {/* Bot settings form will go here */}
              </div>
            </div>
          </div>

          <div className="rounded-lg border">
            <div className="p-6">
              <h3 className="text-lg font-semibold">Role Management</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Manage admin and moderator permissions for users
              </p>
              <div className="mt-4">
                <Link href="/admin/settings/roles">
                  <Button>Manage Roles</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-red-50 dark:bg-red-900/10">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
                Danger Zone
              </h3>
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                Careful - these actions cannot be undone
              </p>
              <div className="mt-4">
                <Button variant="destructive">
                  Reset All Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 