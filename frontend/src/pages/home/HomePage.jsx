import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { NavBar } from "./components/NavBar/NavBar";
import { HeroBanner } from "./components/HeroBanner/HeroBanner";
import { TravelMap } from "./components/MapBox/MapBox";
import { NewsCollection } from "./components/NewsCollection/NewsCollection";
import { ResponseDisplay } from "./components/ResponseDisplay/ResponseDisplay";
import { AssitantFloatInput } from "./components/VoiceAssist/VoiceAssistant";
import { UserPen, Mic, Settings, Siren } from "lucide-react";
import { auth } from "../../../firebase/firebase";
import styles from "./HomePage.module.css";
import { SettingsModal } from "./components/setting/SettingsPage";
import { SOSModal } from "./components/sos/SosButton";
import { SecurityAlertHub } from "./components/SecurityAlertHub/SecurityAlertHub";

const services = [
  { name: "SOS", icon: Siren, type: "sos" },
  { name: "Voice", icon: Mic, type: "voice" },
  { name: "UserInfo", path: "/profile", icon: UserPen, type: "link" },
  { name: "Setting", icon: Settings, type: "setting" },
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
  const [showSetting, setShowSetting] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(10);
  const [sosType, setSosType] = useState("accident");

  const uid = auth.currentUser?.uid;
  const navigate = useNavigate();

  const handleServiceClick = (service) => {
    switch (service.type) {
      case "voice":
        setIsVoiceOpen(true);
        break;
      case "sos":
        setShowSOS(true);
        break;
      case "setting":
        setShowSetting(true);
        break;
      case "link":
        if (service.path === "/profile" && !uid) {
          navigate("/login");
        } else {
          navigate(service.path);
        }
        break;
      default:
        break;
    }
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
                onClick={() => handleServiceClick(service)}
              >
                <div className={styles.navLinkVertical}>
                  <div className={styles.serviceIconWrapperVertical}>
                    <service.icon
                      className={styles.serviceIconLarge}
                      strokeWidth={2}
                    />
                  </div>
                  <span className={styles.serviceNameLarge}>
                    {service.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <br />

        {/* Khối Bản đồ & Tin tức */}
        <div className={styles.contentGrid}>
          <TravelMap />
          <NewsCollection className={styles.noScrollbar} />
        </div>

        {/* <br /> */}

        <SecurityAlertHub />
      </div>

      {/* SETTINGS */}
      <AnimatePresence>
        {showSetting && (
          <SettingsModal
            onClose={() => setShowSetting(false)}
            onApply={(data) => {
              console.log("Settings applied:", data);
            }}
          />
        )}
        <AnimatePresence>
          {showSOS && (
            <SOSModal
              onClose={() => setShowSOS(false)}
              sosType={sosType}
              setSosType={setSosType}
              sosCountdown={sosCountdown}
            />
          )}
        </AnimatePresence>
        {isVoiceOpen && (
          <AssitantFloatInput onClose={() => setIsVoiceOpen(false)} />
        )}
      </AnimatePresence>

      {showResponse && (
        <ResponseDisplay
          content={responseContent}
          onClose={() => setShowResponse(false)}
        />
      )}

      {/* PHẦN FOOTER*/}
      <footer className={styles.footerSection}>
        <div className={styles.footerContainer}>
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

          {/* <br /> */}

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
              .replace(/[\u0300-\u036f]/g, "")
          )
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

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};
