// components/HeroBanner/HeroBanner.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sun, Cloud, CloudRain } from "lucide-react";
import { SecurityModule } from "./modules/SecurityModule";
import styles from "./HeroBanner.module.css";
// Import các modules
import { WeatherModule } from "./modules/WeatherModule";
import { TrafficModule } from "./modules/TrafficModule";

const mockHeroData = [
  {
    id: "weather_01",
    type: "weather",
    backgroundImg:
      "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg",
    // ... (Giữ nguyên các data thời tiết của bạn)
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
    ],
    daily: [
      {
        day: "Thứ 6, 21/04",
        desc: "Nắng gắt",
        low: "26°",
        high: "34°",
        icon: Sun,
      },
    ],
  },
  {
    id: "traffic_01",
    type: "traffic",
    backgroundImg:
      "https://nld.mediacdn.vn/291774122806476800/2025/2/3/img17385495066481738549519497-1738549566769692420503.jpg",
    location: "Trung tâm Thành phố",
    condition: "Giao thông ổn định",
    trafficLevel: "Bình thường",
    date: "21 Tháng 4, 2026",
    time: "11:00",
  },
  {
    id: "security_01",
    type: "security",
    backgroundImg:
      "https://images.pexels.com/photos/92866/pexels-photo-92866.jpeg", // Ảnh xe cảnh sát hoặc khu phố an toàn
    location: "Khu vực Bến Thành",
    condition: "An Toàn",
    safetyLevel: "Cao",
    securityIndex: 85,
    warnings: "Không có",
    date: "21 Tháng 4, 2026",
    time: "11:00",
    emergencyContacts: [
      {
        name: "Công an Phường",
        type: "Cảnh sát",
        phone: "113",
        distance: "0.5 km",
      },
      { name: "BV Đa khoa", type: "Y tế", phone: "115", distance: "1.2 km" },
    ],
    daily: [
      {
        day: "Thứ 6, 21/04",
        desc: "Nắng gắt",
        low: "26°",
        high: "34°",
        icon: Sun,
      },
      {
        day: "Thứ 7, 22/04",
        desc: "Nhiều mây",
        low: "25°",
        high: "32°",
        icon: Cloud,
      },
      {
        day: "Chủ nhật, 23/04",
        desc: "Mưa rào",
        low: "24°",
        high: "30°",
        icon: CloudRain,
      },
    ],
  },
];

export function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const data = mockHeroData[currentIndex];

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % mockHeroData.length);
  const handlePrev = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + mockHeroData.length) % mockHeroData.length
    );

  // Hàm render Module động dựa vào trường 'type'
  const renderActiveModule = () => {
    switch (data.type) {
      case "weather":
        return <WeatherModule key={data.id} data={data} />;
      case "traffic":
        return <TrafficModule key={data.id} data={data} />;
      case "security":
        return <SecurityModule key={data.id} data={data} />;
      default:
        return <WeatherModule key={data.id} data={data} />;
    }
  };

  return (
    <div className={styles.heroContainer}>
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
        {/* NƠI RENDER CÁC MODULE */}
        <AnimatePresence mode="wait">{renderActiveModule()}</AnimatePresence>

        {/* Các nút bấm giữ nguyên ở ngoài để không bị render lại */}
        <button
          onClick={handlePrev}
          className={`${styles.navBtn} ${styles.prev}`}
        >
          <ChevronLeft color="white" />
        </button>
        <button
          onClick={handleNext}
          className={`${styles.navBtn} ${styles.next}`}
        >
          <ChevronRight color="white" />
        </button>
      </div>
    </div>
  );
}
