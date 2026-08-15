import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createReel, getReels } from '../controllers/postController.js';
const router = express.Router();
router.use(protect);
router.route('/').get(getReels).post(createReel);
export default router;
