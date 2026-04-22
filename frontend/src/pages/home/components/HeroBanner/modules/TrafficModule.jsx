// components/HeroBanner/modules/TrafficModule.jsx
import { motion } from "framer-motion";
import { MapPin, Car, AlertTriangle } from "lucide-react";
import styles from "../HeroBanner.module.css";

export function TrafficModule({ data }) {
  return (
    <motion.div
      className={styles.moduleWrapper}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.topInfo}>
        <div className={styles.dateTime}>
          <span>{data.date}</span>
          <span className={styles.timeDivider}>|</span>
          <span>{data.time}</span>
        </div>
      </div>

      <div className={styles.mainContent}>
        <motion.h1 className={styles.weatherStatus}>
          {data.condition} {/* Ví dụ: "Giao thông ùn tắc nhẹ" */}
        </motion.h1>
      </div>

      <aside className={styles.rightSidebar}>
        <div className={styles.currentWeatherCard}>
           {/* Tùy biến UI riêng cho Giao thông ở đây */}
           <div className={styles.locationHeader}>
            <MapPin size={18} />
            <span>{data.location}</span>
          </div>
          <div className={styles.mainTempDisplay}>
            <span className={styles.tempNumber} style={{fontSize: '3rem'}}>{data.trafficLevel}</span>
          </div>
        </div>
      </aside>
    </motion.div>
  );
}