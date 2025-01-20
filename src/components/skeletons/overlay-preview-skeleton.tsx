import { Skeleton } from '@/components/ui/skeleton';

export function OverlayPreviewSkeleton() {
  return (
    <div className="w-full h-[400px] bg-gray-900/50 rounded-lg border border-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="space-y-4 w-full max-w-lg">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-8 w-1/2 mx-auto" />
        </div>
      </div>
    </div>
  );
} 