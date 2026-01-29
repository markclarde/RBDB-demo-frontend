'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      triggerShake();
      return;
    }

    const success = login(username, password);
    if (!success) {
      setError('Invalid credentials');
      triggerShake();
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center noise-texture bg-[#1a1d29] p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#fafaf9] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-8 fade-in-scale">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0891b2] rounded-lg mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#1a1d29] mb-2">
              Sales Representative System
            </h1>
            <p className="text-sm text-slate-600">
              Sign in to manage client requests
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#1a1d29] font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="bg-white border-slate-300 text-[#1a1d29]"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#1a1d29] font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-white border-slate-300 text-[#1a1d29]"
              />
            </div>

            {error && (
              <div
                className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm ${
                  isShaking ? 'shake' : ''
                }`}
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#0891b2] hover:bg-[#0e7490] text-white font-medium h-11"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 p-4 bg-slate-100 rounded text-xs text-slate-700 space-y-1">
            <p className="font-medium mb-2">Demo Credentials:</p>
            <p><strong>Admin:</strong> admin / admin123</p>
            <p><strong>Sales Rep:</strong> john / john123 or sarah / sarah123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
