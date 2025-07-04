import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  BookOpen,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
  Loader,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../lib/lang";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import Submission from "../components/Submission";
import SubmissionsList from "../components/SubmissionList";
import DiscussionList from "../components/DiscussionList";
import { motion } from "framer-motion";

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testcases, setTestCases] = useState([]);
  const [difficulty, setDifficulty] = useState("Medium"); // Can be dynamically set based on problem data

  const { executeCode, submission, isExecuting } = useExecutionStore();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(
        problem.codeSnippets?.[selectedLanguage] || submission?.sourceCode || ""
      );
      setTestCases(
        problem.testcases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );

      // Set difficulty based on problem data (if available)
      if (problem.difficulty) {
        setDifficulty(problem.difficulty);
      }
    }
  }, [problem, selectedLanguage]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Add keyboard shortcut: Ctrl+Enter to run code
      if (e.ctrlKey && e.key === "Enter") {
        handleRunCode(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.[lang] || "");
  };

  const handleRunCode = (e) => {
    if (e) {
      e.preventDefault();
    }

    if (isExecuting) return;

    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);
      executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#060606]">
        <Loader className="size-10 animate-spin text-blue-500" />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none prose-invert">
            <p className="text-lg mb-6 text-gray-300">{problem.description}</p>

            {problem.examples && (
              <>
                <h3 className="text-xl font-bold mb-4 text-white flex items-center">
                  <span>Examples</span>
                  <div className="h-1 w-16 bg-blue-500/30 rounded-full ml-3"></div>
                </h3>
                {Object.entries(problem.examples).map(
                  ([lang, example], idx) => (
                    <div
                      key={lang}
                      className="bg-gray-800/50 p-6 rounded-lg mb-6 font-mono border border-gray-700/50 hover:border-blue-500/30 transition-colors"
                    >
                      <div className="mb-4">
                        <div className="text-blue-400 mb-2 text-base font-semibold">
                          Input:
                        </div>
                        <div className="bg-gray-900/80 px-4 py-2 rounded-md font-semibold text-gray-300 overflow-x-auto border border-gray-700/50">
                          {example.input}
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="text-blue-400 mb-2 text-base font-semibold">
                          Output:
                        </div>
                        <div className="bg-gray-900/80 px-4 py-2 rounded-md font-semibold text-gray-300 overflow-x-auto border border-gray-700/50">
                          {example.output}
                        </div>
                      </div>
                      {example.explanation && (
                        <div>
                          <div className="text-blue-400 mb-2 text-base font-semibold">
                            Explanation:
                          </div>
                          <p className="text-gray-400 text-base">
                            {example.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                )}
              </>
            )}

            {problem.constraints && (
              <>
                <h3 className="text-xl font-bold mb-4 text-white flex items-center">
                  <span>Constraints</span>
                  <div className="h-1 w-16 bg-blue-500/30 rounded-full ml-3"></div>
                </h3>
                <div className="bg-gray-800/50 p-6 rounded-lg mb-6 border border-gray-700/50 hover:border-blue-500/30 transition-colors">
                  <div className="bg-gray-900/80 px-4 py-2 rounded-md font-mono text-gray-300 overflow-x-auto border border-gray-700/50">
                    {problem.constraints}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case "submissions":
        return (
          <SubmissionsList
            submissions={submissions}
            isLoading={isSubmissionsLoading}
          />
        );
      case "discussion":
        return <DiscussionList problemId={id} />;
      case "hints":
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50">
                <div className="bg-gray-900/80 px-4 py-2 rounded-md font-mono text-gray-300 overflow-x-auto border border-gray-700/50">
                  {problem.hints}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Lightbulb className="w-12 h-12 mx-auto text-blue-400/40 mb-4" />
                <p className="text-lg text-gray-300">No hints available</p>
                <p className="text-sm mt-2">
                  Try solving the problem on your own first
                </p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-[#060606] text-white relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#060606] to-[#0a0a0a]"></div>
        <div className="absolute top-0 left-0 w-full h-64 bg-blue-500/5 blur-3xl rounded-full transform -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-full h-64 bg-blue-500/5 blur-3xl rounded-full transform translate-y-1/2"></div>
      </div>

      <nav className="navbar bg-gray-800/40 backdrop-blur-lg shadow-lg px-6 py-3 border border-gray-700/20 sticky top-0 z-50">
        <div className="flex-1 gap-3">
          <Link
            to={"/home"}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Home className="w-5 h-5" />
            <ChevronRight className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center">
              {problem.title}
              <div className={`ml-3 badge ${
                difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                'bg-red-500/20 text-red-400 border-red-500/30'
              }`}>
                {difficulty}
              </div>
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-300 mt-1">
              <Clock className="w-4 h-4 flex-shrink-0 text-blue-400/70" />
              <span>
                Updated{" "}
                {new Date(problem.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-gray-500">•</span>
              <Users className="w-4 h-4 flex-shrink-0 text-blue-400/70" />
              <span>{submissionCount} Submissions</span>
              <span className="text-gray-500">•</span>
              <ThumbsUp className="w-4 h-4 flex-shrink-0 text-blue-400/70" />
              <span>95% Success Rate</span>
            </div>
          </div>
        </div>
        <div className="flex-none gap-3 flex items-center">
          <button
            className={`btn btn-ghost btn-circle ${
              isBookmarked ? "text-blue-400" : "text-gray-300"
            } hover:bg-gray-800 transition-colors`}
            onClick={() => setIsBookmarked(!isBookmarked)}
            title="Bookmark this problem"
          >
            <Bookmark className="w-5 h-5" />
          </button>
          <button
            className="btn btn-ghost btn-circle text-gray-300 hover:bg-gray-800 transition-colors"
            title="Share this problem"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <div className="border-r border-gray-700 h-8 mx-1"></div>
          <select
            className="select select-bordered select-sm border border-gray-700 bg-gray-800/70 text-white w-40 font-medium focus:border-blue-500"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {Object.keys(problem.codeSnippets || {}).map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
          <button
            className={`btn btn-sm gap-2 bg-indigo-500 hover:bg-indigo-600 text-white border-none ${
              isExecuting ? "loading" : ""
            }`}
            onClick={handleRunCode}
            disabled={isExecuting}
          >
            {!isExecuting && <Play className="w-4 h-4" />}
            Run
          </button>
          <button className="btn btn-sm gap-2 bg-green-500 hover:bg-green-600 text-white border-none">
            <ChevronRight className="w-4 h-4" />
            Submit
          </button>
        </div>
      </nav>

      <motion.div
        className="max-w-7xl mx-auto px-4 py-6 relative z-10"
        variants={containerVariants}
      >
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10"
          variants={containerVariants}
        >
          <motion.div
            className="card bg-gray-800/40 backdrop-blur-sm shadow-xl overflow-hidden border border-gray-700/30 w-full"
            variants={itemVariants}
          >
            <div className="card-body p-0 w-full">                <div className="tabs tabs-bordered border-b border-gray-700/50 w-full overflow-x-auto">
                  <button
                    className={`tab font-medium gap-2 px-4 text-gray-300 ${
                      activeTab === "description"
                        ? "tab-active text-blue-400 border-blue-400"
                        : ""
                    }`}
                    onClick={() => setActiveTab("description")}
                  >
                    <FileText className="w-4 h-4" />
                    Description
                  </button>
                  <button
                    className={`tab font-medium gap-2 px-4 text-gray-300 ${
                      activeTab === "submissions"
                        ? "tab-active text-blue-400 border-blue-400"
                        : ""
                    }`}
                    onClick={() => setActiveTab("submissions")}
                  >
                    <Code2 className="w-4 h-4" />
                    Submissions
                  </button>
                  <button
                    className={`tab font-medium gap-2 px-4 text-gray-300 ${
                      activeTab === "discussion"
                        ? "tab-active text-blue-400 border-blue-400"
                        : ""
                    }`}
                    onClick={() => setActiveTab("discussion")}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Discussion
                  </button>
                  <button
                    className={`tab font-medium gap-2 px-4 text-gray-300 ${
                      activeTab === "hints"
                        ? "tab-active text-blue-400 border-blue-400"
                        : ""
                    }`}
                    onClick={() => setActiveTab("hints")}
                  >
                    <Lightbulb className="w-4 h-4" />
                    Hints
                  </button>
                </div>

              <div className="p-6 overflow-y-auto max-h-[600px] w-full">
                {renderTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="card bg-gray-800/40 backdrop-blur-sm shadow-xl overflow-hidden border border-gray-700/30"
            variants={itemVariants}
          >
            <div className="card-body p-0">
              <div className="tabs tabs-bordered border-b border-gray-700/50">
                <button className="tab tab-active text-blue-400 border-blue-400 font-medium gap-2 px-4">
                  <Terminal className="w-4 h-4" />
                  Code Editor
                </button>
              </div>

              <div className="h-[600px] w-full border-t border-gray-700/50">
                <Editor
                  height="100%"
                  width="100%"
                  language={selectedLanguage.toLowerCase()}
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 16,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                    renderLineHighlight: "all",
                    cursorBlinking: "smooth",
                  }}
                />
              </div>

              <div className="p-3 border-t border-gray-700/50 bg-gray-800/50 w-full">
                <div className="flex justify-between items-center w-full">
                  <div className="text-gray-400 text-xs flex items-center gap-2">
                    <span className="bg-blue-500/10 px-2 py-1 rounded font-mono text-blue-400">
                      {selectedLanguage.charAt(0).toUpperCase() +
                        selectedLanguage.slice(1)}
                    </span>
                    <span>|</span>
                    <span>
                      Use{" "}
                      <kbd className="px-2 py-0.5 bg-blue-500/10 rounded text-xs text-blue-400">
                        Ctrl+Enter
                      </kbd>{" "}
                      to run code
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs">
                    {isExecuting && "Running..."}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="card bg-gray-800/40 backdrop-blur-sm shadow-xl mt-6 border border-gray-700/30 w-full"
          variants={itemVariants}
        >
          <div className="card-body w-full">
            {submission ? (
              <Submission submission={submission} />
            ) : (
              <>
                <div className="flex items-center justify-between mb-4 w-full">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <span>Test Cases</span>
                    <div className="h-1 w-12 bg-blue-500/30 rounded-full ml-3"></div>
                  </h3>
                  <div className="badge bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {testcases.length} cases
                  </div>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="table w-full">
                    <thead>
                      <tr className="bg-gray-800/50 border-b border-gray-700/50">
                        <th className="font-bold text-gray-300 w-1/2 bg-blue-500/5">Input</th>
                        <th className="font-bold text-gray-300 w-1/2 bg-blue-500/5">
                          Expected Output
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {testcases.map((testCase, index) => (
                        <tr
                          key={index}
                          className="hover:bg-blue-500/5 transition-colors border-b border-gray-800 group"
                        >
                          <td className="font-mono bg-gray-800/30 p-3 text-gray-300 break-words group-hover:bg-blue-500/5 transition-colors">
                            {testCase.input}
                          </td>
                          <td className="font-mono bg-gray-800/30 p-3 text-gray-300 break-words group-hover:bg-blue-500/5 transition-colors">
                            {testCase.output}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProblemPage;