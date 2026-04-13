import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/home/HomePage";
import AboutPage from "./pages/about_us/AboutPage";
import ErrorPage from "./pages/error/ErrorPage";

import LoginPage from "./pages/login_signup/Login";
import SignUpPage from "./pages/login_signup/Signup";

import UserInfoPage from "./pages/user_info/UserInfoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile" element={<UserInfoPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;