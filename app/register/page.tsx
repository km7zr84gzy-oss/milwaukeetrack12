'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      toast.success('Account created! Signing you in...');

      // Auto sign-in after registration
      const signInRes = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      // Use next-auth signin via credentials
      const { signIn } = await import('next-auth/react');
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 pt-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">Create account</h1>
        <p className="text-[#888] mt-2">Start tracking shipments for your team</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-[#111] border border-[#222] rounded-2xl p-8">
        <div>
          <label className="block text-sm mb-1.5 text-[#888]">Full name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" placeholder="Alex Rivera" />
        </div>
        <div>
          <label className="block text-sm mb-1.5 text-[#888]">Work email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input" placeholder="you@company.com" />
        </div>
        <div>
          <label className="block text-sm mb-1.5 text-[#888]">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} className="input" placeholder="••••••••" />
          <p className="text-[11px] text-[#555] mt-1.5">Minimum 8 characters</p>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2 disabled:opacity-70">
          {loading ? 'Creating account...' : 'Create account & continue'}
        </button>

        <div className="text-center text-sm pt-4 border-t border-[#222]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#0066ff] hover:underline">Sign in</Link>
        </div>
      </form>
    </div>
  );
}
