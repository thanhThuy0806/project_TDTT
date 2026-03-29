import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { HeroBanner } from "./components/HeroBanner";
import { TravelMap } from "./components/MapBox";
import { NewsCollection } from "./components/NewsCollection";
import { InputText } from "../../components/input/Input";
import { Image, Mic, Settings, Siren } from "lucide-react";
import styles from "./HomePage.module.css";

const services = [
  { name: "SOS", path: "/sos", icon: Siren },
  { name: "Voice", path: "/voice", icon: Mic },
  { name: "Picture", path: "/picture", icon: Image },
  { name: "Setting", path: "/setting", icon: Settings },
];
// Giả sử các component này đã được import
// import NavBar from './NavBar';
// ...

function HomePage() {
  return (
    <div className={styles.mainWrapper}>
      <NavBar />
      <HeroBanner />

      <br />

      <div className={styles.searchSection}>
        <div className={styles.inputGrid}>
          <InputBox
            label={"From"}
            placeholder={"Ex: Ha Noi, Da Nang..."}
            className={styles.inputBoxContainer}
          />
          <InputBox
            label={"To"}
            placeholder={"Ex: Ha Noi, Da Nang..."}
            className={styles.inputBoxContainer}
          />
        </div>
        <motion.div className={styles.searchBtn} whileTap={{ scale: 0.9 }}>
          🔍 Search
        </motion.div>
      </div>

      <br />

      <div className={styles.servicesGrid}>
        {services.map((service) => (
          <motion.div
            className={styles.serviceItem}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.25 }}
            key={service.name}
          >
            <NavLink className={styles.navLink} to={service.path}>
              <service.icon /> {service.name}
            </NavLink>
          </motion.div>
        ))}
      </div>

      <br />

      <div className={styles.contentGrid}>
        <TravelMap />
        <NewsCollection
          className={`${styles.newsCollection} ${styles.noScrollbar}`}
        />
      </div>

      <br />

      <div className={`${styles.bottomInputWrapper} ${styles.noScrollbar}`}>
        <InputText />
      </div>

      <motion.div className={styles.aiFloatingBtn}>
        <p>AI</p>
      </motion.div>
    </div>
  );
}

function InputBox({ label, placeholder, type, className, ...props }) {
  return (
    <div className={`${className} ${styles.inputBoxContainer}`}>
      <label className={styles.inputLabel}>{label}</label>
      <input
        placeholder={placeholder}
        type={type}
        className={`${styles.inputField} ${styles.noScrollbar}`}
      />
    </div>
  );
}

export default HomePage;
