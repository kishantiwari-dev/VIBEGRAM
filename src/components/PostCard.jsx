import { useState } from "react";

function PostCard({ post }) {

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }

    setLiked(!liked);
  };

  return (
    <article className="post-card">

      {/* User information */}
      <div className="post-user">

        <div className="profile-avatar">
          {post.username.charAt(0).toUpperCase()}
        </div>

        <div>
          <h4>{post.name}</h4>
          <span>@{post.username}</span>
        </div>

      </div>

      {/* Caption */}
      <p className="post-caption">
        {post.caption}
      </p>

      {/* Image */}
      <img
        src={post.image}
        alt="Post"
        className="post-image"
      />

      {/* Actions */}
      <div className="post-actions">

        <button
          onClick={handleLike}
          className={liked ? "liked" : ""}
        >
          {liked ? "❤️" : "♡"} {likes}
        </button>

        <button>
          💬 {post.comments}
        </button>

        <button className="share-button">
          ↗ Share
        </button>

      </div>

    </article>
  );
}

export default PostCard;