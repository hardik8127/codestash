import React from 'react';
import { CheckCircle2, XCircle, Clock, MemoryStick as Memory, Terminal, Code2 } from 'lucide-react';

const Submission = ({ submission }) => {
  // Handle different submission formats
  let testResults = [];
  
  if (!submission) {
    return (
      <div className="text-center text-gray-400 py-8">
        <Terminal className="w-12 h-12 mx-auto text-blue-400/40 mb-4" />
        <p className="text-lg text-gray-300">No execution results</p>
        <p className="text-sm mt-2">Run your code to see the results</p>
      </div>
    );
  }
  
  // Check if submission is an array (execution result) or object (submit result)
  if (Array.isArray(submission)) {
    testResults = submission;
  } else if (submission.testCases && Array.isArray(submission.testCases)) {
    // Transform database testCases to match execution format
    testResults = submission.testCases.map(tc => ({
      testCase: tc.testCase,
      passed: tc.passed,
      stdout: tc.stdout,
      expected: tc.expected,
      stderr: tc.stderr,
      compile_output: tc.compileOutput,
      status: tc.status,
      memory: tc.memory,
      time: tc.time,
    }));
  } else {
    return (
      <div className="text-center text-gray-400 py-8">
        <Terminal className="w-12 h-12 mx-auto text-blue-400/40 mb-4" />
        <p className="text-lg text-gray-300">No execution results</p>
        <p className="text-sm mt-2">Run your code to see the results</p>
      </div>
    );
  }

  if (!testResults.length) {
    return (
      <div className="text-center text-gray-400 py-8">
        <Terminal className="w-12 h-12 mx-auto text-blue-400/40 mb-4" />
        <p className="text-lg text-gray-300">No test results</p>
        <p className="text-sm mt-2">Run your code to see the results</p>
      </div>
    );
  }

  // Calculate statistics from the results array
  const passedTests = testResults.filter(tc => tc.passed).length;
  const totalTests = testResults.length;
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
  const allPassed = passedTests === totalTests;

  // Calculate averages for memory and time
  const memoryValues = testResults
    .filter(tc => tc.memory)
    .map(tc => parseFloat(tc.memory.replace(' KB', '')))
    .filter(val => !isNaN(val));
  
  const timeValues = testResults
    .filter(tc => tc.time)
    .map(tc => parseFloat(tc.time.replace(' s', '')))
    .filter(val => !isNaN(val));

  const avgMemory = memoryValues.length > 0 
    ? memoryValues.reduce((a, b) => a + b, 0) / memoryValues.length 
    : 0;

  const avgTime = timeValues.length > 0 
    ? timeValues.reduce((a, b) => a + b, 0) / timeValues.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gray-800/50 backdrop-blur-sm shadow-xl border border-gray-700/30">
          <div className="card-body p-4">
            <h3 className="card-title text-sm text-gray-300">Status</h3>
            <div className={`text-lg font-bold flex items-center gap-2 ${
              allPassed ? 'text-green-400' : 'text-red-400'
            }`}>
              {allPassed ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Accepted
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  Wrong Answer
                </>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-gray-800/50 backdrop-blur-sm shadow-xl border border-gray-700/30">
          <div className="card-body p-4">
            <h3 className="card-title text-sm text-gray-300">Success Rate</h3>
            <div className="text-lg font-bold text-blue-400">
              {successRate.toFixed(1)}% ({passedTests}/{totalTests})
            </div>
          </div>
        </div>

        <div className="card bg-gray-800/50 backdrop-blur-sm shadow-xl border border-gray-700/30">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center gap-2 text-gray-300">
              <Clock className="w-4 h-4" />
              Avg. Runtime
            </h3>
            <div className="text-lg font-bold text-blue-400">
              {avgTime > 0 ? `${avgTime.toFixed(3)} s` : 'N/A'}
            </div>
          </div>
        </div>

        <div className="card bg-gray-800/50 backdrop-blur-sm shadow-xl border border-gray-700/30">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center gap-2 text-gray-300">
              <Memory className="w-4 h-4" />
              Avg. Memory
            </h3>
            <div className="text-lg font-bold text-blue-400">
              {avgMemory > 0 ? `${avgMemory.toFixed(0)} KB` : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Test Cases Results */}
      <div className="card bg-gray-800/50 backdrop-blur-sm shadow-xl border border-gray-700/30">
        <div className="card-body">
          <h2 className="card-title mb-4 text-white flex items-center">
            <Code2 className="w-5 h-5 mr-2" />
            Test Cases Results
            <div className="h-1 w-12 bg-blue-500/30 rounded-full ml-3"></div>
          </h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-700/50">
                  <th className="font-bold text-gray-300 bg-blue-500/5">Test Case</th>
                  <th className="font-bold text-gray-300 bg-blue-500/5">Status</th>
                  <th className="font-bold text-gray-300 bg-blue-500/5">Expected Output</th>
                  <th className="font-bold text-gray-300 bg-blue-500/5">Your Output</th>
                  <th className="font-bold text-gray-300 bg-blue-500/5">Memory</th>
                  <th className="font-bold text-gray-300 bg-blue-500/5">Time</th>
                </tr>
              </thead>
              <tbody>
                {testResults.map((testCase, index) => (
                  <tr 
                    key={index} 
                    className={`hover:bg-blue-500/5 transition-colors border-b border-gray-800 group ${
                      testCase.passed ? 'hover:bg-green-500/5' : 'hover:bg-red-500/5'
                    }`}
                  >
                    <td className="font-mono bg-gray-800/30 p-3 text-gray-300 group-hover:bg-blue-500/5 transition-colors">
                      #{testCase.testCase}
                    </td>
                    <td className="bg-gray-800/30 p-3 group-hover:bg-blue-500/5 transition-colors">
                      {testCase.passed ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle2 className="w-5 h-5" />
                          Passed
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400">
                          <XCircle className="w-5 h-5" />
                          Failed
                        </div>
                      )}
                    </td>
                    <td className="font-mono bg-gray-800/30 p-3 text-gray-300 break-words group-hover:bg-blue-500/5 transition-colors max-w-xs">
                      <div className="bg-gray-900/50 px-2 py-1 rounded text-sm border border-gray-700/50">
                        {testCase.expected || 'N/A'}
                      </div>
                    </td>
                    <td className="font-mono bg-gray-800/30 p-3 text-gray-300 break-words group-hover:bg-blue-500/5 transition-colors max-w-xs">
                      <div className={`px-2 py-1 rounded text-sm border ${
                        testCase.passed 
                          ? 'bg-green-900/20 border-green-500/30 text-green-300' 
                          : 'bg-red-900/20 border-red-500/30 text-red-300'
                      }`}>
                        {testCase.stdout || testCase.stderr || 'No output'}
                      </div>
                    </td>
                    <td className="font-mono bg-gray-800/30 p-3 text-blue-400 group-hover:bg-blue-500/5 transition-colors">
                      {testCase.memory || 'N/A'}
                    </td>
                    <td className="font-mono bg-gray-800/30 p-3 text-blue-400 group-hover:bg-blue-500/5 transition-colors">
                      {testCase.time || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Error Details Section */}
          {testResults.some(tc => tc.stderr || tc.compile_output) && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <XCircle className="w-5 h-5 mr-2 text-red-400" />
                Error Details
              </h3>
              <div className="space-y-3">
                {testResults.map((testCase, index) => {
                  if (!testCase.stderr && !testCase.compile_output) return null;
                  
                  return (
                    <div key={index} className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                      <div className="text-red-400 font-semibold mb-2">
                        Test Case #{testCase.testCase}
                      </div>
                      {testCase.compile_output && (
                        <div className="mb-2">
                          <div className="text-red-300 text-sm mb-1">Compile Error:</div>
                          <pre className="text-red-200 text-xs bg-red-900/30 p-2 rounded overflow-x-auto">
                            {testCase.compile_output}
                          </pre>
                        </div>
                      )}
                      {testCase.stderr && (
                        <div>
                          <div className="text-red-300 text-sm mb-1">Runtime Error:</div>
                          <pre className="text-red-200 text-xs bg-red-900/30 p-2 rounded overflow-x-auto">
                            {testCase.stderr}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Submission;