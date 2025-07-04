import { useEffect, useState } from "react";
import { useDiscussionStore } from "../store/useDiscussionStore";
import {
  ArrowDown,
  MessageCircle,
  MessageSquare,
  Plus,
  ThumbsUp,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
export default function DiscussionList({ problemId }) {
  const { authUser } = useAuthStore();
  const [activeTextboxId, setActiveTextboxId] = useState(null); // track which comment box is open
  const [comment, setComment] = useState(""); // single comment input
  const [visibleComments, setVisibleComments] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    discussions,
    discussion: disc,
    fetchDiscussions,
    fetchDiscussion,
    toggleLike,
    addCommentToDiscussion,
    addDiscussion,
    loading: discussionLoading,
  } = useDiscussionStore();

  useEffect(() => {
    const loadDiscussions = async () => {
      try {
        setLoading(true);
        await fetchDiscussions(problemId);
      } catch (error) {
        console.error("Error loading discussions:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDiscussions();
  }, [problemId, fetchDiscussions]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        title: z.string().min(3, "Title must be at least 3 characters"),
        content: z.string().min(10, "Content must be at least 10 characters"),
      })
    ),
  });

  const onSubmit = async (data) => {
    try {
      await addDiscussion(problemId, data);
      await fetchDiscussions(problemId); // Refresh discussions after adding a new one
      setShowModal(false);
    } catch (error) {
      console.log("error in adding discussion", error);
    }
  };

  const addComment = async (id, content) => {
    if (!content.trim()) return; // Don't add empty comments
    
    try {
      setActiveTextboxId(null); // Close the comment box
      const data = { content };
      await addCommentToDiscussion(id, data);
      
      // Update visible comments for this discussion
      setVisibleComments(prev => ({
        ...prev,
        [id]: true // Ensure comments are visible after adding
      }));
      
      // Refresh all discussions to get updated comment count
      await fetchDiscussions(problemId);
      
      // Also fetch the updated discussion to get the new comment
      await fetchDiscussion(id);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const showComments = async (id) => {
    try {
      await fetchDiscussion(id);
      setVisibleComments(prev => ({
        ...prev,
        [id]: !prev[id]
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {loading || discussionLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-10 h-10 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading discussions...</p>
        </div>
      ) : discussions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <MessageSquare className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-100">
              No discussions yet
            </h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Be the first to start a discussion about this problem
            </p>
          </div>
        </div>
      ) : (
        discussions.map((discussion) => (
          <div
            key={discussion.id}
            className="border border-gray-700 rounded-lg p-5 bg-gray-800 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 overflow-hidden rounded-full">
                  <img
                    src={discussion.user.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-100">
                    {discussion.user.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(discussion.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-semibold text-white">
                {discussion.title}
              </h3>
              <p className="text-gray-300">
                {discussion.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLike(discussion.id, authUser.id)}
                  className="flex items-center gap-1.5 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <ThumbsUp size={16} />
                  <span className="text-sm">{discussion.likes.length}</span>
                </button>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <MessageCircle size={16} />
                  <span className="text-sm">
                    {discussion.comments.length} comments
                  </span>
                </div>
              </div>

              <button
                onClick={() => showComments(discussion.id)}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <ArrowDown size={18} />
              </button>
            </div>

            <div className="mt-4">
              <button
                onClick={() => {
                  if (authUser) {
                    setActiveTextboxId(
                      activeTextboxId === discussion.id ? null : discussion.id
                    );
                  } else {
                    alert("Please login to add a comment");
                  }
                }}
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Plus size={16} />
                Add Comment
              </button>

              {activeTextboxId === discussion.id && (
                <div className="mt-3 flex items-center gap-2">
                  <input
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                    type="text"
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                    placeholder="Write your comment..."
                  />
                  <Button
                    onClick={() => {
                      if (comment.trim()) {
                        addComment(discussion.id, comment);
                        setComment("");
                      }
                    }}
                    buttonText="Post"
                    Icon={Plus}
                  />
                </div>
              )}
            </div>

            {visibleComments[discussion.id] && (
              <div className="mt-4 space-y-4">
                {disc && disc.id === discussion.id && disc.comments && disc.comments.length > 0 ? (
                  disc.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 overflow-hidden rounded-full flex-shrink-0">
                        <img
                          src={comment.user.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-100">
                          {comment.user.name}
                        </div>
                        <div className="text-sm text-gray-300 mt-1">
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-2">
                    No comments yet
                  </p>
                )}
              </div>
            )}
          </div>
        ))
      )}

      <div className="mt-6">
        <Button
          buttonText="Start Discussion"
          Icon={Plus}
          onClick={() => {
            if (authUser) {
              setShowModal(true);
            } else {
              alert("Please login to start a discussion");
            }
          }}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-white mb-4">
              Start a new discussion
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  {...register("title")}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Content
                </label>
                <textarea
                  {...register("content")}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.content.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}