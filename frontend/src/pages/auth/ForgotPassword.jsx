import { useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./auth.module.css";
import { Mail, ArrowLeft } from "lucide-react";
import { InputBox } from "./components/InputBox";
// import { confirmInforExist } from "../../../api/authentication";

function ForgotPassword() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Giả lập gọi API gửi OTP
    setTimeout(() => {
      // Điều hướng sang trang nhập OTP
      navigate("/verify-otp", { state: { target: identifier } });
    }, 1500);
  };

  return (
    <div className={styles.mainWrapper}>
      <motion.div
        className={styles.authCard}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <NavLink to="/login" className={styles.backBtn}>
          <ArrowLeft size={20} />
        </NavLink>

        <h1 className={styles.title}>Forgot Password</h1>
        <p className={styles.subtitle}>Enter your email or phone to reset</p>

        <form onSubmit={handleSubmit} style={{ width: "75%" }}>
          <div className={styles.formGrid}>
            <InputBox
              type="text"
              name="identifier"
              icon={Mail}
              placeholder={"Email or Phone number"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <motion.button
            type="submit"
            className={styles.submitBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading || !identifier}
          >
            {isLoading ? "Sending..." : "Get Password"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
