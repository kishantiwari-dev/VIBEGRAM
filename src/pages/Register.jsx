import React, { useState } from 'react';
import { LockAnimation } from '../components/LockAnimation';
import { registerUser } from '../services/auth';

export function Register({ onLogin, onGoToLogin }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;

    setErrorMessage('');
    setStatus('loading');

    try {
      const userData = await registerUser(name, username, email, password);
      setStatus('success');

      // Give the lock time to animate open before transitioning
      setTimeout(() => {
        onLogin(userData);
      }, 900);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Registration failed. Please try again.');
      setTimeout(() => setStatus('idle'), 1800);
    }
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
          Join VibeGram.
        </h1>

        <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
          Create your account and start discovering people on your wavelength.
        </p>
      </div>

      {/* Register Form */}
      <div
        className={`w-full p-6 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl ${
          status === 'error' ? 'animate-error-shake border-rose-900/60' : ''
        }`}
      >

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs font-medium text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={status === 'loading'}
              placeholder="Kishan Tiwari"
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-[#8B1E3F] transition-colors"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Username
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

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              placeholder="kishan@example.com"
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-[#8B1E3F] transition-colors"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={status === 'loading'}
                placeholder="At least 6 characters"
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

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-2.5 px-4 bg-[#8B1E3F] hover:bg-[#a3254d] text-white text-xs sm:text-sm font-medium rounded-lg transition-colors disabled:opacity-50 mt-2"
          >
            {status === 'loading' ? 'Creating account...' : 'Create account'}
          </button>

        </form>

        {/* Back to Login */}
        <div className="mt-5 text-center text-xs text-zinc-400 pt-4 border-t border-zinc-800/80">
          Already have an account?{' '}

          <button
            type="button"
            onClick={onGoToLogin}
            className="text-[#a3254d] hover:text-rose-300 font-medium"
          >
            Sign in
          </button>
        </div>

      </div>
    </div>
  );
}
