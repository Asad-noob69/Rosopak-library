import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebarProvider } from "@/components/app-sidebar-context"
import { AppSidebar } from "@/components/app-sidebar"

/**
 * Components Layout
 * 
 * This layout wraps all component routes (/components/[type]/[id])
 * It provides:
 * 1. The SidebarProvider for sidebar functionality
 * 2. The AppSidebarProvider to share component data across the application
 * 3. Consistent layout with AppSidebar on the left and content on the right
 */
export default function ComponentsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          {children}
        </div>
      </AppSidebarProvider>
    </SidebarProvider>
  )
}