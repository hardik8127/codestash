import { db } from "../libs/db.js";

export const getAllSubmission = async (req, res) => {
  try {
    const userId = req.userId;
    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({
      success: true,
      message: " Submissions Fetched Successfully",
      submissions,
    });
  } catch (error) {
    console.error("fetch submission error", error);
    res.status(500).json({
      success: false,
      message: " failed to fetch Submissions",
    });
  }
};

export const getSubmissionForProblem = async (req, res) => {
  try {
    const userId = req.userId;
    const { problemId } = req.params.problemId;

    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
        problemId: problemId,
      },
    });
    res.status(200).json({
      success: true,
      message: " Submission Fetched Successfully",
      submissions,
    });
  } catch (error) {
    console.error("fetch submission error", error);
    res.status(500).json({
      success: false,
      message: " failed to fetch Submission",
    });
  }
};

export const getAllThesubmissionsForProblem = async (req, res) => {
  try {
    const { problemId } = req.params.problemId;
    const submisson = await db.submission.count({
      where: {
        problemId: problemId,
      },
    });
    res.status(200).json({
      success: true,
      message: " Submissions Fetched Successfully",
      count: submisson,
    });
  } catch (error) {
    console.error("fetch submission error", error);
    res.status(500).json({
      success: false,
      message: " failed to fetch Submission",
    });
  }
};
