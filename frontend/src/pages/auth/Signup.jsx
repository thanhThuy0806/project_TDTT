import { useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./auth.module.css";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { InputBox } from "./components/InputBox";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    if (formData.password != formData.confirmPassword) {
      setError("Mật khẩu xác nhận không đúng");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu ít nhất 6 kí tự");
      setIsLoading(false);
      return;
    }

    if (!formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ email và mật khẩu");
      setIsLoading(false);
      return;
    }

    try {
      if (mockUsers[formData.email]) {
        throw new Error("Email đã tồn tại");
      }

      console.log("Đăng ký thành công:", {
        email: formData.email,
        password: formData.password,
      });
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    console.log(`Signup with ${provider}`);
    alert(`Đăng ký với ${provider} (chức năng đang phát triển)`);
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
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Sign up to get started</p>

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

            {/* Confirm Password Input */}
            <InputBox
              type="password"
              name="confirmPassword"
              icon={Lock}
              isPasswordField={true}
              placeholder={"Confirm Password"}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
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

          <motion.button
            type="submit"
            className={styles.submitBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </motion.button>
        </form>

        {/* Social Signup Section */}
        <div className={styles.socialSection}>
          <div className={styles.divider}>
            <span>Or continue with</span>
          </div>
          <div className={styles.socialButtons}>
            <button
              className={`${styles.socialBtn} ${styles.google}`}
              onClick={() => handleSocialSignup("Google")}
            >
              <FaGoogle /> Google
            </button>
            <button
              className={`${styles.socialBtn} ${styles.facebook}`}
              onClick={() => handleSocialSignup("Facebook")}
            >
              <FaFacebook /> Facebook
            </button>
          </div>
        </div>

        <p className={styles.switchText}>
          Have an account?{" "}
          <NavLink to="/login" className={styles.switchButton}>
            Log In
          </NavLink>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;
