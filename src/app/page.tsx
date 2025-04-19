import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import dynamic from "next/dynamic";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <SidebarInset className="p-6 relative flex-1">
            <div className="pt-10 flex flex-col justify-center items-center">
              <h1 className="text-5xl font-bold mb-2 font-[CooperBT] text-center z-10">A Human Touch <br />in Every Component.</h1>
              <p className="font-sm font-[CooperBT] text-black text-center z-10">Human-centered design, now readily available<br /> for our ROSOPAK developers.</p>
            </div>

            <div className="absolute top-1/4 right-0 -translate-y-1/4 w-full max-w-xl sm:w-1/2">
              <video
                src="/images/leaf.webm"
                className="w-full h-auto object-cover"
                autoPlay
                loop
                muted
              />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <Footer />
    </>
  );
}