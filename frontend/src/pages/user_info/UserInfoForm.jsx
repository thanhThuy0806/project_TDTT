import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./UserInfo.module.css";

function InputBox({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  required = false,
}) {
  return (
    <div className={styles.inputBoxContainer}>
      <label className={styles.inputLabel}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={styles.inputField}
        value={value || ""}
        onChange={onChange}
      />
    </div>
  );
}

function SelectBox({ label, options, value, onChange, required = false }) {
  return (
    <div className={styles.inputBoxContainer}>
      <label className={styles.inputLabel}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <select
        className={styles.inputField}
        value={value || ""}
        onChange={onChange}
      >
        <option value="">Select...</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function UserInfoForm({
  initialData,
  onSave,
  onCancel,
  isNewUser = false,
}) {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    dateOfBirth: initialData?.dateOfBirth || "",
    gender: initialData?.gender || "",
    phoneNumber: initialData?.phoneNumber || "",
    email: initialData?.email || "",
    accessibilityNeed: initialData?.accessibilityNeed || "",
    emergencyContactName: initialData?.emergencyContactName || "",
    emergencyPhone: initialData?.emergencyPhone || "",
  });

  const handleChange = (field, e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <InputBox
          label="Full Name"
          placeholder="Enter full name"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e)}
          required
        />
        <InputBox
          label="Date of Birth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleChange("dateOfBirth", e)}
        />
        <SelectBox
          label="Gender"
          options={["Male", "Female", "Other"]}
          value={formData.gender}
          onChange={(e) => handleChange("gender", e)}
        />
        <InputBox
          label="Phone Number"
          placeholder="Enter phone number"
          value={formData.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e)}
        />
        <InputBox
          label="Email"
          type="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={(e) => handleChange("email", e)}
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
          value={formData.accessibilityNeed}
          onChange={(e) => handleChange("accessibilityNeed", e)}
        />
        <InputBox
          label="Emergency Contact Name"
          placeholder="Enter contact name"
          value={formData.emergencyContactName}
          onChange={(e) => handleChange("emergencyContactName", e)}
        />
        <InputBox
          label="Emergency Phone"
          placeholder="Enter emergency phone"
          value={formData.emergencyPhone}
          onChange={(e) => handleChange("emergencyPhone", e)}
        />
      </div>

      <div className={styles.buttonGroup}>
        {!isNewUser && (
          <motion.button
            type="button"
            className={styles.cancelBtn}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
          >
            Cancel
          </motion.button>
        )}
        <motion.button
          type="submit"
          className={styles.saveBtn}
          whileTap={{ scale: 0.95 }}
        >
          {isNewUser ? "Save Information" : "Update Information"}
        </motion.button>
      </div>
    </form>
  );
}
