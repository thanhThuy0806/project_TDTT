import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";

import { NavBar } from "./components/NavBar/NavBar";
import { HeroBanner } from "./components/HeroBanner/HeroBanner";
import { TravelMap } from "./components/MapBox/MapBox";
import { NewsCollection } from "./components/NewsCollection/NewsCollection";
import { ResponseDisplay } from "./components/ResponseDisplay/ResponseDisplay";
import { AssistantFloatInput } from "./components/VoiceAssist/VoiceAssistant";
import { Image, Mic, Settings, Siren, User } from "lucide-react";
import styles from "./HomePage.module.css";
import { SecurityModule } from "./components/HeroBanner/modules/SecurityModule";
import { SecurityAlertHub } from "./components/SecurityAlertHub/SecurityAlertHub";

const services = [
  { name: "SOS", icon: Siren, isModal: "sos" },
  { name: "Voice", path: "#", icon: Mic, isAction: true },
  { name: "Picture", path: "/picture", icon: Image },
  { name: "Setting", icon: Settings, isModal: "setting" },
];

const MOCK_LOCATIONS = [
  {
    name: "Núi Bà Đen",
    address: "Thạnh Tân, Tây Ninh",
    status: "Mở cửa: 06:00 - 22:00",
  },
  {
    name: "Tòa Thánh Tây Ninh",
    address: "Phạm Hộ Pháp, Tây Ninh",
    status: "Mở cửa: Cả ngày",
  },
  {
    name: "Hồ Dầu Tiếng",
    address: "Dương Minh Châu, Tây Ninh",
    status: "Mở cửa: Tự do",
  },
  {
    name: "Ma Thiên Lãnh",
    address: "Thạnh Tân, Tây Ninh",
    status: "Mở cửa: 05:00 - 18:00",
  },
  {
    name: "Dinh Độc Lập",
    address: "Quận 1, TP. Hồ Chí Minh",
    status: "Mở cửa: 08:00 - 16:30",
  },
  {
    name: "Bưu điện Thành phố",
    address: "Quận 1, TP. Hồ Chí Minh",
    status: "Mở cửa: 07:00 - 18:00",
  },
  {
    name: "Chợ Bến Thành",
    address: "Quận 1, TP. Hồ Chí Minh",
    status: "Mở cửa: 06:00 - 19:00",
  },
];

// Dữ liệu thành viên từ AboutPage cũ
const members = [
  "Member 01",
  "Member 02",
  "Member 03",
  "Member 04",
  "Member 05",
  "Member 06",
  "Member 07",
  "Member 08",
];

const mockResponse = `# Khám phá Tây Ninh: Đỉnh Núi Bà Đen
Chào mừng bạn đến với nóc nhà Nam Bộ! Dưới đây là lịch trình gợi ý: 
* **Sáng sớm:** Di chuyển bằng cáp treo lên đỉnh núi để săn mây.
* **Trưa:** Thưởng thức đặc sản *Bánh tráng phơi sương* Trảng Bàng.
* **Lưu ý:** Nhiệt độ trên đỉnh thường thấp hơn 3-5 độ so với chân núi.
> Chúc bạn có một chuyến đi an toàn và đầy trải nghiệm!`;

