import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useSubmissionStore = create((set, get) => ({
  isLoading: false,
  submissions: [],
  submission: null,
  submissionCount: null,

  getAllSubmissions: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/submission/get-all-submissions");
      
      // Get current user ID from auth store
      const authUser = useAuthStore.getState().authUser;
      console.log("Current auth user:", authUser);
      
      // Filter submissions to only include current user's submissions
      let userSubmissions = res.data.submissions;
      if (authUser && authUser.id) {
        console.log("Filtering submissions for user ID:", authUser.id);
        userSubmissions = res.data.submissions.filter(
          submission => submission.userId === authUser.id
        );
        console.log("Filtered submissions:", userSubmissions);
      } else {
        console.log("No user ID found for filtering submissions");
      }

      set({ submissions: userSubmissions });
      toast.success(res.data.message || "Submissions retrieved successfully");
    } catch (error) {
      console.log("Error getting all submissions", error);
      toast.error("Error getting all submissions");
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionForProblem: async (problemId) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-submission/${problemId}`
      );
      
      // Get current user ID from auth store
      const authUser = useAuthStore.getState().authUser;
      console.log("Current auth user for problem submissions:", authUser);
      
      // Filter submissions to only include current user's submissions
      let userSubmissions = res.data.submissions;
      if (authUser && authUser.id) {
        console.log("Filtering problem submissions for user ID:", authUser.id);
        userSubmissions = res.data.submissions.filter(
          submission => submission.userId === authUser.id
        );
        console.log("Filtered problem submissions:", userSubmissions);
      } else {
        console.log("No user ID found for filtering problem submissions");
      }

      set({ submission: userSubmissions });
    } catch (error) {
      console.log("Error getting submissions for problem", error);
      toast.error("Error getting submissions for problem");
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionCountForProblem: async (problemId) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-submissions-count/${problemId}`
      );                

      set({ submissionCount: res.data.count });
    } catch (error) {
      console.log("Error getting submission count for problem", error);
      toast.error("Error getting submission count for problem");
    }
  },
}));