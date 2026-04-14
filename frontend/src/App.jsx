// routes
import { Route, Routes, useLocation } from "react-router-dom";
// components
import HomePage from "./pages/home/HomePage";
import AboutPage from "./pages/about_us/AboutPage";
import ErrorPage from "./pages/error/ErrorPage";
import LoginPage from "./pages/login_signup/Login";
import SignUpPage from "./pages/login_signup/Signup";
import UserInfoPage from "./pages/user_info/UserInfoPage";
// styles and effect(motion, v.v...)
import { AnimatePresence} from "framer-motion";

function App() {
  const location = useLocation();

  return (
    
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/profile" element={<UserInfoPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AnimatePresence>
  );
}

export default App;
