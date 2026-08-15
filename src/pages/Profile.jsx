import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import PostCard from '../components/PostCard';
import { getProfile, getProfilePosts, updateProfile } from '../services/userService';
import { addComment, toggleLike } from '../services/postService';
import '../assets/social.css';

const BACKEND_URL = 'http://localhost:5000';

const getImageUrl = (image) => {
  if (!image) return '';

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  return `${BACKEND_URL}${image}`;
};

export default function Profile({
  user,
  username,
  path,
  navigate,
  onLogout,
  onUserUpdate,
}) {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    name: '',
    username: '',
    bio: '',
    profileImage: '',
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');

      const [profileData, postsData] = await Promise.all([
        getProfile(user.token, username),
        getProfilePosts(user.token, username),
      ]);

      setProfile(profileData.user);

      setForm({
        name: profileData.user.name || '',
        username: profileData.user.username || '',
        bio: profileData.user.bio || '',
        profileImage: profileData.user.profileImage || '',
      });

      setPosts(postsData.posts || []);

      // Show existing profile image
      if (profileData.user.profileImage) {
        setImagePreview(getImageUrl(profileData.user.profileImage));
      } else {
        setImagePreview('');
      }

      setSelectedImage(null);
    } catch (err) {
      setError(err.message || 'Unable to load profile.');
    }
  };

  useEffect(() => {
    load();
  }, [username]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Only JPEG, PNG, WEBP and GIF images are allowed.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Profile image must be smaller than 5 MB.');
      event.target.value = '';
      return;
    }

    setError('');
    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);

    if (profile?.profileImage) {
      setImagePreview(getImageUrl(profile.profileImage));
    } else {
      setImagePreview('');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const save = async (event) => {
    event.preventDefault();

    if (isSaving) return;

    try {
      setIsSaving(true);
      setError('');

      const data = await updateProfile(user.token, {
        name: form.name,
        username: form.username,
        bio: form.bio,
        profileImage: selectedImage,
      });

      setProfile(data.user);

      setForm({
        name: data.user.name || '',
        username: data.user.username || '',
        bio: data.user.bio || '',
        profileImage: data.user.profileImage || '',
      });

      setSelectedImage(null);

      if (data.user.profileImage) {
        setImagePreview(getImageUrl(data.user.profileImage));
      } else {
        setImagePreview('');
      }

      onUserUpdate({
        ...user,
        ...data.user,
      });

      setEdit(false);

      navigate(`/profile/${data.user.username}`, true);
    } catch (err) {
      setError(err.message || 'Unable to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const replacePost = (nextPost) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post._id === nextPost._id ? nextPost : post
      )
    );
  };

  if (!profile) {
    return (
      <div className="home-page">
        <Navigation
          {...{
            user,
            path,
            navigate,
            onLogout,
          }}
        />

        <main className="social-container">
          {error || 'Loading profile...'}
        </main>
      </div>
    );
  }

  return (
    <div className="home-page">
      <Navigation
        {...{
          user,
          path,
          navigate,
          onLogout,
        }}
      />

      <main className="social-container">

        {/* PROFILE HEADER */}
        <section className="profile-header">

          <div className="profile-photo-wrapper">
            {profile.profileImage ? (
              <img
                className="profile-large"
                src={getImageUrl(profile.profileImage)}
                alt={profile.name}
              />
            ) : (
              <div className="profile-large profile-avatar">
                {profile.username?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>

          <div className="profile-info">
            <h1>{profile.name}</h1>

            <p>@{profile.username}</p>

            <p>
              {profile.bio || 'No bio yet.'}
            </p>

            <div className="profile-stats">
              <span>
                {profile.postCount} posts
              </span>

              <span>
                {profile.connectionCount} connections
              </span>
            </div>

            {profile.isCurrentUser && (
              <button
                type="button"
                className="create-post-btn"
                onClick={() => {
                  setEdit((current) => !current);
                  setError('');
                }}
              >
                {edit ? 'Cancel' : 'Edit Profile'}
              </button>
            )}
          </div>
        </section>

        {error && (
          <p className="feed-error">
            {error}
          </p>
        )}

        {/* EDIT PROFILE */}
        {edit && profile.isCurrentUser && (
          <form
            className="panel-form"
            onSubmit={save}
          >

            <label>
              Name

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                disabled={isSaving}
              />
            </label>

            <label>
              Username

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
                required
                disabled={isSaving}
              />
            </label>

            <label>
              Bio

              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                maxLength="160"
                placeholder="Tell people about yourself..."
                disabled={isSaving}
              />
            </label>

            {/* PROFILE IMAGE */}
            <label>
              Profile Picture

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                disabled={isSaving}
              />
            </label>

            {/* IMAGE PREVIEW */}
            {imagePreview && (
              <div className="profile-image-preview">

                <img
                  src={imagePreview}
                  alt="Profile preview"
                />

                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={handleRemoveImage}
                  disabled={isSaving}
                >
                  Remove image
                </button>

              </div>
            )}

            <button
              type="submit"
              className="create-post-btn"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save profile'}
            </button>

          </form>
        )}

        {/* POSTS */}
        <h2>Posts</h2>

        <div className="posts-container">

          {posts.length === 0 ? (
            <p className="feed-status">
              No posts yet.
            </p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}

                onToggleLike={async (id) => {
                  const data = await toggleLike(
                    user.token,
                    id
                  );

                  replacePost(data.post);
                }}

                onAddComment={async (id, text) => {
                  const data = await addComment(
                    user.token,
                    id,
                    text
                  );

                  replacePost(data.post);
                }}
              />
            ))
          )}

        </div>

      </main>
    </div>
  );
}