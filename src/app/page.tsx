import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="p-6 relative">
          {/* Floating button that appears when sidebar is closed */}
          <div className="absolute top-4 left-4">
            <SidebarTrigger />
          </div>
          <div className="pt-10">
            <h1 className="text-2xl font-bold mb-4">Welcome to Rosopak Library</h1>
            <p>This is a demonstration of the sidebar component with proper content.</p>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}