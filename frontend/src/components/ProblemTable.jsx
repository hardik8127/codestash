import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Bookmark, PencilIcon, Trash, TrashIcon, Plus, CheckCircle, Circle } from "lucide-react";
import { useActions } from "../store/useAction";
import AddToPlaylistModal from "./AddToPlaylist";
import CreatePlaylistModal from "./CreatePlaylistModal";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { motion } from "framer-motion";

const ProblemsTable = ({ problems }) => {
  const { authUser } = useAuthStore();
  const { onDeleteProblem } = useActions();
  const { createPlaylist } = usePlaylistStore();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  // Extract all unique tags from problems
  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [problems]);

  // Define allowed difficulties
  const difficulties = ["EASY", "MEDIUM", "HARD"];

  // Filter problems based on search, difficulty, and tags
  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((problem) =>
        difficulty === "ALL" ? true : problem.difficulty === difficulty
      )
      .filter((problem) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
      );
  }, [problems, search, difficulty, selectedTag]);

  // Pagination logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProblems, currentPage]);

  const handleDelete = (id) => {
    onDeleteProblem(id);
  };

  const handleCreatePlaylist = async (data) => {
    await createPlaylist(data);
  };

  const handleAddToPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  };

  return (
    <motion.div 
      className="w-full max-w-5xl mx-auto px-4 sm:px-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div 
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-t-xl p-4 sm:p-6 shadow-lg"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h2 className="text-2xl font-bold text-white">Problems</h2>
            <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30 w-fit">
              {filteredProblems.length} available
            </div>
          </div>
          <motion.button
            className="px-6 py-2 bg-blue-600 rounded-md font-medium text-white flex items-center justify-center gap-2 hover:bg-blue-700 transition-all w-full sm:w-auto"
            onClick={() => setIsCreateModalOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4" />
            Create Playlist
          </motion.button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by title..."
            className="px-4 py-2 bg-gray-900/50 border border-gray-700/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 bg-gray-900/50 border border-gray-700/30 rounded-md text-white focus:outline-none focus:border-blue-500 transition-colors"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="ALL">All Difficulties</option>
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <select
            className="px-4 py-2 bg-gray-900/50 border border-gray-700/30 rounded-md text-white focus:outline-none focus:border-blue-500 transition-colors sm:col-span-2 lg:col-span-1"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="ALL">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div 
        className="bg-gray-800/30 backdrop-blur-sm border-x border-b border-gray-700/30 rounded-b-xl overflow-hidden shadow-lg"
        variants={itemVariants}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50 border-b border-gray-700/30">
              <tr>
                <th className="px-3 sm:px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="px-3 sm:px-6 py-4 text-left text-sm font-semibold text-gray-300">Title</th>
                <th className="px-3 sm:px-6 py-4 text-left text-sm font-semibold text-gray-300 hidden lg:table-cell">Tags</th>
                <th className="px-3 sm:px-6 py-4 text-center text-sm font-semibold text-gray-300 hidden sm:table-cell">Difficulty</th>
                <th className="px-3 sm:px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProblems.length > 0 ? (
                paginatedProblems.map((problem) => {
                  const isSolved = problem.solvedBy.some(
                    (user) => user.userId === authUser?.id
                  );
                  return (
                    <motion.tr 
                      key={problem.id} 
                      className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                      variants={itemVariants}
                    >
                      <td className="px-3 sm:px-6 py-4">
                        <div className="flex items-center justify-center w-6 h-6">
                          {isSolved ? (
                            <CheckCircle className="w-5 h-5 text-blue-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        <Link to={`/problem/${problem.id}`} className="font-semibold text-white hover:text-blue-400 transition-colors text-sm sm:text-base">
                          {problem.title}
                        </Link>
                        {/* Show difficulty on mobile under title */}
                        <div className="sm:hidden mt-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              problem.difficulty === "EASY"
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : problem.difficulty === "MEDIUM"
                                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {(problem.tags || []).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded border border-gray-700/50"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-center hidden sm:table-cell">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            problem.difficulty === "EASY"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : problem.difficulty === "MEDIUM"
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        <div className="flex justify-center gap-1 sm:gap-2">
                          {authUser?.role === "ADMIN" && (
                            <div className="flex gap-1 sm:gap-2">
                              <button
                                onClick={() => handleDelete(problem.id)}
                                className="p-1.5 sm:p-2 bg-red-500/20 text-red-400 rounded border border-red-500/30 hover:bg-red-500/30 transition-colors"
                                title="Delete problem"
                              >
                                <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button 
                                className="p-1.5 sm:p-2 bg-gray-500/20 text-gray-400 rounded border border-gray-500/30"
                                title="Edit problem"
                              >
                                <PencilIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          )}
                          <button
                            className="p-1.5 sm:p-2 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30 hover:bg-blue-500/30 transition-colors flex items-center gap-1 sm:gap-2"
                            onClick={() => handleAddToPlaylist(problem.id)}
                            title="Add to playlist"
                          >
                            <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-3 sm:px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                        <Code className="w-8 h-8 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-gray-300 font-medium">No problems found</p>
                        <p className="text-gray-500 text-sm">Try adjusting your filters</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 border-t border-gray-700/30 bg-gray-900/30">
            <div className="text-sm text-gray-400 text-center sm:text-left">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredProblems.length)} of{" "}
              {filteredProblems.length} problems
            </div>
            <div className="flex gap-2 justify-center sm:justify-end">
              <button
                className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded border border-gray-700/30 hover:bg-gray-600/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Prev
              </button>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30 text-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded border border-gray-700/30 hover:bg-gray-600/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />
      
      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        problemId={selectedProblemId}
      />
    </motion.div>
  );
};

export default ProblemsTable;