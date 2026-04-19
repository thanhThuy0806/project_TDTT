import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/home/HomePage";
import Login from "./pages/login_signup/Login";
import SignUpPage from "./pages/login_signup/Signup";
import AboutPage from "./pages/about_us/AboutPage";
import UserInfoPage from "./pages/user_info/UserInfoPage";
import ErrorPage from "./pages/error/ErrorPage";

import { AuthenticateProvider } from "./context/userAuthenticateContext";

function App() {
  return (
    <AuthenticateProvider>
      <BrowserRouter>
        <Routes>
          {/* Trang chính */}
          <Route path="/" element={<HomePage />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Các trang khác */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profile" element={<UserInfoPage />} />

          {/* Trang lỗi */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </AuthenticateProvider>
  );
}

export default App;