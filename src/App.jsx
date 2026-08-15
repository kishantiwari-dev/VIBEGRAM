import React, { useEffect, useState } from 'react';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import Home from './pages/Home';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Reels from './pages/Reels';
import Settings from './pages/Settings';

export function App() {
  // Restore user from localStorage so the session survives a page refresh
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vg_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Which auth view to show when logged out
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => { const update = () => setPath(window.location.pathname); window.addEventListener('popstate', update); return () => window.removeEventListener('popstate', update); }, []);
  const navigate = (target, replace = false) => { window.history[replace ? 'replaceState' : 'pushState']({}, '', target); setPath(target); };

  const handleLogin = (userData) => {
    localStorage.setItem('vg_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('vg_user');
    setUser(null);
    setAuthView('login');
  };
  const handleUserUpdate = (nextUser) => { localStorage.setItem('vg_user', JSON.stringify(nextUser)); setUser(nextUser); };

  if (user) {
    if (path === '/search') return <Search {...{ user, path, navigate, onLogout: handleLogout }} />;
    if (path === '/reels') return <Reels {...{ user, path, navigate, onLogout: handleLogout }} />;
    if (path === '/settings') return <Settings {...{ user, path, navigate, onLogout: handleLogout }} />;
    if (path.startsWith('/profile/')) return <Profile {...{ user, path, navigate, onLogout: handleLogout, onUserUpdate: handleUserUpdate }} username={decodeURIComponent(path.slice('/profile/'.length))} />;
    return <Home {...{ user, path, navigate, onLogout: handleLogout }} />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-zinc-950 text-zinc-100 p-6 selection:bg-rose-900/40">

      <header className="w-full max-w-4xl mx-auto py-4 flex items-center justify-between">
        <span className="text-lg font-bold tracking-tight text-white">
          Vibe<span className="text-rose-600">Gram</span>
        </span>
      </header>

      <main className="w-full my-auto py-8">
        {authView === 'login' ? (
          <Login
            onLogin={handleLogin}
            onGoToRegister={() => setAuthView('register')}
          />
        ) : (
          <Register
            onLogin={handleLogin}
            onGoToLogin={() => setAuthView('login')}
          />
        )}
      </main>

      <footer className="w-full max-w-4xl mx-auto py-4 text-center text-xs text-zinc-500 border-t border-zinc-900 flex items-center justify-between">
        <p>© 2026 VibeGram</p>
        <div className="flex gap-4">
          <a href="#privacy" className="hover:text-zinc-300">Privacy</a>
          <a href="#terms" className="hover:text-zinc-300">Terms</a>
        </div>
      </footer>

    </div>
  );
}
