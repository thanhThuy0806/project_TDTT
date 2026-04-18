import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, NavLink } from "react-router-dom";
import styles from "./UserInfoPage.module.css";
import {
  Accessibility,
  Ear,
  Glasses,
  PersonStanding,
  User,
  ChevronDown,
  Check,
  Venus,
  Mars,
  CircleUser,
  ArrowLeft,
} from "lucide-react";
import { CustomDatePicker } from "./components/Calander";

const supportOptions = [
  { icon: PersonStanding, label: "None" },
  { icon: Accessibility, label: "Wheelchair" },
  { icon: Glasses, label: "Visual Impairment" },
  { icon: Ear, label: "Hearing Impairment" },
  { icon: User, label: "Elderly Support" },
];

const genderOptions = [
  { icon: Mars, label: "Male" },
  { icon: Venus, label: "Female" },
  { icon: CircleUser, label: "Other" },
];

function UserInfoPage() {
  const location = useLocation();
  const isNewUser = location.state?.isNewUser;

  return (
    <div className={styles.mainWrapper}>
      <motion.div
        className={styles.profileCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Nút quay lại trang /signup */}
        <NavLink to="/signup" className={styles.backLink}>
          <motion.div
            className={styles.backBtnContent}
            whileHover={{ x: -5 }} // Hiệu ứng nhích sang trái khi di chuột
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </motion.div>
        </NavLink>

        <h1 className={styles.title}>
          {isNewUser
            ? "Welcome! Please enter your information to get started."
            : "User Information"}
        </h1>

        <div className={styles.formGrid}>
          <InputBox label="Full Name" placeholder="Enter full name" />
          <div
            className={styles.inputBoxContainer}
            style={{ cursor: "pointer" }}
          >
            <label className={styles.inputLabel} style={{ cursor: "pointer" }}>
              "Date Of Birth
            </label>
            <CustomDatePicker />
          </div>
          <CustomSelect
            label="Gender"
            style={{ cursor: "pointer" }}
            options={genderOptions}
          />

          <InputBox label="Phone Number" placeholder="Enter phone number" />
          <InputBox label="Email" type="email" placeholder="Enter email" />

          <CustomSelect
            label="Accessibility Support Need"
            options={supportOptions}
            style={{ cursor: "pointer" }}
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Save Information
        </motion.button>
      </motion.div>
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

function CustomSelect({ label, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className={styles.customSelectWrapper}>
      <div
        className={styles.inputBoxContainer}
        style={{ cursor: "pointer" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <label className={styles.inputLabel}>{label}</label>

        <div className={styles.selectTrigger}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <selected.icon size={20} color="#004452" />
            <span>{selected.label}</span>
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <ChevronDown size={20} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.dropdownList}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {options.map((item, index) => (
              <div
                key={index}
                className={styles.optionItem}
                onClick={() => {
                  setSelected(item);
                  setIsOpen(false);
                }}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
                {selected.label === item.label && (
                  <Check
                    size={16}
                    style={{ marginLeft: "auto", color: "#000085" }}
                  />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserInfoPage;
