
import { Skeleton } from '@/components/ui/skeleton';

export function GamesLoading() {
  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto mt-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl overflow-hidden border border-border/50 bg-white">
          <Skeleton className="h-24 w-full" />
        </div>
      ))}
    </div>
  );
}
