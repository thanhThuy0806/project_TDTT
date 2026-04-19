import { motion } from "framer-motion";
import { NavBar } from "../home/components/NavBar";
import styles from "./SettingsPage.module.css";

function SettingsPage() {
  return (
    <div className={styles.mainWrapper}>
      <NavBar />

      <div className={styles.settingCard}>
        <h1 className={styles.title}>Settings</h1>

        <div className={styles.formGrid}>
          <SelectBox
            label="Font Size"
            options={["Small", "Medium", "Large"]}
          />

          <SelectBox
            label="Font Style"
            options={["Arial", "Roboto", "Times New Roman"]}
          />

          <SelectBox
            label="Theme Mode"
            options={["Light", "Dark"]}
          />

          <SelectBox
            label="Color Theme"
            options={[
              "Blue",
              "Green",
              "Beige",
              "High Contrast",
            ]}
          />

          <SelectBox
            label="Language"
            options={["English", "Vietnamese"]}
          />

          <SelectBox
            label="Accessibility Support"
            options={[
              "Normal",
              "Large Text",
              "Screen Reader Friendly",
              "High Contrast",
            ]}
          />
        </div>

        <motion.button
          className={styles.saveBtn}
          whileTap={{ scale: 0.95 }}
        >
          Save Settings
        </motion.button>
      </div>
    </div>
  );
}

function SelectBox({ label, options }) {
  return (
    <div className={styles.inputBoxContainer}>
      <label className={styles.inputLabel}>
        {label}
      </label>

      <select className={styles.inputField}>
        {options.map((option, index) => (
          <option key={index}>{option}</option>
        ))}
      </select>
    </div>
  );
}

export default SettingsPage;