import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
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
import { db } from "../../../firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "../../../firebase/firebase";

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
  const navigate = useNavigate();
  const isNewUser = location.state?.isNewUser;
  const { uid } = location.state || {};
  const uidFromAuth = auth.currentUser?.uid;
  const finalUid = uid || uidFromAuth;

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    supportNeed: "None",
    emergencyContactName: "",
    emergencyPhone: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!finalUid) return;
      setLoading(true);
      try {
        const userDoc = await getDoc(doc(db, "users", finalUid));
        if (userDoc.exists()) {
          setFormData(userDoc.data());
        }
      } catch (err) {
        alert("Lỗi lấy dữ liệu: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [finalUid]);

  const handleBack = () => {
    if (isNewUser) {
      navigate("/signup");
    } else {
      navigate("/");
    }
  };

  const handleSave = async () => {
    if (!finalUid) return alert("Thiếu ID người dùng!");
    setLoading(true);

    try {
      await setDoc(doc(db, "users", finalUid), {
        ...formData,
        updateAt: new Date().toISOString(),
      });
      alert("Lưu thông tin thành công!");
      if (isNewUser) {
        navigate("/login");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert("Lỗi lưu dữ liệu: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.mainWrapper}>
      <motion.div
        className={styles.profileCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className={styles.backLink}
          onClick={handleBack}
          whileHover={{ x: -5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          style={{ cursor: "pointer" }}
        >
          <div className={styles.backBtnContent}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </div>
        </motion.div>

        <h1 className={styles.title}>
          {isNewUser
            ? "Welcome! Please enter your information to get started."
            : "User Information"}
        </h1>

        <div className={styles.formGrid}>
          <div className={styles.fullWidth}>
            <InputBox
              label="Full Name"
              value={formData.fullName}
              onChange={(val) => setFormData({ ...formData, fullName: val })}
              placeholder="Enter full name"
            />
          </div>

          <CustomSelect
            label="Gender"
            options={genderOptions}
            selected={formData.gender}
            onSelect={(val) => setFormData({ ...formData, gender: val })}
          />

          <CustomDatePicker
            label="Date of Birth"
            value={formData.dateOfBirth}
            onChange={(val) => setFormData({ ...formData, dateOfBirth: val })}
          />

          <div className={styles.fullWidth}>
            <InputBox
              label="Email"
              value={formData.email}
              onChange={(val) => setFormData({ ...formData, email: val })}
              type="email"
              placeholder="Enter email"
            />
          </div>

          <InputBox
            label="Phone Number"
            value={formData.phone}
            onChange={(val) => setFormData({ ...formData, phone: val })}
            placeholder="Enter phone number"
          />

          <CustomSelect
            label="Accessibility Support Need"
            options={supportOptions}
            selected={formData.supportNeed}
            onSelect={(val) => setFormData({ ...formData, supportNeed: val })}
          />

          <InputBox
            label="Emergency Contact Name"
            value={formData.emergencyContactName}
            onChange={(val) =>
              setFormData({ ...formData, emergencyContactName: val })
            }
            placeholder="Enter contact name"
          />
          <InputBox
            label="Emergency Phone"
            value={formData.emergencyPhone}
            onChange={(val) =>
              setFormData({ ...formData, emergencyPhone: val })
            }
            placeholder="Enter emergency phone"
          />
        </div>

        <motion.button
          className={styles.saveBtn}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Information"}
        </motion.button>
      </motion.div>
    </div>
  );
}

const inputFocusAnimation = {
  focus: {
    scale: 0.98,
    boxShadow: "0px 4px 10px rgba(0,0,133,0.2)",
    borderColor: "#000085",
  },
  exit: {
    scale: 1,
    boxShadow: "4px 4px 10px rgba(147,197,253,0.05)",
    borderColor: "#93c5fd",
  },
};

function InputBox({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className={styles.inputBoxContainer}>
      <label className={styles.inputLabel}>{label}</label>
      <motion.input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.inputField}
        variants={inputFocusAnimation}
        initial="exit"
        whileFocus="focus"
        animate="exit"
      />
    </div>
  );
}

function CustomSelect({ label, options, selected, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const current = options.find((item) => item.label === selected) || options[0];

  return (
    <div className={styles.customSelectWrapper}>
      <div
        className={styles.inputBoxContainer}
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: "pointer" }}
      >
        <label className={styles.inputLabel}>{label}</label>

        <div className={styles.selectTrigger}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <current.icon size={20} color="#004452" />
            <span>{current.label}</span>
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {options.map((item, index) => (
              <div
                key={index}
                className={styles.optionItem}
                onClick={() => {
                  onSelect(item.label);
                  setIsOpen(false);
                }}
              >
                <item.icon size={20} />
                <span>{item.label}</span>

                {current.label === item.label && (
                  <Check
                    size={16}
                    style={{
                      marginLeft: "auto",
                      color: "#000085",
                    }}
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
