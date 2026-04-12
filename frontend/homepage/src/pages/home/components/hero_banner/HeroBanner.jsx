import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CrownIcon,
  DropletIcon,
  ThermometerIcon,
  TreePalm,
  TreePalmIcon,
  WindIcon,
} from "lucide-react"; // Import icon nút
import { RecommendBox } from "./RecommendBox";
import styles from "./HeroBanner.module.css";

// ... Dữ liệu Mock `mockHeroData` đặt tại đây hoặc import từ file khác
// Dữ liệu ví dụ để test tính năng chuyển đổi (chạy trong file JSX)
const mockHeroData = [
  {
    topic: "weather",
    themeColor: "#ea580c", // Cam - Thời tiết
    backgroundImg:
      "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg",
    place: { provice: "Tây Ninh", country: "Việt Nam", detail: "Núi Bà Đen" },
    date: "2026-03-28",
    short_describe: "A sunny day",
    detail: [
      {
        name: "tempature",
        data: 30,
        icon: ThermometerIcon,
      },
      {
        name: "uv",
        data: 0.5,
        icon: ThermometerIcon,
      },
      {
        name: "humid",
        data: 0.65,
        icon: DropletIcon,
      },
      {
        name: "windSpeed",
        data: 5,
        icon: WindIcon,
      },
    ],
  },
  {
    topic: "social",
    themeColor: "#059669", // Xanh lá - Hoạt động xã hội
    backgroundImg:
      "https://images.pexels.com/photos/3184424/pexels-photo-3184424.jpeg",
    place: {
      provice: "TP.HCM",
      country: "Việt Nam",
      detail: "Công viên Gia Định",
    },
    date: "2026-03-29",
    short_describe: "Ngày hội Trồng cây 2026",
    detail: [
      {
        name: "Team",
        data: "10",
        icon: TreePalmIcon,
      },
    ],
  },
  {
    topic: "politics",
    themeColor: "#4f46e5", // Xanh dương - Vấn đề chính trị
    backgroundImg:
      "https://images.pexels.com/photos/159751/desk-office-pen-ruler-159751.jpeg",
    place: {
      provice: "Hà Nội",
      country: "Việt Nam",
      detail: "Trung tâm hội nghị Quốc gia",
    },
    date: "2026-03-30",
    short_describe: "Hội nghị Du lịch Quốc tế",

    detail: [
      {
        name: "Groverment",
        data: 1,
        icon: CrownIcon,
      },
    ],
  },
];

export function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1: Trái, 1: Phải
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập load API khi chuyển chủ đề
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mockHeroData.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + mockHeroData.length) % mockHeroData.length
    );
  };

  const currentData = mockHeroData[currentIndex];

  // Định nghĩa Variants cho hiệu ứng trượt background
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  // Định nghĩa variant cho nút bấm
  const buttonVariants = {
    btnHidden: {
      opacity: 0,
      scale: 0.8,
      pointerEvents: "none",
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    btnVisible: {
      opacity: 1,
      scale: 1,
      pointerEvents: "auto",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className={styles.heroBanner}
      initial="btnHidden"
      whileHover="btnVisible"
      animate="btnHidden"
    >
      <div className={styles.backgroundSlideContainer}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={currentData.backgroundImg}
            alt={currentData.topic}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
            className={styles.heroBackgroundImage}
          />
        </AnimatePresence>
      </div>

      {/* Nút bấm điều hướng */}
      <motion.button
        variants={buttonVariants}
        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.3 }}
        onClick={handlePrev}
        className={`${styles.navButton} ${styles.navButtonLeft}`}
      >
        <ChevronLeft size={24} color="white" />
      </motion.button>

      <motion.button
        variants={buttonVariants}
        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.3 }}
        onClick={handleNext}
        className={`${styles.navButton} ${styles.navButtonRight}`}
      >
        <ChevronRight size={24} color="white" />
      </motion.button>

      <RecommendBox data={currentData} isLoading={isLoading} />
    </motion.div>
  );
}
