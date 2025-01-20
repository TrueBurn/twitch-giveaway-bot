import { AdminLayout } from '@/components/layout/admin-layout';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your giveaway activities
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">Active Giveaway</h3>
            {/* Active giveaway stats will go here */}
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">Total Entries</h3>
            {/* Entry stats will go here */}
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">Recent Winners</h3>
            {/* Recent winners will go here */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 