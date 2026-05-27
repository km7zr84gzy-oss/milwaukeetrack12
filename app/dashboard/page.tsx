'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Package, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Shipment {
  id: string;
  trackingNumber: string;
  carrier: string;
  status: string;
  origin?: string;
  destination?: string;
  estimatedDelivery?: string;
  createdAt: string;
  events?: Array<any>;
}

export default function Dashboard() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    trackingNumber: '',
    carrier: 'FedEx',
    origin: '',
    destination: '',
    estimatedDelivery: '',
  });

  const loadShipments = async () => {
    try {
      const res = await fetch('/api/shipments');
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      const data = await res.json();
      setShipments(data);
    } catch (e) {
      toast.error('Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to create');

      toast.success('Shipment created');
      setShowForm(false);
      setForm({ trackingNumber: '', carrier: 'FedEx', origin: '', destination: '', estimatedDelivery: '' });
      loadShipments();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-[#888]">Manage and monitor your shipments</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus className="w-4 h-4" /> New Shipment
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-[#111] border border-[#222] rounded-2xl p-8 mb-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          <input className="input" placeholder="Tracking Number" value={form.trackingNumber} onChange={e => setForm({ ...form, trackingNumber: e.target.value })} required />
          <input className="input" placeholder="Carrier (FedEx, UPS, USPS...)" value={form.carrier} onChange={e => setForm({ ...form, carrier: e.target.value })} required />
          <input className="input" placeholder="Origin City" value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} />
          <input className="input" placeholder="Destination City" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} />
          <input type="datetime-local" className="input" value={form.estimatedDelivery} onChange={e => setForm({ ...form, estimatedDelivery: e.target.value })} />
          <div className="flex gap-3 md:col-span-2">
            <button type="submit" className="btn btn-primary">Create Shipment</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-20 text-[#666]">Loading shipments...</div>
      ) : shipments.length === 0 ? (
        <div className="text-center py-20 border border-[#222] rounded-2xl bg-[#111]">
          <Package className="w-10 h-10 mx-auto text-[#333] mb-4" />
          <p className="text-lg">No shipments yet</p>
          <p className="text-sm text-[#666] mt-1">Create your first shipment using the button above.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {shipments.map((s) => (
            <div key={s.id} className="tracking-card bg-[#111] border border-[#222] rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="font-mono tracking-[2px] text-lg">{s.trackingNumber}</div>
                <div className="text-sm text-[#888]">{s.carrier} • Created {new Date(s.createdAt).toLocaleDateString()}</div>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <div className={`status-badge status-${s.status.toLowerCase().replace(/\s+/g, '_')}`}>{s.status}</div>
                </div>
                <div className="text-right text-sm">
                  {s.destination && <div className="text-[#888]">To {s.destination}</div>}
                  {s.estimatedDelivery && (
                    <div className="flex items-center justify-end gap-1 text-[#0066ff]">
                      <Clock className="w-3.5 h-3.5" /> {new Date(s.estimatedDelivery).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <Link href={`/api/track?number=${s.trackingNumber}`} className="btn btn-secondary text-sm px-4 py-2">View Public</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 text-xs text-[#555] text-center">
        All data stored in Aurora PostgreSQL • Emails sent via Amazon SES
      </div>
    </div>
  );
}
