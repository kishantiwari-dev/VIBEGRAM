import { useState } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';

function PostCard({ post, onToggleLike, onAddComment, media }) {
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const author = post.author || {};
  const initial = (author.username || author.name || 'V').charAt(0).toUpperCase();

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setErrorMessage('');
      await onToggleLike(post._id);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to update like.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (event) => {
    event.preventDefault();
    if (!commentText.trim() || isCommenting) return;
    try {
      setIsCommenting(true);
      setErrorMessage('');
      await onAddComment(post._id, commentText);
      setCommentText('');
      setShowComments(true);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to add comment.');
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <article className="post-card">
      <div className="post-user">
        {author.profileImage ? <img className="profile-avatar profile-image" src={author.profileImage} alt={`${author.username}'s profile`} /> : <div className="profile-avatar">{initial}</div>}
        <div><h4>{author.name || 'VibeGram member'}</h4><span>@{author.username || 'member'}</span></div>
      </div>
      <p className="post-caption">{post.caption}</p>
      {media || (post.imageUrl && <img src={post.imageUrl} alt="Post attachment" className="post-image" />)}
      <div className="post-actions">
        <button type="button" onClick={handleLike} className={post.isLiked ? 'liked' : ''} disabled={isLiking} aria-pressed={post.isLiked}><Heart size={18} fill={post.isLiked ? 'currentColor' : 'none'} /> {post.likes}</button>
        <button type="button" onClick={() => setShowComments((visible) => !visible)} aria-expanded={showComments}><MessageCircle size={18} /> {post.commentCount}</button>
        <time className="post-time" dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleDateString()}</time>
      </div>
      {errorMessage && <p className="post-error">{errorMessage}</p>}
      {showComments && (
        <div className="comments-panel">
          {post.comments.map((comment) => <div key={comment._id} className="comment-item"><strong>@{comment.author?.username || 'member'}</strong> <span>{comment.text}</span></div>)}
          <form className="comment-form" onSubmit={handleComment}>
            <input value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Add a comment..." maxLength="1000" disabled={isCommenting} required />
            <button type="submit" disabled={isCommenting || !commentText.trim()} aria-label="Post comment"><Send size={16} /></button>
          </form>
        </div>
      )}
    </article>
  );
}

export default PostCard;
