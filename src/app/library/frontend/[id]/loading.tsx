import { SidebarInset } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <SidebarInset className="p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Component header skeleton */}
        <div className="flex flex-col gap-4 mb-6">
          <Skeleton className="h-10 w-[250px] mx-auto mb-2" />
          <Skeleton className="h-6 w-[180px] mx-auto" />
        </div>

        {/* Code/Preview display area skeleton */}
        <div className="border rounded-lg overflow-hidden bg-muted">
          {/* Tab navigation skeleton */}
          <div className="bg-muted border-b flex">
            <Skeleton className="h-8 w-20 m-1" />
            <Skeleton className="h-8 w-20 m-1" />
          </div>
          
          {/* Content skeleton */}
          <div className="rounded-md overflow-hidden">
            <div className="bg-[#1E1E1E] rounded-t-md py-2 px-4 flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <Skeleton className="h-4 w-40 bg-gray-600" />
            </div>
            <div className="bg-[#1E1E1E] text-white p-4 h-[600px]">
              <div className="flex animate-pulse">
                <div className="pr-4 w-8">
                  {Array(20).fill(0).map((_, i) => (
                    <div key={i} className="h-5 w-4 bg-gray-700 mb-1 rounded"></div>
                  ))}
                </div>
                <div className="flex-1">
                  {Array(20).fill(0).map((_, i) => (
                    <div key={i} className="h-5 bg-gray-700 mb-1 rounded" 
                         style={{ width: `${Math.floor(Math.random() * 70) + 30}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex justify-end mt-4 gap-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </SidebarInset>
  );
}