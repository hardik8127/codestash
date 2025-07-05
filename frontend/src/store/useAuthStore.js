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
      } else {
        console.log("No user data in checkAuth response or different structure:", res.data);
        // Try to find user data in different locations
        const userData = res.data.userData || res.data || null;
        console.log("Attempting to use this as user data:", userData);
        set({ authUser: userData });
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

      if (res.data && res.data.user) {
        console.log("User data from signup:", res.data.user);
        set({ authUser: res.data.user });
      } else {
        console.log("User data structure is different in signup response:", res.data);
        // Try to find user data in the response
        const userData = res.data.userData || res.data || null;
        console.log("Attempting to use this as user data:", userData);
        set({ authUser: userData });
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
      if (res.data && res.data.user) {
        console.log("User data from response:", res.data.user);
        set({ authUser: res.data.user });
      } else {
        console.log("User data structure is different than expected. Full response:", res.data);
        // Try to find user data in the response
        const userData = res.data.userData || res.data || {};
        console.log("Attempting to use this as user data:", userData);
        set({ authUser: userData });
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
}));
