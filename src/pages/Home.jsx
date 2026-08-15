import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';

import Navigation from '../components/Navigation';
import PostCard from '../components/PostCard';

import {
  addComment,
  createPost,
  getPosts,
  toggleLike,
} from '../services/postService';

import '../assets/home.css';

function Home({ user, onLogout, path, navigate }) {
  const [posts, setPosts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Create post modal
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  // Post form
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --------------------------------------------------
  // LOAD POSTS
  // --------------------------------------------------

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const data = await getPosts(user.token);

      setPosts(data.posts || []);
    } catch (error) {
      setErrorMessage(
        error.message || 'Unable to load your feed.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // --------------------------------------------------
  // REPLACE UPDATED POST
  // --------------------------------------------------

  const replacePost = (updatedPost) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post._id === updatedPost._id
          ? updatedPost
          : post
      )
    );
  };

  // --------------------------------------------------
  // IMAGE SELECT
  // --------------------------------------------------

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Supported image types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(
        'Please select a JPEG, PNG, WEBP, or GIF image.'
      );

      event.target.value = '';
      return;
    }

    // Maximum 5 MB
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setErrorMessage(
        'Image size must be less than 5 MB.'
      );

      event.target.value = '';
      return;
    }

    setErrorMessage('');

    // Remove previous preview URL
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(previewUrl);
  };

  // --------------------------------------------------
  // REMOVE IMAGE
  // --------------------------------------------------

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview('');
  };

  // --------------------------------------------------
  // CLOSE COMPOSER
  // --------------------------------------------------

  const closeComposer = () => {
    if (isSubmitting) {
      return;
    }

    handleRemoveImage();

    setCaption('');
    setErrorMessage('');
    setIsComposerOpen(false);
  };

  // --------------------------------------------------
  // CREATE POST
  // --------------------------------------------------

  const handleCreatePost = async (event) => {
    event.preventDefault();

    if (!caption.trim() || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const data = await createPost(user.token, {
        caption: caption.trim(),
        imageFile,
      });

      // Add new post to beginning of feed
      setPosts((currentPosts) => [
        data.post,
        ...currentPosts,
      ]);

      // Reset form
      handleRemoveImage();

      setCaption('');

      setIsComposerOpen(false);
    } catch (error) {
      setErrorMessage(
        error.message || 'Unable to create post.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------
  // LIKE
  // --------------------------------------------------

  const handleToggleLike = async (postId) => {
    try {
      const data = await toggleLike(
        user.token,
        postId
      );

      replacePost(data.post);
    } catch (error) {
      setErrorMessage(
        error.message || 'Unable to update like.'
      );
    }
  };

  // --------------------------------------------------
  // COMMENT
  // --------------------------------------------------

  const handleAddComment = async (postId, text) => {
    try {
      const data = await addComment(
        user.token,
        postId,
        text
      );

      replacePost(data.post);
    } catch (error) {
      setErrorMessage(
        error.message || 'Unable to add comment.'
      );
    }
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="home-page">

      {/* Navigation */}
      <Navigation
        user={user}
        path={path}
        navigate={navigate}
        onLogout={onLogout}
      />

      {/* Feed */}
      <main className="feed-container">

        <div className="feed-header">

          <h2>Home</h2>

          <button
            type="button"
            className="create-post-btn"
            onClick={() => {
              setErrorMessage('');
              setIsComposerOpen(true);
            }}
          >
            <Plus size={16} />
            Create Post
          </button>

        </div>

        {/* Error */}
        {errorMessage && (
          <div className="feed-error">
            {errorMessage}
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <p className="feed-status">
            Loading your feed...
          </p>
        ) : posts.length === 0 ? (

          /* Empty feed */
          <div className="empty-feed">
            <h3>No posts yet.</h3>

            <p>
              Be the first to share your vibe.
            </p>
          </div>

        ) : (

          /* Posts */
          <div className="posts-container">

            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onToggleLike={handleToggleLike}
                onAddComment={handleAddComment}
              />
            ))}

          </div>
        )}

      </main>

      {/* ==================================================
          CREATE POST MODAL
          ================================================== */}

      {isComposerOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !isSubmitting
            ) {
              closeComposer();
            }
          }}
        >

          <section
            className="create-post-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-post-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            {/* Modal header */}
            <div className="modal-header">

              <h3 id="create-post-title">
                Create post
              </h3>

              <button
                type="button"
                className="icon-button"
                onClick={closeComposer}
                disabled={isSubmitting}
                aria-label="Close create post form"
              >
                <X size={18} />
              </button>

            </div>

            {/* Create post form */}
            <form
              className="create-post-form"
              onSubmit={handleCreatePost}
            >

              {/* Caption */}
              <label>

                <span>
                  Caption
                </span>

                <textarea
                  value={caption}
                  onChange={(event) =>
                    setCaption(event.target.value)
                  }
                  placeholder="What is your vibe?"
                  maxLength={2200}
                  required
                  disabled={isSubmitting}
                />

              </label>

              {/* Image upload */}
              <label className="image-upload-label">

                <span>
                  Image{' '}
                  <small>
                    (optional)
                  </small>
                </span>

                {/* Upload box */}
                <div className="image-upload-box">

                  <div className="image-upload-icon">
                    +
                  </div>

                  <div className="image-upload-text">

                    <strong>
                      {imageFile
                        ? 'Change image'
                        : 'Choose image'}
                    </strong>

                    <small>
                      JPEG, PNG, WEBP, GIF up to 5MB
                    </small>

                  </div>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                  />

                </div>

                {/* Image preview */}
                {imagePreview && (
                  <div className="image-preview-container">

                    <img
                      src={imagePreview}
                      alt="Selected preview"
                      className="image-preview"
                    />

                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={handleRemoveImage}
                      disabled={isSubmitting}
                    >
                      Remove image
                    </button>

                  </div>
                )}

              </label>

              {/* Submit */}
              <button
                type="submit"
                className="create-post-btn"
                disabled={
                  isSubmitting ||
                  !caption.trim()
                }
              >
                {isSubmitting
                  ? 'Posting...'
                  : 'Share post'}
              </button>

            </form>

          </section>

        </div>
      )}

    </div>
  );
}

export default Home;