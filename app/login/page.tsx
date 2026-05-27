'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error('Invalid email or password');
    } else {
      toast.success('Welcome back');
      router.push('/dashboard');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-6 pt-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-[#888] mt-2">Access your MilwaukeeTrack dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-[#111] border border-[#222] rounded-2xl p-8">
        <div>
          <label className="block text-sm mb-1.5 text-[#888]">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            className="input" 
            placeholder="you@company.com" 
          />
        </div>
        <div>
          <label className="block text-sm mb-1.5 text-[#888]">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            className="input" 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="btn btn-primary w-full mt-2 disabled:opacity-70"
        >
          {loading ? 'Signing in...' : 'Sign in to Dashboard'}
        </button>

        <div className="text-center text-sm pt-4 border-t border-[#222]">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#0066ff] hover:underline">Create one</Link>
        </div>
      </form>

      <p className="text-center text-xs text-[#555] mt-8">
        Demo accounts can be created via the registration page.
      </p>
    </div>
  );
}
