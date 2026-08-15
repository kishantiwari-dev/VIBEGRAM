import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import {
  addComment,
  createPost,
  getPosts,
  toggleLike,
} from '../controllers/postController.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getPosts)
  .post(upload.single('image'), createPost);

router.post('/:postId/like', toggleLike);

router.post('/:postId/comments', addComment);

export default router;