import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { NavBar } from "../home/components/NavBar";
import styles from "./UserInfoPage.module.css";

function UserInfoPage() {
  const location = useLocation();
  const isNewUser = location.state?.isNewUser;

  return (
    <div className={styles.mainWrapper}>
      <NavBar />

      <div className={styles.profileCard}>
        <h1 className={styles.title}>
            {isNewUser
              ? "Welcome to Accessibility & Safety! Please enter your information to get started."
              : "User Information"}
          </h1>

        <div className={styles.formGrid}>
          <InputBox label="Full Name" placeholder="Enter full name" />
          <InputBox label="Date of Birth" type="date" />

          <SelectBox
            label="Gender"
            options={["Male", "Female"]}
          />

          <InputBox
            label="Phone Number"
            placeholder="Enter phone number"
          />

          <InputBox
            label="Email"
            type="email"
            placeholder="Enter email"
          />

          <SelectBox
            label="Accessibility Support Need"
            options={[
              "None",
              "Wheelchair",
              "Visual Impairment",
              "Hearing Impairment",
              "Elderly Support",
            ]}
          />

          <InputBox
            label="Emergency Contact Name"
            placeholder="Enter contact name"
          />

          <InputBox
            label="Emergency Phone"
            placeholder="Enter emergency phone"
          />
        </div>

        <motion.button
          className={styles.saveBtn}
          whileTap={{ scale: 0.95 }}
        >
          Save Information
        </motion.button>
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

function SelectBox({ label, options }) {
  return (
    <div className={styles.inputBoxContainer}>
      <label className={styles.inputLabel}>{label}</label>
      <select className={styles.inputField}>
        {options.map((option, index) => (
          <option key={index}>{option}</option>
        ))}
      </select>
    </div>
  );
}

export default UserInfoPage;