import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="border-b border-background bg-gray-800 backdrop-blur-2xl">
          <div className="mx-auto flex h-8 w-full max-w-6xl items-center justify-between px-4">
            <Link href={"/"} className="text-bold tracking-wider text-sm">Event Planner</Link>
            <nav className="flex items-center gap-4">
              <Link href={"/dashboard"}>Dashboard</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto flex flex-col w-full grow px-4 py-4 max-w-6xl">
          {children}
        </main>
      </body>
    </html>
  );
}
