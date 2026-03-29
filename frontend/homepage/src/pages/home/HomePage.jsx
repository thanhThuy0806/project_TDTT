import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { HeroBanner } from './components/hero_banner/HeroBanner';
import { TravelMap } from './components/MapBox';
import { NewsCollection } from './components/NewsCollection';
import { Image, Mic, Settings, Siren } from 'lucide-react';
import styles from './HomePage.module.css';
import { useState } from 'react';
import { ResponseDisplay } from './components/ResponeDisplay';
import { InputText } from '../../components/input/Input';

const services = [
  { name: 'SOS', path: '/sos', icon: Siren },
  { name: 'Voice', path: '/voice', icon: Mic },
  { name: 'Picture', path: '/picture', icon: Image },
  { name: 'Setting', path: '/setting', icon: Settings }
]

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

        {/* Section Search Bar: giữ nguyên */}
        <div className={styles.searchSection}>
          <div className={styles.inputGrid}>
            <InputBox
              label={'From'}
              placeholder={'Ho Chi Minh City'}
              className={styles.inputBoxContainer}
            />
            <InputBox
              label={'To'}
              placeholder={'Ho Chi Minh City'}
              className={styles.inputBoxContainer}
            />
          </div>
          <motion.div
            className={styles.searchBtn}
            whileTap={{ scale: 0.9 }}
          >
            🔍 Search
          </motion.div>
        </div>

        <br />

        <div className={styles.servicesGridContainer}> {/* Centered, depth container */}
          <div className={styles.servicesGrid}> {/* Actual 4-col grid */}
            {services.map(service => (
              <motion.div
                className={styles.serviceItem} // New style for individual card
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.25 }}
                key={service.name}
              >
                <NavLink
                  className={styles.navLink} // simple full flex wrapper
                  to={service.path}
                >
                  <div className={styles.serviceButton}> {/* Content wrapper: column layout */}
                    <div className={styles.serviceIconWrapper}>
                      <service.icon className={styles.serviceIcon} /> {/* styled icon */}
                    </div>
                    <span className={styles.serviceName}>{service.name}</span> {/* styled text */}
                  </div>
                </NavLink>
              </motion.div>
            ))}
          </div>
        </div>

        <br />

        <div className={styles.contentGrid}>
          <TravelMap />
          <NewsCollection className={`${styles.newsCollection} ${styles.noScrollbar}`} />
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

// ... các imports giữ nguyên

function InputBox({ label, placeholder, type, className, value, onChange, ...props }) {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <motion.div
      className={`${className} ${styles.inputBoxContainer}`}
      variants={inputFocusAnimation}
      initial="exit"
      animate={isFocus ? 'focus' : 'exit'}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
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
          if (e.key === 'Enter') {
            e.target.blur(); // Tự động kích hoạt onBlur và thoát focus
          }
        }}
      />
    </motion.div>
  );
}

// Cập nhật Animation: Thêm boxShadow để tạo hiệu ứng nhấn
const inputFocusAnimation = {
  focus: {
    scale: 0.98,
    boxShadow: "0px 10px 20px rgba(147, 197, 253, 0.5)", // Đổ bóng xanh nhẹ khi nhấn
    borderColor: "#3b82f6", // Làm đậm viền một chút
  },
  exit: {
    scale: 1,
    boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.05)", // Đổ bóng mặc định tạo độ sâu
    borderColor: "#93c5fd",
  }
}




export default HomePage;