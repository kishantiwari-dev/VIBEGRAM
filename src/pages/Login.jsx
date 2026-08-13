import React, { useState } from 'react';
import { LockAnimation } from '../components/LockAnimation';

export function Login({ onLogin }) {
  const [username, setUsername] = useState('kishan');
  const [password, setPassword] = useState('1234');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (status === 'loading') return;

    setErrorMessage('');
    setStatus('loading');

    // Simulate network delay
    setTimeout(() => {
      if (
        username.trim().toLowerCase() === 'kishan' &&
        password === '1234'
      ) {
        setStatus('success');

        // Send logged-in user to App.jsx
        setTimeout(() => {
          onLogin({
            username: 'kishan',
            name: 'Kishan'
          });
        }, 900);

      } else {
        setStatus('error');
        setErrorMessage('Invalid credentials');

        setTimeout(() => {
          setStatus('idle');
        }, 1800);
      }
    }, 600);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">

      {/* Wordmark Header */}
      <div className="mb-4 text-center">
        <span className="text-2xl font-black text-white tracking-tight font-sans">
          Vibe<span className="text-[#8B1E3F]">Gram</span>
        </span>
      </div>

      {/* Lock Animation */}
      <LockAnimation status={status} />

      {/* Headline */}
      <div className="text-center mt-2 mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
          Find your people.
        </h1>

        <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
          VibeGram learns from what you enjoy and helps you discover people who resonate with you.
        </p>
      </div>

      {/* Login Form */}
      <div
        className={`w-full p-6 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl ${
          status === 'error'
            ? 'animate-error-shake border-rose-900/60'
            : ''
        }`}
      >

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs font-medium text-center">
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          noValidate
        >

          {/* Username */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Email or username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={status === 'loading'}
              placeholder="kishan"
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-[#8B1E3F] transition-colors"
              required
            />
          </div>

          {/* Password */}
          <div>

            <div className="flex items-center justify-between mb-1.5">

              <label className="block text-xs font-medium text-zinc-300">
                Password
              </label>

              <a
                href="#forgot"
                className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Forgot password?
              </a>

            </div>

            <div className="relative">

              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={status === 'loading'}
                placeholder="1234"
                className="w-full px-3.5 py-2.5 pr-12 bg-zinc-950 border border-zinc-800 rounded-lg text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-[#8B1E3F] transition-colors"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-xs text-zinc-400 hover:text-zinc-200"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>

            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-2.5 px-4 bg-[#8B1E3F] hover:bg-[#a3254d] text-white text-xs sm:text-sm font-medium rounded-lg transition-colors disabled:opacity-50 mt-2"
          >
            {status === 'loading'
              ? 'Signing in...'
              : 'Sign in'}
          </button>

        </form>

        {/* Create Account */}
        <div className="mt-5 text-center text-xs text-zinc-400 pt-4 border-t border-zinc-800/80">

          Don't have an account?{' '}

          <a
            href="#signup"
            className="text-[#a3254d] hover:text-rose-300 font-medium"
          >
            Create account
          </a>

        </div>

      </div>

    </div>
  );
}