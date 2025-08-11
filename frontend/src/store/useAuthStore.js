import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      console.log("checkauth response", res.data);

      if (res.data && res.data.user) {
        console.log("User data from checkAuth:", res.data.user);
        set({ authUser: res.data.user });
      } else if (res.data && res.data.User) {
        // Handle the capitalized User field from your backend responses
        console.log("User data from checkAuth (capitalized):", res.data.User);
        set({ authUser: res.data.User });
      } else {
        console.log("No user data in checkAuth response:", res.data);
        set({ authUser: null });
      }
    } catch (error) {
      console.log("❌ Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigninUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      console.log("Signup response:", res.data);

      if (res.data && res.data.User) {
        console.log("User data from signup:", res.data.User);
        set({ authUser: res.data.User });
      } else if (res.data && res.data.user) {
        console.log("User data from signup (lowercase):", res.data.user);
        set({ authUser: res.data.user });
      } else {
        console.log("User data structure is different in signup response:", res.data);
        set({ authUser: null });
      }

      toast.success(res.data.message || "Signup successful");
    } catch (error) {
      console.log("Error signing up", error);
      toast.error(error.response?.data?.message || "Error signing up");
    } finally {
      set({ isSigninUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      console.log("Login attempt with:", data);
      const res = await axiosInstance.post("/auth/login", data);
      
      console.log("Full login response:", res);
      console.log("Login response data:", res.data);
      
      // Check the actual structure of the response
      if (res.data && res.data.User) {
        console.log("User data from login response (capitalized):", res.data.User);
        set({ authUser: res.data.User });
      } else if (res.data && res.data.user) {
        console.log("User data from login response (lowercase):", res.data.user);
        set({ authUser: res.data.user });
      } else {
        console.log("User data structure is different than expected. Full response:", res.data);
        set({ authUser: null });
      }
      
      toast.success(res.data.message || "Login successful");
      return res.data; // Return data so we can check in component
    } catch (error) {
      console.log("Error logging in", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error logging in");
      throw error; // Re-throw the error so we can catch it in the component
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });

      toast.success("Logout successful");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error("Error logging out");
    }
  },

  forgotPassword: async (email) => {
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      toast.success(res.data.message || "Password reset email sent");
      return res.data;
    } catch (error) {
      console.log("Error sending reset email", error);
      toast.error(error.response?.data?.message || "Error sending reset email");
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    try {
      const res = await axiosInstance.post(`/auth/reset/${token}`, { password });
      toast.success(res.data.message || "Password reset successful");
      return res.data;
    } catch (error) {
      console.log("Error resetting password", error);
      toast.error(error.response?.data?.message || "Error resetting password");
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const res = await axiosInstance.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      toast.success(res.data.message || "Password changed successfully");
      return res.data;
    } catch (error) {
      console.log("Error changing password", error);
      toast.error(error.response?.data?.message || "Error changing password");
      throw error;
    }
  },
}));
