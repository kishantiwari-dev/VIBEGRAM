import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  text: {
    type: String,
    required: [true, 'Comment text is required.'],
    trim: true,
    minlength: [1, 'Comment text cannot be empty.'],
    maxlength: [1000, 'Comment text cannot exceed 1000 characters.'],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    caption: {
      type: String,
      required: [true, 'Caption is required.'],
      trim: true,
      minlength: [1, 'Caption cannot be empty.'],
      maxlength: [2200, 'Caption cannot exceed 2200 characters.'],
    },

    // Stores the path/URL of an uploaded image.
    // Example:
    // /uploads/1723456789-123456789.jpg
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },

    type: {
      type: String,
      enum: ['post', 'reel'],
      default: 'post',
    },

    videoUrl: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: (value) => {
          if (!value) return true;

          try {
            const url = new URL(value);
            return url.protocol === 'http:' || url.protocol === 'https:';
          } catch {
            return false;
          }
        },

        message: 'Video URL must be a valid http(s) URL.',
      },
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    comments: [commentSchema],
  },

  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;