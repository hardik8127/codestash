import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
  //  get data from the request body
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;
  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        return res
          .status(500)
          .json({ error: `langauge ${language} is not supported` });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));
      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          examples,
          constraints,
          testcases,
          codeSnippets,
          referenceSolutions,
          userId: req.user.id,
        },
      });
      return res.status(201).json({
        success: true,
        message: "Problem Created Successfully",
        problem: newProblem,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while creating Problem ",
    });
  }
  // check if the user is an admin
  // loop through earch refence solution
  // get language id for current language
  // prepare judge0  submission
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany();

    if (!problems) {
      return res.status(404).json({
        message: "No Problems Found",
      });
    }
    res.status(200).json({
      succes: true,
      message: "Problems Fetched Successfully",
      problems,
    });
  } catch (error) {
    console.error("Error while fetcing problems", error);
    return res.status(404).json({
      message: "No Problems Found",
    });
  }
};

export const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });
    if (!problem) {
      return res.status(404).json({
        message: "Problem not found ",
      });
    }
    res.status(200).json({
      succes: true,
      message: "Problems Fetched Successfully",
      problem,
    });
  } catch (error) {
    console.error("Error while fetching problem by id", error);
    return res.status(404).json({
      message: "Problem not found ",
    });
  }
};

export const updateProblem = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found to update ",
      });
    }
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        return res
          .status(500)
          .json({ error: `langauge ${language} is not supported` });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));
      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }
    const updatedProblem = await db.problem.update({
      where: {
        id: id,
      },
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Problem Updated Successfully",
      problem: updatedProblem,
    });
  } catch (error) {
    console.error("Error while updating Problem ", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating Problem ",
    });
  }
};

export const deleteProblem = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(404).json({
        message: "Problem Not Found, noting to delete",
      });
    }
    await db.problem.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      succes: true,
      message: "Problem Deleted Successfully",
    });
  } catch (error) {
    console.error("Error while deleting Problem", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting the Problem ",
    });
  }
};

export const getAllProblemsSolvedByUser = async (req, res) => {
  try {
    const problems = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId: req.user.id,
          },
        },
      },
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });

    res.status(200).json({
      succes: true,
      message: "Problem Fetched Successfully",
      problems,
    });
  } catch (error) {
    console.error("Error in fetching problem", error);
    res.status(500).json({
      succes: false,
      message: "Error in fetching problem",
    });
  }
};
