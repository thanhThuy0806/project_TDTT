import { useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/userAuthenticateContext";
import styles from "./auth.module.css";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { InputBox } from "./components/InputBox";



function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Mock users for testing
  const mockUsers = {
    "user@example.com": {
      email: "user@example.com",
      password: "123456",
      name: "Test User",
      role: "user",
    },
    "admin@example.com": {
      email: "admin@example.com",
      password: "admin123",
      name: "Admin User",
      role: "admin",
    },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ email và mật khẩu");
      setIsLoading(false);
      return;
    }

    try {
      const user = mockUsers[formData.email];
      if (!user || user.password !== formData.password) {
        throw new Error("Email hoặc mật khẩu không đúng");
      }

      login({
        ...user,
        loggedInAt: new Date().toISOString(),
      });

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    alert(`Đăng nhập với ${provider} (chức năng đang phát triển)`);
  };

  return (
    <div className={styles.mainWrapper}>
      <motion.div
        className={styles.authCard}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <NavLink to="/" className={styles.backBtn}>
          <ArrowLeft size={20} />
        </NavLink>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to continue</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGrid}>
            {/* Email Input */}
            <InputBox
              type="email"
              name="email"
              icon={Mail}
              placeholder={"Email"}
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            {/* Password Input */}
            <InputBox
              type="password"
              name="password"
              icon={Lock}
              isPasswordField={true}
              placeholder={"Password"}
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className={styles.optionsRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <NavLink to="/forgot-password" className={styles.forgotLink}>
              Forgot password?
            </NavLink>
          </div>

          {error && (
            <motion.div
              className={styles.errorMessage}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            className={styles.submitBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? "Loging in..." : "Log In"}
          </motion.button>
        </form>

        {/* Social Login Section */}
        <div className={styles.socialSection}>
          <div className={styles.divider}>
            <span>Or continue with</span>
          </div>
          <div className={styles.socialButtons}>
            <button
              className={`${styles.socialBtn} ${styles.google}`}
              onClick={() => handleSocialLogin("Google")}
            >
              <FaGoogle /> Google
            </button>
            <button
              className={`${styles.socialBtn} ${styles.facebook}`}
              onClick={() => handleSocialLogin("Facebook")}
            >
              <FaFacebook /> Facebook
            </button>
          </div>
        </div>

        {/* Switch to Signup */}
        <p className={styles.switchText}>
          Don't have an account?{" "}
          <NavLink to="/signup" className={styles.switchButton}>
            Sign Up
          </NavLink>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
