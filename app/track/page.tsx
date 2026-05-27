'use client';

import React, { useState, Suspense } from 'react';
import { Search, Package, Clock, MapPin, Truck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

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

function TrackContent() {
  const searchParams = useSearchParams();
  const initialNumber = searchParams.get('number') || '';

  const [trackingNumber, setTrackingNumber] = useState(initialNumber);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState('');

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

  // Auto-track if number was passed in query (e.g. from dashboard "View Public")
  React.useEffect(() => {
    if (initialNumber && !result && !loading) {
      setTrackingNumber(initialNumber);
      // Small delay so state settles
      setTimeout(() => handleTrack(), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialNumber]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="flex items-center gap-2 text-sm text-[#888] hover:text-[#ddd]">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-5xl font-semibold tracking-tighter mb-3">Track a Shipment</h1>
        <p className="text-[#888]">Enter the tracking number below for real-time status and history.</p>
      </div>

      <form onSubmit={handleTrack} className="max-w-xl mx-auto mb-12">
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
      </form>

      {error && (
        <div className="max-w-xl mx-auto mb-12">
          <div className="bg-[#1a0a0a] border border-[#3a1a1a] rounded-xl p-6 text-center">
            <p className="text-[#ef4444]">{error}</p>
            <p className="text-sm text-[#666] mt-2">Double-check the tracking number or contact support.</p>
          </div>
        </div>
      )}

      {result && (
        <div className="max-w-3xl mx-auto">
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
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#666]">Loading tracking...</div>}>
      <TrackContent />
    </Suspense>
  );
}
