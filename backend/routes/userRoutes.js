import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

import {
  getUserPosts,
  getUserProfile,
  searchUsers,
  updateMyProfile,
} from '../controllers/userController.js';

const router = express.Router();

router.use(protect);

router.get('/search', searchUsers);

router.put(
  '/me',
  upload.single('profileImage'),
  updateMyProfile
);

router.get('/:username/posts', getUserPosts);

router.get('/:username', getUserProfile);

export default router;