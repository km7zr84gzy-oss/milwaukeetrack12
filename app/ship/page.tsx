'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck } from 'lucide-react';

export default function ShipPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="flex items-center gap-2 text-sm text-[#888] hover:text-[#ddd]">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
      </div>

      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#111] border border-[#222] mb-6">
          <Truck className="w-8 h-8 text-[#0066ff]" />
        </div>
        <h1 className="text-5xl font-semibold tracking-tighter mb-4">Ship with MilwaukeeTrack</h1>
        <p className="text-xl text-[#888] max-w-md mx-auto">
          Create and manage shipments from a single professional dashboard.
        </p>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-2xl p-10 text-center">
        <p className="text-lg mb-6">Ready to create your first shipment?</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="btn btn-primary text-base px-8">
            Create a free account
          </Link>
          <Link href="/login" className="btn btn-secondary text-base px-8">
            Sign in to dashboard
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-[#222] text-sm text-[#666]">
          Already have shipments? Go to your <Link href="/dashboard" className="text-[#0066ff] hover:underline">Dashboard</Link> to create new ones and track them.
        </div>
      </div>

      <div className="mt-12 text-xs text-center text-[#555]">
        Pro tip: After logging in, use the “New Shipment” button on the dashboard to register packages instantly.
      </div>
    </div>
  );
}
