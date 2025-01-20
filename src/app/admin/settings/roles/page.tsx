'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';

interface User {
  id: string;
  username: string;
  is_admin: boolean;
  is_moderator: boolean;
}

export default function RolesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const searchUsers = async () => {
    if (!username.trim()) return;
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, is_admin, is_moderator')
        .ilike('username', `%${username}%`)
        .limit(5);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRole = async (userId: string, updates: Partial<User>) => {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      ));
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground">
            Manage admin and moderator roles for users
          </p>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="p-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Search by username"
                className="flex-1 rounded-md border bg-background px-3 py-2"
              />
              <Button
                onClick={searchUsers}
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>

            <div className="mt-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-4 text-left">Username</th>
                    <th className="pb-4 text-left">Admin</th>
                    <th className="pb-4 text-left">Moderator</th>
                    <th className="pb-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-4">{user.username}</td>
                      <td className="py-4">
                        <input
                          type="checkbox"
                          checked={user.is_admin}
                          onChange={(e) => updateRole(user.id, { 
                            is_admin: e.target.checked 
                          })}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </td>
                      <td className="py-4">
                        <input
                          type="checkbox"
                          checked={user.is_moderator}
                          onChange={(e) => updateRole(user.id, { 
                            is_moderator: e.target.checked 
                          })}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </td>
                      <td className="py-4">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => updateRole(user.id, {
                            is_admin: false,
                            is_moderator: false
                          })}
                        >
                          Remove Roles
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {users.length === 0 && !isLoading && username && (
                <p className="py-4 text-center text-muted-foreground">
                  No users found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 