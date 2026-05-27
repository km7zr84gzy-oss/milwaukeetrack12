import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { auth } from '@/auth';
import Link from 'next/link';
import { LogOut, Package, User } from 'lucide-react';
import { signOut } from '@/auth';

// Force dynamic rendering for the entire app.
// This prevents Next.js from trying to statically render pages (including the auto-generated _not-found)
// during build when PrismaClient is instantiated at module level.
// Required for Prisma 7 + classic direct Postgres connection during `npm run build`.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'MilwaukeeTrack - Professional Shipment Tracking',
  description: 'Real-time shipment tracking and management powered by Aurora PostgreSQL',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-[#ededed] min-h-screen">
        <header className="header sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#0066ff] rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold tracking-tight text-lg">MilwaukeeTrack</div>
                <div className="text-[10px] text-[#666] -mt-1">PROFESSIONAL LOGISTICS</div>
              </div>
            </Link>

            <nav className="flex items-center gap-6 text-sm">
              <Link href="/" className="hover:text-[#0066ff] transition">Track</Link>
              <Link href="/dashboard" className="hover:text-[#0066ff] transition">Dashboard</Link>
              
              {session ? (
                <div className="flex items-center gap-4 pl-4 border-l border-[#222]">
                  <div className="flex items-center gap-2 text-sm text-[#888]">
                    <User className="w-4 h-4" />
                    {session.user?.email}
                  </div>
                  <form action={async () => { 'use server'; await signOut(); }}>
                    <button type="submit" className="btn btn-secondary text-sm px-4 py-1.5 flex items-center gap-1.5">
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </form>
                </div>
              ) : (
                <Link href="/login" className="btn btn-primary text-sm px-5 py-1.5">Sign in</Link>
              )}
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t border-[#222] mt-24 py-8 text-center text-xs text-[#666]">
          MilwaukeeTrack • Powered by Aurora PostgreSQL • Deployed on AWS Amplify
        </footer>

        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
