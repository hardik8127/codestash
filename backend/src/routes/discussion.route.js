import { addCommentToDiscussion, createDiscussion, getAllDiscussions, getDiscussionById, toggleLikeOnDiscussion } from "../controllers/discussion.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { Router  } from "express";

const discussionRouter = Router();

discussionRouter.post('/create/:problemId', authMiddleware, createDiscussion)
discussionRouter.get('/get-all-discussions/:problemId', authMiddleware, getAllDiscussions)
discussionRouter.get('/get-discussion/:discussionId', authMiddleware, getDiscussionById)
discussionRouter.get('/toggle-like/:discussionId', authMiddleware, toggleLikeOnDiscussion)
discussionRouter.post('/add-comment-to-discussion/:discussionId', authMiddleware, addCommentToDiscussion)


export default discussionRouter;