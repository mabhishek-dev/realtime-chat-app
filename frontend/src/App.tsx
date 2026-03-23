import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import { useAuthStore } from "./store/useAuthStore.ts";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore.ts";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("Authenticated User:", authUser);

  if (isCheckingAuth && !authUser) {
    return (
      <>
        <NavBar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader className="w-16 h-16 animate-spin text-gray-500" />
        </div>
      </>
    );
  }

  return (
    <div data-theme={theme}>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />} // Redirect non-authenticated users to login page when trying to access home page
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />} // Redirect authenticated users away from signup page
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />} // Redirect authenticated users away from login page
        />

        {/* Allow access to settings page without authentication for even non-authenticated users to view app settings, but restrict profile page to authenticated users only */}
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />} // Redirect non-authenticated users to login page when trying to access profile page
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
