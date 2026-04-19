import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useState } from "react";

import { NavBar } from "./components/NavBar";
import { HeroBanner } from "./components/hero_banner/HeroBanner";
import { TravelMap } from "./components/MapBox";
import { NewsCollection } from "./components/NewsCollection";
import { ResponseDisplay } from "./components/ResponeDisplay";
import { AssitantFloatInput } from "./components/voice_assist/VoiceAssistant";

import { Image, Mic, Settings, Siren } from "lucide-react";
import styles from "./HomePage.module.css";

// SERVICES
const services = [
  { name: "SOS", icon: Siren },
  { name: "Voice", icon: Mic, isAction: true },
  { name: "Picture", path: "/picture", icon: Image },
  { name: "Setting", icon: Settings },
];

const mockResponse = `Khám phá Tây Ninh...`;

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
    <div className={styles.screenContainer}>
      <div className={styles.mainWrapper}>
        <NavBar />
        <HeroBanner />

        {/* SEARCH */}
        <div className={styles.searchSection}>
          <div className={styles.inputGrid}>
            <InputBox label="From" />
            <InputBox label="To" />
          </div>

          <NavLink to="/search-results" className={styles.searchBtn}>
            Search
          </NavLink>
        </div>

        {/* SERVICES */}
        <div className={styles.servicesGridContainer}>
          <div className={styles.servicesGrid}>
            {services.map((service) => (
              <motion.div
                key={service.name}
                className={styles.serviceItem}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (service.name === "SOS") setShowSOS(true);
                  if (service.name === "Setting") setShowSetting(true);
                  if (service.isAction) setIsVoiceOpen(true);
                }}
              >
                {service.path ? (
                  <NavLink to={service.path} className={styles.navLink}>
                    <div className={styles.serviceButton}>
                      <service.icon className={styles.serviceIcon} />
                      <span className={styles.serviceName}>
                        {service.name}
                      </span>
                    </div>
                  </NavLink>
                ) : (
                  <div className={styles.serviceButton}>
                    <service.icon className={styles.serviceIcon} />
                    <span className={styles.serviceName}>
                      {service.name}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className={`${styles.contentGrid} ${styles.noScrollbar}`}>
          <TravelMap />
          <NewsCollection />
        </div>

        {/* VOICE */}
        <AnimatePresence>
          {isVoiceOpen && (
            <AssitantFloatInput onClose={() => setIsVoiceOpen(false)} />
          )}
        </AnimatePresence>

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

                <div className={styles.sosBox}>
                  📍 Đang lấy vị trí...
                </div>

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

        {/* AI BUTTON */}
        <motion.div
          className={styles.aiFloatingBtn}
          onClick={handleAIClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          AI
        </motion.div>

        {showResponse && (
          <ResponseDisplay
            content={responseContent}
            onClose={() => setShowResponse(false)}
          />
        )}
      </div>
    </div>
  );
}

// INPUT BOX
function InputBox({ label }) {
  const [value, setValue] = useState("");

  return (
    <div className={styles.inputBoxContainer}>
      <label className={styles.inputLabel}>{label}</label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={styles.inputField}
        placeholder="Type..."
      />
    </div>
  );
}

export default HomePage;