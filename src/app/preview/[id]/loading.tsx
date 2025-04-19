import { Skeleton } from "@/components/ui/skeleton";

export default function PreviewLoading() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Skeleton className="h-10 w-[250px] mx-auto mb-8" />
      
      <div className="w-full border rounded-lg p-4 min-h-[500px] bg-white shadow-sm">
        <div className="animate-pulse flex flex-col items-center justify-center h-full">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-8 w-1/2 mb-8" />
          <div className="space-y-3 w-full max-w-2xl">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}