import { Router } from 'express';
const router = Router();
import { createPost, getPosts, addComment, votePoll, closeProject ,toggleLike } from '../controllers/postController.js';

// POST /api/posts -> create post
router.post('/', createPost);

// GET /api/posts?type=blog&page=1&limit=20
router.get('/', getPosts);

// POST /api/posts/:postId/comments
router.post('/:postId/comments', addComment);

// POST /api/posts/:postId/vote
router.post('/:postId/vote', votePoll);

router.post('/:postId/like', toggleLike);

// POST /api/posts/:postId/close
router.post('/:postId/close', closeProject);

export default router;
