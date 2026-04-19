import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { AuthenticateProvider } from "./context/userAuthenticateContext";
import HomePage from "./pages/home/HomePage";
import AboutPage from "./pages/about_us/AboutPage";
import ErrorPage from "./pages/error/ErrorPage";
import LoginPage from "./pages/auth/Login";
import SignUpPage from "./pages/auth/Signup";
import UserInfoPage from "./pages/user_info/UserInfoPage";
import "./App.css";
import News from "./pages/news_page/News";

function App() {
  const location = useLocation();

  return (
    <AuthenticateProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/profile" element={<UserInfoPage />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/news" element={<News />} />
        </Routes>
      </AnimatePresence>
    </AuthenticateProvider>
  );
}

export default App;
