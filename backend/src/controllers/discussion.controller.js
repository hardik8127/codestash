import { db } from "../libs/db.js";

export const createDiscussion = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { problemId } = req.params;

    if (!title || !content) {
      return res.status(400).json({
        message: "All Fields Are Required",
      });
    }
    const problem = await db.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return res.status(404).json({
        message: "Problem Not Found",
      });
    }

    const discussion = await db.discussion.create({
      data: {
        title,
        content,
        problemId,
        userId: req.user.id,
      },
    });

    if (!discussion) {
      return res.status(400).json({
        message: "Discussion Not Created",
      });
    }
    return res.status(201).json({
      message: "Discussion Created",
      discussion,
    });
  } catch (error) {
    console.error("Error in discussion creation ", error);
    res.status(500).json({
      message: "Error in discussion creation",
      error,
    });
  }
};

export const getAllDiscussions = async (req, res) => {
  try {
    const { problemId } = req.params;
    const problem = await db.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return res.status(404).json({
        message: "Problem Not Found",
      });
    }

    const allDiscussions = await db.discussion.findMany({
      where: {
        problemId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            id: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
                id: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        likes: true,
      },
    });

    res.status(200).json({
      message: "All discussions fetched",
      allDiscussions,
    });
  } catch (error) {
    console.error("Error in fetching all discussions ", error);
    res.status(500).json({
      message: "Error in fetching all discussions",
      error,
    });
  }
};

export const getDiscussionById = async (req, res) => {
  try {
    const { discussionId } = req.params;

    const discussion = await db.discussion.findUnique({
      where: {
        id: discussionId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            id: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
                id: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        likes: true,
      },
    });
    if (!discussion) {
      return res.status(404).json({
        message: "Discussion Not Found",
      });
    }
    return res.status(200).json({
      message: "Discussion Fetched Successfully",
      discussion,
    });
  } catch (error) {
    console.error("Error in fetching discussion by id ", error);
    res.status(500).json({
      message: "Error in fetching discussion by id",
      error,
    });
  }
};

export const toggleLikeOnDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const userId = req.user.id;

    const existingLike = await db.like.findUnique({
      where: {
        userId_discussionId: { userId, discussionId },
      },
    });

    if (existingLike) {
      // Unlike
      await db.like.delete({
        where: {
          userId_discussionId: { userId, discussionId },
        },
      });
      return res.status(200).json({
        message: "Unliked Discussion",
      });
    } else {
      // Like
      await db.like.create({
        data: {
          userId,
          discussionId,
        },
      });
      return res.status(200).json({
        message: "Liked Discussion",
      });
    }
  } catch (error) {
    console.error("Error in toggleLikeOnDiscussion", error);
    return res.status(500).json({
      message: "Error toggling like",
      error: error,
    });
  }
};

export const addCommentToDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { content } = req.body;

    const discussion = await db.discussion.findUnique({
      where: {
        id: discussionId,
      },
    });

    if (!discussion) {
      return res.status(404).json({
        message: "Discussion Not Found",
      });
    }

    const comment = await db.comment.create({
      data: {
        content,
        userId: req.user.id,
        discussionId,
      },
    });

    if (!comment) {
      return res.status(400).json({
        message: "Comment Not Created",
      });
    }
    return res.status(201).json({
      message: "Comment Posted",
      comment,
    });
  } catch (error) {
    console.error("error in add comments to discussion", error);
    return res.status(500).json({
      message: "error in add comments to discussion",
      error,
    });
  }
};
