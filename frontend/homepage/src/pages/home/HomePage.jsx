import styles from "./HomePage.module.css";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { HeroBanner } from "./components/hero_banner/HeroBanner";
import { TravelMap } from "./components/MapBox";
import { NewsCollection } from "./components/NewsCollection";
import { Image, Mic, Settings, Siren } from "lucide-react";
import { useState } from "react";
import { ResponseDisplay } from "./components/ResponeDisplay";
import { InputText } from "../../components/input/Input";

const services = [
  { name: "SOS", path: "/sos", icon: Siren },
  { name: "Voice", path: "/voice", icon: Mic },
  { name: "Picture", path: "/picture", icon: Image },
  { name: "Setting", path: "/setting", icon: Settings },
];

const mockResponse = `
# Khám phá Tây Ninh: Đỉnh Núi Bà Đen

Chào mừng bạn đến với nóc nhà Nam Bộ! Dưới đây là lịch trình gợi ý:

* **Sáng sớm:** Di chuyển bằng cáp treo lên đỉnh núi để săn mây.
* **Trưa:** Thưởng thức đặc sản *Bánh tráng phơi sương* Trảng Bàng.
* **Lưu ý:** Nhiệt độ trên đỉnh thường thấp hơn 3-5 độ so với chân núi.

> Chúc bạn có một chuyến đi an toàn và đầy trải nghiệm!
`;
// Giả sử các component này đã được import
// import NavBar from './NavBar';
// ...

function HomePage() {
  return (
    <div className={styles.screenContainer}>
      <div className={styles.mainWrapper}>
        <NavBar />
        <HeroBanner />

        <br />

        <div className={styles.searchSection}>
          <div className={styles.inputGrid}>
            <InputBox
              label={"From"}
              placeholder={"Ho Chi Minh City"}
              className={styles.inputBoxContainer}
            />
            <InputBox
              label={"To"}
              placeholder={"Ho Chi Minh City"}
              className={styles.inputBoxContainer}
            />
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <NavLink
              to="/search-results"
              className={({ isActive }) =>
                isActive
                  ? `${styles.searchBtn} ${styles.activeSearch}`
                  : styles.searchBtn
              }
            >
              Search
            </NavLink>
          </motion.div>
        </div>

        <br />

        <div className={styles.servicesGridContainer}>
          {" "}
          <div className={styles.servicesGrid}>
            {" "}
            {/* 4 ô tính năng */}
            {services.map((service) => (
              <motion.div
                className={styles.serviceItem}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.25 }}
                key={service.name}
              >
                <NavLink className={styles.navLink} to={service.path}>
                  <div className={styles.serviceButton}>
                    {" "}
                    <div className={styles.serviceIconWrapper}>
                      <service.icon className={styles.serviceIcon} />{" "}
                    </div>
                    <span className={styles.serviceName}>{service.name}</span>{" "}
                  </div>
                </NavLink>
              </motion.div>
            ))}
          </div>
        </div>

        <br />

        <div className={styles.contentGrid}>
          <TravelMap />
          <NewsCollection />
        </div>

        <br />

        <div className={`${styles.bottomInputWrapper} ${styles.noScrollbar}`}>
          <InputText />
        </div>

        <motion.div className={styles.aiFloatingBtn}>
          <p>AI</p>
        </motion.div>

        <ResponseDisplay content={mockResponse} />
      </div>
    </div>
  );
}

// Ô nhập liệu có animation khi focus
function InputBox({
  label,
  placeholder,
  type,
  className,
  value,
  onChange,
  ...props
}) {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <motion.div
      className={`${className} ${styles.inputBoxContainer}`}
      variants={inputFocusAnimation}
      initial="exit"
      animate={isFocus ? "focus" : "exit"}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <label className={styles.inputLabel}>{label}</label>
      <input
        placeholder={placeholder}
        type={type}
        value={value}
        className={`${styles.inputField} ${styles.noScrollbar}`}
        onChange={onChange}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.target.blur();
          }
        }}
      />
    </motion.div>
  );
}

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
