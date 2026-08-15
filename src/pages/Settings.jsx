import { useState } from 'react';
import Navigation from '../components/Navigation';
import { changePassword } from '../services/userService';
import '../assets/social.css';
export default function Settings({ user, path, navigate, onLogout }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' }); const [message, setMessage] = useState('');
  const submit = async (e) => { e.preventDefault(); try { await changePassword(user.token, form); setForm({ currentPassword: '', newPassword: '' }); setMessage('Password updated successfully.'); } catch (err) { setMessage(err.message); } };
  return <div className="home-page"><Navigation {...{ user, path, navigate, onLogout }} /><main className="social-container"><h1>Settings</h1><section className="settings-card"><h2>Account information</h2><dl><dt>Name</dt><dd>{user.name}</dd><dt>Username</dt><dd>@{user.username}</dd><dt>Email</dt><dd>{user.email}</dd><dt>Bio</dt><dd>{user.bio || '—'}</dd><dt>Member since</dt><dd>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</dd></dl><button className="create-post-btn" onClick={() => navigate(`/profile/${user.username}`)}>Edit Profile</button></section><section className="settings-card"><h2>Change Password</h2><form className="panel-form" onSubmit={submit}><input type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} placeholder="Current password" required /><input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} placeholder="New password (6+ characters)" minLength="6" required /><button className="create-post-btn">Update password</button></form>{message && <p className="feed-error">{message}</p>}</section></main></div>;
}
