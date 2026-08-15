import { Home, Search, Clapperboard, UserRound, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';
import '../assets/social.css';
const links = [{ path: '/', label: 'Home', icon: Home }, { path: '/search', label: 'Search', icon: Search }, { path: '/reels', label: 'Reels', icon: Clapperboard }];
export default function Navigation({ user, path, navigate, onLogout }) {
  const [open, setOpen] = useState(false);
  const go = (target) => { setOpen(false); navigate(target); };
  return <nav className="home-navbar app-navigation"><button className="brand brand-button" onClick={() => go('/') }><span>Vibe</span>Gram</button><div className="nav-links">{links.map(({ path: target, label, icon: Icon }) => <button key={target} className={path === target ? 'active' : ''} onClick={() => go(target)}><Icon size={17} /> <span>{label}</span></button>)}</div><div className="user-menu-wrap"><button className="user-menu-trigger" onClick={() => setOpen(!open)} aria-expanded={open}><UserRound size={18} /><span>@{user.username}</span></button>{open && <div className="user-menu"><button onClick={() => go(`/profile/${user.username}`)}><UserRound size={16} /> Profile</button><button onClick={() => go('/settings')}><Settings size={16} /> Settings</button><button onClick={() => { setOpen(false); onLogout(); }}><LogOut size={16} /> Logout</button></div>}</div></nav>;
}
