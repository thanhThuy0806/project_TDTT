import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { NavBar } from "../home/components/NavBar";
import styles from "./Login_Signup.module.css";

function Signup() {
  const navigate = useNavigate();

  return (
    <div className={styles.mainWrapper}>
      <NavBar />

      <div className={styles.authCard}>
        <h1 className={styles.title}>Sign Up</h1>

        <div className={styles.formGrid}>
          <InputBox
            label="Email"
            type="email"
            placeholder="Enter email"
          />
          <InputBox
            label="Password"
            type="password"
            placeholder="Create password"
          />
        </div>

        <div className={styles.buttonRow}>
          <motion.button
            className={styles.backBtn}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
          >
            Back
          </motion.button>

          <motion.button
            className={styles.nextBtn}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              navigate("/profile", {
                state: { isNewUser: true },
              })
            }
          >
            Next
          </motion.button>
        </div>

        <p className={styles.switchText}>
          Bạn đã có tài khoản?{" "}
          <NavLink to="/login">Log In</NavLink>
        </p>
      </div>
    </div>
  );
}

function InputBox({ label, placeholder, type = "text" }) {
  return (
    <div className={styles.inputBoxContainer}>
      <label className={styles.inputLabel}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className={styles.inputField}
      />
    </div>
  );
}

export default Signup;