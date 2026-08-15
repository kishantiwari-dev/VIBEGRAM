import { useState } from 'react';
import Navigation from '../components/Navigation';
import { searchUsers } from '../services/userService';
import '../assets/social.css';
export default function SearchPage({ user, path, navigate, onLogout }) {
  const [query, setQuery] = useState(''); const [results, setResults] = useState([]); const [error, setError] = useState('');
  const submit = async (e) => { e.preventDefault(); try { setError(''); const data = await searchUsers(user.token, query); setResults(data.users); } catch (err) { setError(err.message); } };
  return <div className="home-page"><Navigation {...{ user, path, navigate, onLogout }} /><main className="social-container"><h1>Search</h1><form className="search-form" onSubmit={submit}><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users..." /><button className="create-post-btn">Search</button></form>{error && <p className="feed-error">{error}</p>}<div className="result-list">{results.map((result) => <button className="user-result" key={result._id} onClick={() => navigate(`/profile/${result.username}`)}>{result.profileImage ? <img src={result.profileImage} alt="" /> : <div className="profile-avatar">{result.username[0].toUpperCase()}</div>}<span><strong>{result.name}</strong><small>@{result.username}</small>{result.bio && <em>{result.bio}</em>}</span></button>)}</div></main></div>;
}
