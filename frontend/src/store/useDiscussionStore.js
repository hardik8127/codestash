import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useDiscussionStore = create((set, get) => ({
  discussions: [],
  discussion: [],
  loading: false,
  error: null,

  fetchDiscussions: async (problemId) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(
        `/discussion/get-all-discussions/${problemId}`
      );
      set({ discussions: res.data.allDiscussions || [], loading: false });
    } catch (err) {
      console.error("Failed to fetch discussions:", err);
      set({ error: err.message, loading: false });
    }
  },

  fetchDiscussion: async (discussionId) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get(
        `/discussion/get-discussion/${discussionId}`
      );
      console.log(res.data);
      set({ discussion: res.data.discussion || {}, loading: false });
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      set({ error: err.message, loading: false });
    }
  },
  toggleLike: async (discussionId, userId) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.get(`/discussion/toggle-like/${discussionId}`);
      const updated = get().discussions.map((d) => {
        if (d.id === discussionId) {
          const liked = d.likes.some((l) => l.userId === userId);
          return {
            ...d,
            likes: liked
              ? d.likes.filter((l) => l.userId !== userId)
              : [...d.likes, { userId: userId }],
          };
        }
        return d;
      });
      set({ discussions: updated, loading: false });
    } catch (err) {
      console.error("Failed to toggle like:", err);
      set({ error: err.message, loading: false });
    }
  },

  addCommentToDiscussion: async (discussionId, content) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post(
        `/discussion/add-comment-to-discussion/${discussionId}`,
        content
      );
      // Update the local state with the new comment
      await get().fetchDiscussion(discussionId);
      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error("error in adding comment", error);
      set({ error: error.message, loading: false });
      return false;
    }
  },

  addDiscussion: async (problemId, data) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post(
        `/discussion/create/${problemId}`,
        data
      );
      // Refresh discussions list after adding a new one
      await get().fetchDiscussions(problemId);
      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error("error in adding discussion", error);
      set({ error: error.message, loading: false });
      return false;
    }
  },
  clearError: () => set({ error: null }),
}));
