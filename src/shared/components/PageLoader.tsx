import { Loader2 } from "lucide-react";

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <Loader2 size={36} className="mx-auto animate-spin text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}
