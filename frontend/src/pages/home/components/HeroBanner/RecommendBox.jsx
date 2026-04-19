import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  CalendarDays,
  Sun,
  Users,
  Scale,
  FileText,
} from "lucide-react";
import styles from "./RecommendBox.module.css";

// Hàm helper để render Icon chung cho Topic (Góc trên cùng)
const getTopicIcon = (topic) => {
  switch (topic) {
    case "weather":
      return <Sun size={24} className={styles.iconTopic} />;
    case "social":
      return <Users size={24} className={styles.iconTopic} />;
    case "politics":
      return <Scale size={24} className={styles.iconTopic} />;
    default:
      return <FileText size={24} className={styles.iconTopic} />;
  }
};

export function RecommendBox({ data, isLoading }) {
  if (isLoading) return <RecommendBoxSkeleton />;
  if (!data) return null;

  const { topic, place, date, detail, themeColor, short_describe } = data;
  const formattedDate = new Date(date).toLocaleDateString("vi-VN");

  return (
    <div className={styles.outerBox}>
      {/* Dynamic Stats Grid: Lặp qua mảng detail mới */}
      <motion.div
        className={styles.subStatsGrid}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
      >
        {detail.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className={styles.statItem}>
              {IconComponent && <IconComponent size={16} />}
              <span className={styles.statLabel}>{item.name}:</span>
              <span className={styles.statValue}>{item.data}</span>
            </div>
          );
        })}
      </motion.div>

      {/* Khối bên trong: 60% chiều cao */}
      <AnimatePresence mode="wait">
        <motion.div
          key={topic}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={styles.innerBox}
          style={{ backgroundColor: themeColor }}
        >
          {/* Header: Topic Icon & Mô tả nổi bật */}
          <div className={styles.recommendHeader}>
            {getTopicIcon(topic)}
            <h3 className={styles.mainTitle}>{short_describe}</h3>
          </div>

          {/* Location & Time */}
          <div className={styles.locationAndTime}>
            <div className={styles.locationWrapper}>
              <MapPin size={16} />
              <span className={styles.locationText}>
                {place.provice}, {place.country}
              </span>
            </div>
            <p className={styles.locationDetail}>{place.detail}</p>
            <div className={styles.timeWrapper}>
              <CalendarDays size={16} />
              <span>{formattedDate}</span>
            </div>
          </div>

          <hr className={styles.divider} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Skeleton tự động thích ứng với cấu trúc mới
function RecommendBoxSkeleton() {
  return (
    <div className={styles.outerBox}>
      <div className={`${styles.innerBox} ${styles.skeletonBg}`}>
        <div className={styles.recommendHeader}>
          <div
            className={`${styles.skeletonItem}`}
            style={{ height: "32px", width: "32px", borderRadius: "50%" }}
          ></div>
          <div
            className={`${styles.skeletonItem}`}
            style={{ height: "28px", width: "70%", marginLeft: "1rem" }}
          ></div>
        </div>

        <div className={styles.locationAndTime} style={{ marginTop: "1rem" }}>
          <div
            className={`${styles.skeletonItem}`}
            style={{ height: "16px", width: "80%" }}
          ></div>
          <div
            className={`${styles.skeletonItem}`}
            style={{ height: "20px", width: "60%", marginTop: "0.5rem" }}
          ></div>
        </div>

        <hr
          className={styles.divider}
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        />

        <div className={styles.subStatsGrid}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`${styles.skeletonItem}`}
              style={{ height: "24px", width: "100%" }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
