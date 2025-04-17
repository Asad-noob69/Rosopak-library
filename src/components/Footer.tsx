import Image from "next/image";

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full h-10 border-t flex items-center justify-center py-2 bg-[#F0F1C5] z-3">
      <div className="flex items-center gap-2 text-sm text-black font-bold">
        <span>Developed by</span>
        <a href="https://www.rosopak.com/" target="_blank" rel="noopener noreferrer" className="relative h-8 w-8 rounded-full overflow-hidden">
          <Image src="/favicon.ico" alt="Logo" fill className="object-cover" priority />
        </a>
      </div>
    </footer>
  );
}