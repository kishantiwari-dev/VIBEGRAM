import User from '../models/User.js';
import Post from '../models/Post.js';
import { serialisePost } from './postController.js';

const getMediaUrl = (req, filePath) => {
  if (!filePath) return '';

  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }

  return `${req.protocol}://${req.get('host')}${filePath}`;
};

const profileData = async (user, viewerId, req) => {
  const postCount = await Post.countDocuments({
    author: user._id,
    type: 'post',
  });

  return {
    _id: user._id,
    name: user.name,
    username: user.username,
    bio: user.bio || '',
    profileImage: getMediaUrl(req, user.profileImage),
    postCount,
    connectionCount: Array.isArray(user.connections)
      ? user.connections.length
      : 0,
    isCurrentUser: user._id.toString() === viewerId.toString(),
  };
};

// Search users
export const searchUsers = async (req, res) => {
  try {
    const query = (req.query.q || '').trim();

    if (!query) {
      return res.json({ users: [] });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
      ],
    })
      .select('name username profileImage')
      .limit(20);

    return res.json({
      users: users.map((user) => ({
        _id: user._id,
        name: user.name,
        username: user.username,
        profileImage: getMediaUrl(req, user.profileImage),
      })),
    });
  } catch (error) {
    console.error('searchUsers error:', error);

    return res.status(500).json({
      message: 'Unable to search users. Please try again.',
    });
  }
};

// Get a user's profile
export const getUserProfile = async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();

    const user = await User.findOne({
      username,
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    return res.json({
      user: await profileData(user, req.user._id, req),
    });
  } catch (error) {
    console.error('getUserProfile error:', error);

    return res.status(500).json({
      message: 'Unable to load profile. Please try again.',
    });
  }
};

// Get posts belonging to a user
export const getUserPosts = async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();

    const user = await User.findOne({
      username,
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    const posts = await Post.find({
      author: user._id,
      type: 'post',
    })
      .populate('author', 'name username profileImage')
      .populate('comments.author', 'name username profileImage')
      .sort({ createdAt: -1 });

    return res.json({
      posts: posts.map((post) =>
        serialisePost(post, req.user._id, req)
      ),
    });
  } catch (error) {
    console.error('getUserPosts error:', error);

    return res.status(500).json({
      message: 'Unable to load user posts. Please try again.',
    });
  }
};

// Update current user's profile
export const updateMyProfile = async (req, res) => {
  try {
    const {
      name,
      username,
      bio,
    } = req.body;

    if (!name || !username) {
      return res.status(400).json({
        message: 'Name and username are required.',
      });
    }

    const normalizedUsername = username.trim().toLowerCase();

    const existing = await User.findOne({
      username: normalizedUsername,
      _id: { $ne: req.user._id },
    });

    if (existing) {
      return res.status(409).json({
        message: 'That username is already taken.',
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    user.name = name.trim();
    user.username = normalizedUsername;
    user.bio = bio || '';

    // If a new profile image was uploaded,
    // save its path.
    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();

    return res.json({
      user: await profileData(user, req.user._id, req),
    });
  } catch (error) {
    console.error('updateMyProfile error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message:
          Object.values(error.errors)[0]?.message ||
          'Invalid profile information.',
      });
    }

    return res.status(500).json({
      message: 'Unable to update profile. Please try again.',
    });
  }
};