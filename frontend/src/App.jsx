import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import SignUpPage from "./page/SignUpPage";
import LandingPage from "./page/LandingPage";
import ForgotPasswordPage from "./page/ForgotPasswordPage";
import ResetPasswordPage from "./page/ResetPasswordPage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import Layout from "./layout/Layout";
import LandingLayout from "./layout/LandingLayout";
import AdminRoute from "./components/AdminRoute";
import AddProblem from "./page/AddProblem";
import ProblemPage from "./page/ProblemPage";
import Profile from "./page/Profile";
import ComingSoon from "./components/ComingSoon";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <div className="w-full">
      <Toaster />      <Routes>
        {/* Landing page as the default route */}
        <Route path="/" element={
          <LandingLayout>
            <LandingPage />
          </LandingLayout>
        } />
        
        {/* Protected homepage at /home */}
        <Route path="/home" element={<Layout />}>
          <Route
            index
            element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
          />
        </Route>        
        <Route
          path="/login"
          element={!authUser ? (
            <LandingLayout>
              <LoginPage />
            </LandingLayout>
          ) : <Navigate to={"/home"} />}
        />

        <Route
          path="/signup"
          element={!authUser ? (
            <LandingLayout>
              <SignUpPage />
            </LandingLayout>
          ) : <Navigate to={"/home"} />}
        />

        <Route
          path="/forgot-password"
          element={!authUser ? (
            <LandingLayout>
              <ForgotPasswordPage />
            </LandingLayout>
          ) : <Navigate to={"/home"} />}
        />

        <Route
          path="/reset/:token"
          element={!authUser ? (
            <LandingLayout>
              <ResetPasswordPage />
            </LandingLayout>
          ) : <Navigate to={"/home"} />}
        /><Route
          path="/problem/:id"
          element={authUser ? <ProblemPage /> : <Navigate to={"/login"} />}
        />

        <Route element={<AdminRoute />}>
          <Route
            path="/add-problem"
            element={authUser ? <AddProblem /> : <Navigate to="/login" />}
          />
        </Route>
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
        <Route path="/sheets" element={<ComingSoon />} />
        <Route path="/contests" element={<ComingSoon />} />
      </Routes>
    </div>
  );
};

export default App;
