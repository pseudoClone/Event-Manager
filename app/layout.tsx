import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { NeonAuthUIProvider, UserButton } from "@neondatabase/auth/react";
import { authClient } from "@/lib/auth/client";

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
      suppressHydrationWarning
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NeonAuthUIProvider authClient={authClient} credentials={{ forgotPassword: true }}>
          <header className="border-b border-background bg-gray-800 backdrop-blur-2xl">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 h-16">
              <Link href={"/"} className="text-bold tracking-wider text-sm">Event Planner</Link>
              <nav className="flex items-center gap-4">
                <Link href={"/dashboard"}>
                  Dashboard
                </Link>
                <UserButton size="icon" />
              </nav>
            </div>
          </header>
          <main className="mx-auto flex flex-col w-full grow px-4 py-4 max-w-6xl">
            {children}
          </main>
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
