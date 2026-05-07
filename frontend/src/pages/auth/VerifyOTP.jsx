import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./auth.module.css";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { InputBox } from "./components/InputBox";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const target = location.state?.target || "your device"; // Lấy thông tin từ trang trước

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Giả lập xác thực OTP
    setTimeout(() => {
      alert("Xác thực thành công!");
      setIsLoading(false);
      navigate("/login"); // Hoặc trang reset mật khẩu mới
    }, 1500);
  };

  return (
    <div className={styles.mainWrapper}>
      <motion.div
        className={styles.authCard}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <ArrowLeft size={20} />
        </button>

        <h1 className={styles.title}>Verify OTP</h1>
        <p className={styles.subtitle}>Code sent to: <b>{target}</b></p>

        <form onSubmit={handleVerify} style={{ width: "75%" }}>
          <div className={styles.formGrid}>
            <InputBox
              type="text"
              name="otp"
              icon={ShieldCheck}
              placeholder={"Enter 6-digit code"}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <motion.button
            type="submit"
            className={styles.submitBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading || otp.length < 4}
          >
            {isLoading ? "Verifying..." : "Verify & Continue"}
          </motion.button>

          <p className={styles.switchText}>
            Didn't receive code?{" "}
            <span className={styles.switchButton} onClick={() => alert("Resending...")}>
              Resend
            </span>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default VerifyOTP;