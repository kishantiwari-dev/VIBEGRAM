import Post from '../models/Post.js';

const authorFields = 'name username profileImage';

const getMediaUrl = (req, filePath) => {
  if (!filePath) return '';

  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }

  return `${req.protocol}://${req.get('host')}${filePath}`;
};

const populatePost = (query) =>
  query
    .populate('author', authorFields)
    .populate('comments.author', authorFields);

const populateDocument = (post) =>
  post.populate([
    { path: 'author', select: authorFields },
    { path: 'comments.author', select: authorFields },
  ]);

export const serialisePost = (post, viewerId, req) => {
  const author = post.author || {};

  return {
    _id: post._id,

    author: {
      _id: author._id,
      name: author.name,
      username: author.username,
      profileImage: getMediaUrl(req, author.profileImage),
    },

    caption: post.caption,

    imageUrl: getMediaUrl(req, post.imageUrl),

    type: post.type,

    videoUrl: getMediaUrl(req, post.videoUrl),

    likes: post.likes.length,

    isLiked: viewerId
      ? post.likes.some(
          (like) => like.toString() === viewerId.toString()
        )
      : false,

    comments: post.comments.map((comment) => ({
      _id: comment._id,

      author: {
        _id: comment.author?._id,
        name: comment.author?.name,
        username: comment.author?.username,
        profileImage: getMediaUrl(
          req,
          comment.author?.profileImage
        ),
      },

      text: comment.text,
      createdAt: comment.createdAt,
    })),

    commentCount: post.comments.length,

    createdAt: post.createdAt,
  };
};

const validationMessage = (error) => {
  if (error.name === 'ValidationError') {
    return (
      Object.values(error.errors)[0]?.message ||
      'Post validation failed.'
    );
  }

  return 'Server error. Please try again.';
};


// =========================
// CREATE POST
// =========================

export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;

    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : '';

    const post = await Post.create({
      author: req.user._id,
      caption,
      imageUrl,
      type: 'post',
    });

    await populateDocument(post);

    return res.status(201).json({
      post: serialisePost(
        post,
        req.user._id,
        req
      ),
    });
  } catch (error) {
    const status =
      error.name === 'ValidationError'
        ? 400
        : 500;

    return res.status(status).json({
      message: validationMessage(error),
    });
  }
};


// =========================
// GET POSTS
// =========================

export const getPosts = async (req, res) => {
  try {
    const posts = await populatePost(
      Post.find({ type: 'post' })
        .sort({ createdAt: -1 })
    );

    return res.json({
      posts: posts.map((post) =>
        serialisePost(
          post,
          req.user._id,
          req
        )
      ),
    });
  } catch (error) {
    console.error('getPosts error:', error);

    return res.status(500).json({
      message: 'Unable to load posts. Please try again.',
    });
  }
};


// =========================
// CREATE REEL
// =========================

export const createReel = async (req, res) => {
  try {
    const {
      caption,
      videoUrl = '',
    } = req.body;

    const reel = await Post.create({
      author: req.user._id,
      caption,
      videoUrl,
      type: 'reel',
    });

    await populateDocument(reel);

    return res.status(201).json({
      reel: serialisePost(
        reel,
        req.user._id,
        req
      ),
    });
  } catch (error) {
    return res
      .status(
        error.name === 'ValidationError'
          ? 400
          : 500
      )
      .json({
        message: validationMessage(error),
      });
  }
};


// =========================
// GET REELS
// =========================

export const getReels = async (req, res) => {
  try {
    const reels = await populatePost(
      Post.find({ type: 'reel' })
        .sort({ createdAt: -1 })
    );

    return res.json({
      reels: reels.map((reel) =>
        serialisePost(
          reel,
          req.user._id,
          req
        )
      ),
    });
  } catch (error) {
    console.error('getReels error:', error);

    return res.status(500).json({
      message: 'Unable to load reels. Please try again.',
    });
  }
};


// =========================
// LIKE / UNLIKE POST
// =========================

export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(
      req.params.postId
    );

    if (!post) {
      return res.status(404).json({
        message: 'Post not found.',
      });
    }

    const userId = req.user._id;

    const likeIndex = post.likes.findIndex(
      (like) =>
        like.toString() === userId.toString()
    );

    if (likeIndex >= 0) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    await populateDocument(post);

    return res.json({
  post: serialisePost(post, userId, req),
});
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Post not found.',
      });
    }

    console.error('toggleLike error:', error);

    return res.status(500).json({
      message: 'Unable to update like. Please try again.',
    });
  }
};


// =========================
// ADD COMMENT
// =========================

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(
      req.params.postId
    );

    if (!post) {
      return res.status(404).json({
        message: 'Post not found.',
      });
    }

    post.comments.push({
      author: req.user._id,
      text,
    });

    await post.save();

    await populateDocument(post);

    return res.status(201).json({
  post: serialisePost(post, req.user._id, req),
});
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Post not found.',
      });
    }

    const status =
      error.name === 'ValidationError'
        ? 400
        : 500;

    return res.status(status).json({
      message: validationMessage(error),
    });
  }
};