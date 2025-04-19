import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="p-6 relative flex-1">
          <div className="pt-10 flex flex-col justify-center items-center">
            <Skeleton className="h-12 w-[300px] mb-2" />
            <Skeleton className="h-12 w-[300px] mb-4" />
            <Skeleton className="h-4 w-[250px] mb-2" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <Skeleton className="absolute top-1/4 right-0 -translate-y-1/4 w-1/2 max-w-xl h-[300px]" />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}