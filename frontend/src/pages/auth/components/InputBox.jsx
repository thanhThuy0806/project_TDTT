import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import styles from "./inputbox.module.css";

const inputFocusAnimation = {
  focus: {
    scale: 0.98,
    boxShadow: "0px 4px 10px rgba(0, 0, 133, 0.2)",
    borderColor: "#000085",
  },
  exit: {
    scale: 1,
    boxShadow: "4px 4px 10px rgba(147, 197, 253, 0.05)",
    borderColor: "#93c5fd",
  },
};

export function InputBox({ label, icon: Icon, isPasswordField, ...props }) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : props.type;

  return (
    <motion.div
      className={styles.inputBoxContainer}
      variants={inputFocusAnimation}
      animate={isFocused ? "focus" : "exit"}
    >
      {Icon && (
        <div className={styles.inputIcon}>
          <Icon size={18} />
        </div>
      )}
      <div className={styles.inputWrapper}>
        <label className={styles.inputLabel}>{label}</label>
        <input
          {...props}
          type={inputType}
          className={styles.inputField}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      {isPasswordField && (
        <button
          type="button"
          className={styles.eyeButton}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className={styles.focusBorder}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
