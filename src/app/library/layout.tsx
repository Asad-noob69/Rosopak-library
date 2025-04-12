import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

// =========================================================
// LIBRARY LAYOUT
// =========================================================
// This layout will be applied to all routes under /library
// It wraps all children in the SidebarProvider and includes the AppSidebar
// The layout ensures consistent UI across all library pages
// =========================================================
export default function LibraryLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        {children}
      </div>
    </SidebarProvider>
  )
}