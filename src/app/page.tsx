import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import dynamic from "next/dynamic";


export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="p-6 relative flex-1">
          {/* Floating button that appears when sidebar is closed */}
          <div className="absolute top-4 left-4 z-10"> {/* Added z-10 to ensure it's on top */}
            <SidebarTrigger />
          </div>
          <div className="pt-10 flex flex-col justify-center items-center">
            <h1 className="text-5xl font-bold mb-2 font-[CooperBT] text-center z-10">A Human Touch <br />in Every Component.</h1>
            <p className="font-sm font-[CooperBT] text-black text-center z-10">Human-centered design, now readily available<br /> for our ROSOPAK developers.</p>
          </div>

          <video
            src="/images/leaf.webm"
            className="absolute top-2/3 right-0 -translate-y-1/2 w-1/2 max-w-xl"
            autoPlay
            loop
            muted
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}