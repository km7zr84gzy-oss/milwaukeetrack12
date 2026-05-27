'use client';

import React, { useState } from 'react';
import { Search, Package, Clock, MapPin, Truck } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface TrackingResult {
  trackingNumber: string;
  status: string;
  origin?: string;
  destination?: string;
  estimatedDelivery?: string;
  events: Array<{
    status: string;
    location?: string;
    description: string;
    timestamp: string;
  }>;
}

export default function Home() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/track?number=${encodeURIComponent(trackingNumber.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Tracking number not found');
      }

      setResult(data);
      toast.success('Shipment found');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#111] border border-[#222] text-sm mb-6">
          <div className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
          Powered by Aurora PostgreSQL
        </div>

        <h1 className="text-6xl font-semibold tracking-tighter mb-4">
          Track every shipment.<br />In real time.
        </h1>
        <p className="text-xl text-[#888] max-w-md mx-auto mb-10">
          Professional logistics visibility for Milwaukee and beyond.
        </p>

        {/* Tracking Form */}
        <form onSubmit={handleTrack} className="max-w-xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
              placeholder="Enter tracking number (e.g. 1Z9999999999999999)"
              className="input flex-1 text-lg"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !trackingNumber.trim()}
              className="btn btn-primary px-8 text-lg disabled:opacity-60"
            >
              {loading ? 'Searching...' : <><Search className="w-5 h-5" /> Track</>}
            </button>
          </div>
          <p className="text-xs text-[#555] mt-3">Public tracking • No sign-in required</p>
        </form>
      </div>

      {/* Results */}
      {error && (
        <div className="max-w-xl mx-auto px-6 mb-12">
          <div className="bg-[#1a0a0a] border border-[#3a1a1a] rounded-xl p-6 text-center">
            <p className="text-[#ef4444]">{error}</p>
            <p className="text-sm text-[#666] mt-2">Double-check the tracking number or contact support.</p>
          </div>
        </div>
      )}

      {result && (
        <div className="max-w-3xl mx-auto px-6 mb-16">
          <div className="tracking-card bg-[#111] border border-[#222] rounded-2xl p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-[#0066ff]" />
                  <div>
                    <div className="text-sm text-[#888]">TRACKING NUMBER</div>
                    <div className="font-mono text-2xl tracking-[3px]">{result.trackingNumber}</div>
                  </div>
                </div>
              </div>
              <span className={`status-badge status-${result.status.toLowerCase().replace(/\s+/g, '_')}`}>
                {result.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-[#222]">
              {result.origin && (
                <div>
                  <div className="text-xs text-[#666] mb-1">ORIGIN</div>
                  <div className="font-medium">{result.origin}</div>
                </div>
              )}
              {result.destination && (
                <div>
                  <div className="text-xs text-[#666] mb-1">DESTINATION</div>
                  <div className="font-medium">{result.destination}</div>
                </div>
              )}
              {result.estimatedDelivery && (
                <div>
                  <div className="text-xs text-[#666] mb-1">ESTIMATED DELIVERY</div>
                  <div className="font-medium flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {new Date(result.estimatedDelivery).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8">
              <div className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4" /> SHIPMENT HISTORY
              </div>
              <div className="space-y-4">
                {result.events.length > 0 ? (
                  result.events.map((event, idx) => (
                    <div key={idx} className="flex gap-4 text-sm border-l-2 border-[#222] pl-4 pb-1">
                      <div className="w-28 text-[#666] tabular-nums pt-px">
                        {new Date(event.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}<br />
                        <span className="text-[11px]">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{event.status}</div>
                        <div className="text-[#888]">{event.description}</div>
                        {event.location && (
                          <div className="flex items-center gap-1 text-xs text-[#0066ff] mt-1">
                            <MapPin className="w-3 h-3" /> {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-[#666]">No events recorded yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features / CTA */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#111] border border-[#222] rounded-2xl p-8">
            <h3 className="font-semibold mb-2">Real-time Updates</h3>
            <p className="text-[#888] text-sm">Live status changes pushed directly from carrier APIs and our warehouse systems.</p>
          </div>
          <div className="bg-[#111] border border-[#222] rounded-2xl p-8">
            <h3 className="font-semibold mb-2">Team Access</h3>
            <p className="text-[#888] text-sm">Secure logins for your entire logistics team. Role-based permissions coming soon.</p>
            <Link href="/register" className="inline-block mt-4 text-sm text-[#0066ff]">Create an account →</Link>
          </div>
          <div className="bg-[#111] border border-[#222] rounded-2xl p-8">
            <h3 className="font-semibold mb-2">Email Notifications</h3>
            <p className="text-[#888] text-sm">Automatic alerts via Amazon SES when shipments move or experience delays.</p>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link href="/login" className="btn btn-secondary">Access your dashboard</Link>
        </div>
      </div>
    </div>
  );
}
