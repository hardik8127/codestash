import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

    console.log("req------", req.body);

    const userId = req.user.id;

    // Validate test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({
        message: "Invalid or Missing Test Cases",
      });
    }
    //  prepare each test cases for judge0 batch submission
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
      wait: false,
    }));

    // send batch to judge0
    const submitResponse = await submitBatch(submissions);

    const tokens = submitResponse.map((res) => res.token);

    // poll judge0 for all the submited test cases
    const results = await pollBatchResults(tokens);

    console.log("results", results);
    res.status(200).json({
      message: "Code Executed",
    });
  } catch (error) {}
};
