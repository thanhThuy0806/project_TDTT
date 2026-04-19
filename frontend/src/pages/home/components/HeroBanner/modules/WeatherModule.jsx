// components/HeroBanner/modules/WeatherModule.jsx
import { motion } from "framer-motion";
import { MapPin, Wind, Droplets, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../HeroBanner.module.css";

export function WeatherModule({ data }) {
  return (
    <motion.div
      className={styles.moduleWrapper}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
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
    </motion.div>
  );
}