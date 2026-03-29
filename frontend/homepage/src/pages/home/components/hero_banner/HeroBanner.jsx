import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CrownIcon, DropletIcon, ThermometerIcon, TreePalm, TreePalmIcon, WindIcon } from 'lucide-react'; // Import icon nút
import { RecommendBox } from './RecommendBox'; // Component đã tách riêng
import styles from './HeroBanner.module.css';

// ... Dữ liệu Mock `mockHeroData` đặt tại đây hoặc import từ file khác
// Dữ liệu ví dụ để test tính năng chuyển đổi (chạy trong file JSX)
const mockHeroData = [
  {
    topic: 'weather',
    themeColor: '#ea580c', // Cam - Thời tiết
    backgroundImg: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg',
    place: { provice: 'Tây Ninh', country: 'Việt Nam', detail: 'Núi Bà Đen' },
    date: '2026-03-28',
    short_describe: 'A sunny day',
    detail: [
      {
        name: 'tempature',
        data: 30,
        icon: ThermometerIcon
      },
      {
        name: 'uv',
        data: 0.5,
        icon: ThermometerIcon
      },
      {
        name: 'humid',
        data: 0.65,
        icon: DropletIcon
      },
      {
        name: 'windSpeed',
        data: 5,
        icon: WindIcon
      }
    ]
  },
  {
    topic: 'social',
    themeColor: '#059669', // Xanh lá - Hoạt động xã hội
    backgroundImg: 'https://images.pexels.com/photos/3184424/pexels-photo-3184424.jpeg',
    place: { provice: 'TP.HCM', country: 'Việt Nam', detail: 'Công viên Gia Định' },
    date: '2026-03-29',
    short_describe: 'Ngày hội Trồng cây 2026',
    detail: [
      {
        name: 'Team',
        data: '10',
        icon: TreePalmIcon,
      }
    ]
  },
  {
    topic: 'politics',
    themeColor: '#4f46e5', // Xanh dương - Vấn đề chính trị
    backgroundImg: 'https://images.pexels.com/photos/159751/desk-office-pen-ruler-159751.jpeg',
    place: { provice: 'Hà Nội', country: 'Việt Nam', detail: 'Trung tâm hội nghị Quốc gia' },
    date: '2026-03-30',
    short_describe: 'Hội nghị Du lịch Quốc tế',

    detail: [
      {
        name: 'Groverment',
        data: 1,
        icon: CrownIcon,
      }
    ]
  }
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
    }, 1000); // Tải trong 1 giây để thấy Skeleton
    return () => clearTimeout(timer);
  }, [currentIndex]); // Chạy lại mỗi khi currentIndex thay đổi

  const handleNext = () => {
    setDirection(1); // Chuyển sang phải
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mockHeroData.length);
  };

  const handlePrev = () => {
    setDirection(-1); // Chuyển sang trái
    setCurrentIndex((prevIndex) => (prevIndex - 1 + mockHeroData.length) % mockHeroData.length);
  };

  const currentData = mockHeroData[currentIndex];

  // Định nghĩa Variants cho hiệu ứng trượt background
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%', // Vào từ bên nào
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%', // Thoát về bên nào
      opacity: 0,
    }),
  };

  return (
    <div className={styles.heroBanner}>
      {/* Container Background có AnimatePresence để trượt */}
      <div className={styles.backgroundSlideContainer}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex} // Quan trọng để AnimatePresence biết đây là background mới
            src={currentData.backgroundImg}
            alt={currentData.topic}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', duration: 0.5, ease: 'easeInOut' }} // Hiệu ứng trượt mượt mà
            className={styles.heroBackgroundImage}
          />
        </AnimatePresence>
      </div>

      {/* Nút bấm điều hướng */}
      <motion.button 
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.4)' }}
        whileTap={{ scale: 0.9 }}
        onClick={handlePrev} 
        className={`${styles.navButton} ${styles.navButtonLeft}`}
      >
        <ChevronLeft size={24} color="white" />
      </motion.button>
      
      <motion.button 
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.4)' }}
        whileTap={{ scale: 0.9 }}
        onClick={handleNext} 
        className={`${styles.navButton} ${styles.navButtonRight}`}
      >
        <ChevronRight size={24} color="white" />
      </motion.button>

      {/* Hiển thị RecommendBox (với Skeleton khi isLoading=true) */}
      <RecommendBox data={currentData} isLoading={isLoading} />
    </div>
  );
}