// components/HeroBanner/modules/SecurityModule.jsx
import { motion } from "framer-motion";
import { MapPin, ShieldAlert, PhoneCall, AlertTriangle, CheckCircle } from "lucide-react";
import styles from "../HeroBanner.module.css";

export function SecurityModule({ data }) {
  // Thay đổi màu sắc dựa trên mức độ an toàn
  const getStatusColor = (level) => {
    if (level === "Cao") return "#22c55e"; // Xanh lá
    if (level === "Trung bình") return "#eab308"; // Vàng
    return "#ef4444"; // Đỏ
  };

  return (
    <motion.div
      className={styles.moduleWrapper}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top Header */}
      <div className={styles.topInfo}>
        <div className={styles.dateTime}>
          <span>{data.date}</span>
          <span className={styles.timeDivider}>|</span>
          <span>{data.time}</span>
        </div>
      </div>

      {/* Main Status Text */}
      <div className={styles.mainContent}>
        <motion.h1 className={styles.weatherStatus}>
          {data.condition}
        </motion.h1>
      </div>

      {/* Right Sidebar: Security Stats */}
      <aside className={styles.rightSidebar}>
        <div className={styles.currentWeatherCard}>
           <div className={styles.locationHeader}>
            <MapPin size={18} />
            <span>{data.location}</span>
          </div>
          
          <div className={styles.mainTempDisplay}>
            <span 
                className={styles.tempNumber} 
                style={{ fontSize: '3rem', color: getStatusColor(data.safetyLevel) }}
            >
                {data.safetyLevel}
            </span>
          </div>

          <div className={styles.subWeatherStats}>
            <div className={styles.statItem}>
              <ShieldAlert size={16} /> <span>Chỉ số an ninh: {data.securityIndex}/100</span>
            </div>
            <div className={styles.statItem}>
              <AlertTriangle size={16} /> <span>Cảnh báo: {data.warnings}</span>
            </div>
          </div>

          {/* Emergency Contacts Section */}
          <div className={styles.forecastSection}>
            <h3 className={styles.sectionTitle}>Liên hệ khẩn cấp gần nhất</h3>
            <div className={styles.dailyList}>
              {data.emergencyContacts.map((contact, idx) => (
                <div key={idx} className={styles.dailyItem}>
                  <div className={styles.dayInfo}>
                      <PhoneCall size={20} color={contact.type === 'Cảnh sát' ? '#3b82f6' : '#ef4444'} />
                      <div className={styles.dayText}>
                          <p>{contact.name}</p>
                          <span>{contact.distance}</span>
                      </div>
                  </div>
                  <div className={styles.dayTemps}>
                    <span className={styles.highTemp} style={{ fontWeight: 'bold' }}>{contact.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </aside>
    </motion.div>
  );
}