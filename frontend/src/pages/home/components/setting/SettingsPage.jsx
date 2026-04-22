import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./SettingsPage.module.css";

export function SettingsModal({ show, onClose, onApply }) {
  const [fontSize, setFontSize] = useState("medium");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");

  const handleApply = () => {
    onApply({ fontSize, darkMode, language });
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.card}
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.85 }}
          >
            <h2 className={styles.title}>Settings</h2>

            <div className={styles.section}>
              <p>Font Size</p>
              <div className={styles.buttonGroup}>
                <button
                  onClick={() => setFontSize("small")}
                  className={fontSize === "small" ? styles.active : ""}
                >
                  a
                </button>
                <button
                  onClick={() => setFontSize("medium")}
                  className={fontSize === "medium" ? styles.active : ""}
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize("large")}
                  className={fontSize === "large" ? styles.active : ""}
                >
                  A+
                </button>
              </div>
            </div>

            <div className={styles.section}>
              <p>Theme</p>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  id="darkMode"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.section}>
              <p>Language</p>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option>English</option>
                <option>Tiếng Việt</option>
              </select>
            </div>

            <button className={styles.applyBtn} onClick={handleApply}>
              Apply
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
