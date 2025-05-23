import type { Metadata } from "next";
import { Geist, Geist_Mono, Gothic_A1 } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gothicA1 = Gothic_A1({
  weight: ["800"],
  variable: "--font-gothic-a1",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rosopak Library",
  description: "Our Library for backend, frontend and best practices. Rosopak personal library.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${gothicA1.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
