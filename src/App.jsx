import React, { useState } from 'react';
import { Login } from './pages/Login';
import Home from './pages/Home';

export function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (user) {
    return <Home user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-zinc-950 text-zinc-100 p-6 selection:bg-rose-900/40">

      <header className="w-full max-w-4xl mx-auto py-4 flex items-center justify-between">
        <span className="text-lg font-bold tracking-tight text-white">
          Vibe<span className="text-rose-600">Gram</span>
        </span>
      </header>

      <main className="w-full my-auto py-8">
        <Login onLogin={handleLogin} />
      </main>

      <footer className="w-full max-w-4xl mx-auto py-4 text-center text-xs text-zinc-500 border-t border-zinc-900 flex items-center justify-between">
        <p>© 2026 VibeGram</p>

        <div className="flex gap-4">
          <a href="#privacy" className="hover:text-zinc-300">
            Privacy
          </a>

          <a href="#terms" className="hover:text-zinc-300">
            Terms
          </a>
        </div>
      </footer>

    </div>
  );
}