function HomePage() {
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseContent, setResponseContent] = useState("");

  // SETTINGS
  const [showSetting, setShowSetting] = useState(false);
  const [fontSize, setFontSize] = useState("medium");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");

  // SOS
  const [showSOS, setShowSOS] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(10);
  const [sosType, setSosType] = useState("accident");

  const handleAIClick = () => {
    setShowResponse(true);
    setResponseContent(mockResponse);
  };

  return (
    <motion.div
      className={styles.screenContainer}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className={styles.mainWrapper}>
        <NavBar />


        {/* ---- PHẦN BỐ CỤC MỚI (2/3 VÀ 1/3) ---- */}
        <div className={styles.topSection}>
          <div className={styles.heroWrapper}>
            <HeroBanner />
          </div>

          <div className={styles.servicesSidebar}>
            {services.map((service) => (
              <motion.div
                key={service.name}
                className={styles.serviceItemVertical}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (service.isAction) setIsVoiceOpen(true);
                  if (service.isModal === "sos") setShowSOS(true);
                  if (service.isModal === "setting") setShowSetting(true);
                }}
              >
                <NavLink className={styles.navLinkVertical} to={service.path}>
                  <div className={styles.serviceIconWrapperVertical}>
                    <service.icon
                      className={styles.serviceIconLarge}
                      strokeWidth={2}
                      strokeWidth={
                        2
                      } /* Làm viền icon dày hơn chút cho dễ nhìn */
                    />
                  </div>
                  <span className={styles.serviceNameLarge}>
                    {service.name}
                  </span>
                  <span className={styles.serviceNameLarge}>
                    {service.name}
                  </span>
                </NavLink>
              </motion.div>
            ))}
          </div>
        </div>

        <br />
        {/* Khối Bản đồ & Tin tức */}
        <div className={`${styles.contentGrid} ${styles.noScrollbar}`}>
          {/* Khối Bản đồ & Tin tức giữ nguyên */}

          <TravelMap />
          <NewsCollection className={`${styles.noScrollbar}`} />

          <br />

          {/* ================= SETTINGS ================= */}
          <AnimatePresence>
            {showSetting && (
              <motion.div
                className={styles.modalOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className={styles.settingsCard}
                  initial={{ scale: 0.85 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.85 }}
                >
                  <h3 className={styles.settingsTitle}>Settings</h3>

                  <div className={styles.settingsSection}>
                    <p>🔤 Font Size</p>
                    <div className={styles.btnRow}>
                      <button onClick={() => setFontSize("small")}>a</button>
                      <button onClick={() => setFontSize("medium")}>A</button>
                      <button onClick={() => setFontSize("large")}>A</button>
                    </div>
                  </div>

                  <div className={styles.settingsSection}>
                    <p>🌗 Theme</p>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>

                  <div className={styles.settingsSection}>
                    <p>🌐 Language</p>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option>English</option>
                      <option>Vietnamese</option>
                    </select>
                  </div>

                  <button
                    className={styles.applyBtn}
                    onClick={() => setShowSetting(false)}
                  >
                    Apply
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ================= SOS ================= */}
          <AnimatePresence>
            {showSOS && (
              <motion.div
                className={styles.modalOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className={styles.sosCardBig}
                  initial={{ scale: 0.85 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.85 }}
                >
                  <h2 className={styles.sosTitleBig}>🚨 EMERGENCY SOS</h2>

                  <p className={styles.sosWarning}>
                    Bạn sắp gửi tín hiệu khẩn cấp
                  </p>

                  <div className={styles.sosSection}>
                    <p className={styles.sosLabel}>Tình trạng</p>

                    <select
                      className={styles.sosSelect}
                      value={sosType}
                      onChange={(e) => setSosType(e.target.value)}
                    >
                      <option value="accident">Tai nạn</option>
                      <option value="illness">Bệnh / Sức khỏe</option>
                      <option value="danger">Nguy hiểm</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div className={styles.sosBox}>📍 Đang lấy vị trí...</div>

                  <p className={styles.sosCountdownBig}>
                    Tự động gửi sau: {sosCountdown}s
                  </p>

                  <div className={styles.sosBtnRow}>
                    <button
                      className={styles.sosCancel}
                      onClick={() => setShowSOS(false)}
                    >
                      Cancel
                    </button>

                    <button
                      className={styles.sosSend}
                      onClick={() => {
                        setShowSOS(false);
                        alert(`SOS SENT 🚨 Type: ${sosType}`);
                      }}
                    >
                      SEND SOS
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Các Pop-up AI và Floating Button giữ nguyên */}
          {/* Các Pop-up AI và Floating Button giữ nguyên */}
          <AnimatePresence>
            {isVoiceOpen && (
              <AssitantFloatInput onClose={() => setIsVoiceOpen(false)} />
            )}
          </AnimatePresence>
        {/* CÁC POPUP NẰM NGOÀI LUỒNG GIAO DIỆN */}
        <AnimatePresence>
          {isVoiceOpen && (
            <AssistantFloatInput onClose={() => setIsVoiceOpen(false)} />
          )}
        </AnimatePresence>

        <SecurityAlertHub />

          {showResponse && (
            <ResponseDisplay
              content={responseContent}
              onClose={() => setShowResponse(false)}
            />
          )}
        </div>
      </div>

      {/* =========================================================
            PHẦN FOOTER
        ========================================================= */}
      <footer className={styles.footerSection}>
        <div className={styles.footerContainer}>
          {/* CỘT TRÁI: Thành viên nhóm */}
          <h2 className={styles.footerTitle}>Team Members</h2>
          <div className={styles.memberGrid}>
            {members.map((member, index) => (
              <motion.div
                key={index}
                className={styles.memberCard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {member}
              </motion.div>
            ))}
          </div>

          <br />
          {/* Thông tin dự án và liên hệ */}

          <h2 className={styles.footerTitle}>ACCESSIBILITY & SAFETY</h2>
          <p className={styles.footerDesc}>
            This project is designed to support accessible and safe travel
            experiences for everyone, especially elderly people, people with
            disabilities, and users who need emergency support during their
            trips.
          </p>
          
          <br />
          
          <div className={styles.contactCard}>
            <h3 className={styles.contactTitle}>Contact Us</h3>
            <p>📧 Email: team.accessibilitysafety@gmail.com</p>
            <p>💻 GitHub: project_TDTT</p>
            <p>📞 Phone: 0123 456 789</p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}

function InputBox({ label, placeholder, type, className, ...props }) {
  const [isFocus, setIsFocus] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim().length > 0) {
      const filtered = MOCK_LOCATIONS.filter((loc) =>
        loc.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .startsWith(
            value
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, ""),
          ),
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (name) => {
    setInputValue(name);
    setSuggestions([]);
    setIsFocus(false);
  };

  return (
    <div className={styles.inputWrapper}>
      <motion.div
        className={`${className} ${styles.inputBoxContainer} ${styles.relativeZ20}`}
        variants={inputFocusAnimation}
        initial="exit"
        animate={isFocus ? "focus" : "exit"}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <label className={styles.inputLabel}>{label}</label>
        <input
          placeholder={placeholder}
          type={type}
          value={inputValue}
          className={`${styles.inputField} ${styles.noScrollbar}`}
          onChange={handleInputChange}
          onFocus={() => setIsFocus(true)}
          onBlur={() => {
            setTimeout(() => setIsFocus(false), 200);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.target.blur();
          }}
        />
      </motion.div>

      <AnimatePresence>
        {isFocus && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.suggestionsPopup}
          >
            <div
              className={`${styles.suggestionsScroll} ${styles.noScrollbar}`}
            >
              {suggestions.map((loc, index) => (
                <div
                  key={index}
                  className={styles.suggestionItem}
                  onClick={() => handleSelect(loc.name)}
                >
                  <div className={styles.suggestionHeader}>
                    <span className={styles.locationName}>{loc.name}</span>
                    <span className={styles.statusBadge}>{loc.status}</span>
                  </div>
                  <div className={styles.addressText}>📍 {loc.address}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Cập nhật Animation: Thêm boxShadow để tạo hiệu ứng nhấn
const inputFocusAnimation = {
  focus: {
    scale: 0.98,
    boxShadow: "0px 4px 10px rgb(0, 0, 133, 0.2)",
    borderColor: "#000085",
  },
  exit: {
    scale: 1,
    boxShadow: "4px 4px 10px rgb(147, 197, 253, 0.05)",
    borderColor: "#93c5fd",
  },
};

export default HomePage;

// Hiệu ứng khi vào hoặc ra khỏi trang Homepage
const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};
