import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  Wind,
  CloudRain,
  Sun,
  Cloud,
  MapPin,
  Calendar,
} from "lucide-react";
import styles from "./HeroBanner.module.css";

const mockHeroData = [
  {
    type: "weather",
    topic: "Thời tiết",
    backgroundImg: "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg",
    location: "Núi Bà Đen, Tây Ninh",
    currentTemp: 30,
    condition: "Trời nắng đẹp",
    wind: "Đông Nam, 12 km/h",
    humidity: "65%",
    date: "21 Tháng 4, 2026",
    time: "11:00",
    hourly: [
      { time: "09:00", temp: "28°", icon: Sun },
      { time: "10:00", temp: "29°", icon: Sun },
      { time: "11:00", temp: "30°", icon: Sun, active: true },
      { time: "12:00", temp: "31°", icon: Cloud },
      { time: "13:00", temp: "32°", icon: Cloud },
      { time: "14:00", temp: "32°", icon: CloudRain },
    ],
    daily: [
      { day: "Thứ 6, 21/04", desc: "Nắng gắt", low: "26°", high: "34°", icon: Sun },
      { day: "Thứ 7, 22/04", desc: "Nhiều mây", low: "25°", high: "32°", icon: Cloud },
      { day: "Chủ nhật, 23/04", desc: "Mưa rào", low: "24°", high: "30°", icon: CloudRain },
    ]
  },
  // Các card khác (Traffic, Social...) sẽ được thêm vào đây sau
];

export function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const data = mockHeroData[currentIndex];

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % mockHeroData.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + mockHeroData.length) % mockHeroData.length);

  return (
    <div className={styles.heroContainer}>
      {/* Background Layer */}
      <AnimatePresence mode="wait">
        <motion.img
          key={data.backgroundImg}
          src={data.backgroundImg}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.backgroundImage}
        />
      </AnimatePresence>

      <div className={styles.overlay}>
        {/* Top Header: Time & Location */}
        <div className={styles.topInfo}>
            <div className={styles.dateTime}>
                <span>{data.date}</span>
                <span className={styles.timeDivider}>|</span>
                <span>{data.time}</span>
            </div>
        </div>

        {/* Middle: Main Status Text */}
        <div className={styles.mainContent}>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={styles.weatherStatus}
          >
            {data.condition}
          </motion.h1>
        </div>

        {/* Right Sidebar: Glass Card */}
        <aside className={styles.rightSidebar}>
          <div className={styles.currentWeatherCard}>
            <div className={styles.locationHeader}>
              <MapPin size={18} />
              <span>{data.location}</span>
            </div>
            
            <div className={styles.mainTempDisplay}>
              <span className={styles.tempNumber}>{data.currentTemp}°C</span>
            </div>

            <div className={styles.subWeatherStats}>
              <div className={styles.statItem}>
                <Wind size={16} /> <span>{data.wind}</span>
              </div>
              <div className={styles.statItem}>
                <Droplets size={16} /> <span>Độ ẩm: {data.humidity}</span>
              </div>
            </div>

            <div className={styles.forecastSection}>
              <h3 className={styles.sectionTitle}>Dự báo những ngày tới</h3>
              <div className={styles.dailyList}>
                {data.daily.map((item, idx) => (
                  <div key={idx} className={styles.dailyItem}>
                    <div className={styles.dayInfo}>
                        <item.icon size={20} />
                        <div className={styles.dayText}>
                            <p>{item.day}</p>
                            <span>{item.desc}</span>
                        </div>
                    </div>
                    <div className={styles.dayTemps}>
                      <span className={styles.lowTemp}>{item.low}</span>
                      <span className={styles.highTemp}>{item.high}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Bottom Bar: Hourly Forecast */}
        <div className={styles.bottomForecastBar}>
          {data.hourly.map((item, idx) => (
            <div key={idx} className={`${styles.hourItem} ${item.active ? styles.activeHour : ''}`}>
              <span className={styles.hourTime}>{item.time}</span>
              <item.icon size={24} className={styles.hourIcon} />
              <span className={styles.hourTemp}>{item.temp}</span>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button onClick={handlePrev} className={`${styles.navBtn} ${styles.prev}`}>
          <ChevronLeft color="white" />
        </button>
        <button onClick={handleNext} className={`${styles.navBtn} ${styles.next}`}>
          <ChevronRight color="white" />
        </button>
      </div>
    </div>
  );
}