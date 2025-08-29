import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

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

    let allPassed = true;
    const detailedResults = results.map((result, i) => {
      const stdout = result?.stdout?.trim();
      const expected_output = expected_outputs[i]?.trim();
      const passed = stdout === expected_output;

      if (!passed) {
        allPassed = false;
      }

      return {
        testCase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} s` : undefined,
        language_id: language_id,
        token: result.token,
        problemId: problemId,
      };

      // console.log(`testcase ${i + 1}`);
      // console.log(`Input${stdin[i]}`);
      // console.log(`Expected output for testcase ${expected_output}`);
      // console.log(`Actual Output${stdout}`);

      // console.log(`MATCHED ${passed}`);
    });

    console.log(detailedResults);

    res.status(200).json({
      success: true,
      message: "Code Executed",
      result: detailedResults,
    });
  } catch (error) {
    console.error("Error Executing code", error);
    res.status(500).json({
      message: "Failed to Execute Code",
    });
  }
};
