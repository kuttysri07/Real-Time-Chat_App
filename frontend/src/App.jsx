import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/loginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import { useAuthStore } from "./store/useAuthStore";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";
const App = () => {
  const { authUser, CheckAuth, isCheckingAuth  } = useAuthStore();
  const {theme} =useThemeStore(); 

  useEffect(() => {
    CheckAuth();
  }, [CheckAuth]);

  console.log(authUser);


  if (isCheckingAuth)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to={"/login"} />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to={"/"} />} />
        <Route path="/login" element={!authUser ?<LoginPage />  : <Navigate to={"/"} />} />
        <Route path="/profile" element={authUser ? <ProfilePage />: <Navigate to={"/login"} /> } />
        <Route path="/settings" element={authUser ? <SettingsPage />: <Navigate to={"/login"} /> } />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
