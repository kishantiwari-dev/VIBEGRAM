import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import PostCard from '../components/PostCard';
import { createReel, getReels } from '../services/reelService';
import { addComment, toggleLike } from '../services/postService';
import '../assets/social.css';
export default function Reels({ user, path, navigate, onLogout }) {
  const [reels, setReels] = useState([]); const [form, setForm] = useState({ caption: '', videoUrl: '' }); const [error, setError] = useState('');
  const load = async () => { try { setReels((await getReels(user.token)).reels); } catch (err) { setError(err.message); } };
  useEffect(() => { load(); }, []);
  const create = async (e) => { e.preventDefault(); try { const data = await createReel(user.token, form); setReels((all) => [data.reel, ...all]); setForm({ caption: '', videoUrl: '' }); } catch (err) { setError(err.message); } };
  const replace = (next) => setReels((all) => all.map((reel) => reel._id === next._id ? next : reel));
  return <div className="home-page"><Navigation {...{ user, path, navigate, onLogout }} /><main className="social-container reels-page"><h1>Reels</h1><form className="panel-form" onSubmit={create}><input value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} placeholder="Caption" required /><input type="url" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="Video URL (https://...)" required /><button className="create-post-btn">Create Reel</button></form>{error && <p className="feed-error">{error}</p>}<div className="reel-feed">{reels.map((reel) => <PostCard key={reel._id} post={reel} media={<video className="reel-video" controls preload="metadata" onError={(e) => { e.currentTarget.style.display = 'none'; }}>{reel.videoUrl && <source src={reel.videoUrl} />}</video>} onToggleLike={async (id) => replace((await toggleLike(user.token, id)).post)} onAddComment={async (id, text) => replace((await addComment(user.token, id, text)).post)} />)}</div></main></div>;
}
