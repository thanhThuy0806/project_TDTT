// ArticleCard.jsx
import styles from './ArticleCard.module.css';
import { motion } from 'framer-motion'; // Import framer-motion

// data/mockData.js
export const articles = [
  {
    id: 1,
    title: "Women's Basketball Semifinals Preview And Schedule",
    image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800",
    author: { name: "Dimas Brembo", avatar: "https://i.pravatar.cc/150?u=1" },
    date: "09 August 2024",
    category: "Olympics",
    readTime: "6 minute read"
  },
  {
    id: 2,
    title: "Boom, Snoop Dogg: Breaking Electrifies Paris 2024 Olympics",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400",
    category: "Olympics",
    readTime: "4 min read"
  },
  // Thêm các bài viết khác tương tự...
];



export default function ArticleCard({ data, variant = 'vertical' }) {
  const isHorizontal = variant === 'horizontal';
  
  return (
    <motion.div 
      className={`${styles.card} ${isHorizontal ? styles.horizontal : ''}`}
      // Hiệu ứng khi lướt chuột qua
      whileHover={{ 
        scale: 1.03,    // Phóng to 3%
        y: -8,          // Nâng lên 8px
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      // Hiệu ứng khi nhấn (tap/click)
      whileTap={{ 
        scale: 0.95,    // Co lại 5%
        transition: { duration: 0.1 }
      }}
      // Cấu hình transition mặc định cho sự mượt mà
      initial={{ y: 0 }}
    >
      <div className={styles.imageWrapper}>
        <img src={data.image} alt={data.title} />
      </div>
      <div className={styles.content}>
        {data.author && (
          <div className={styles.metaTop}>
            <img src={data.author.avatar} alt="" className={styles.avatar} />
            <span>{data.author.name}</span>
            <span className={styles.date}>{data.date}</span>
          </div>
        )}
        <h3 className={styles.title}>{data.title}</h3>
        <div className={styles.metaBottom}>
          <span className={styles.category}>{data.category}</span>
          <span className={styles.divider}>|</span>
          <span className={styles.readTime}>{data.readTime}</span>
        </div>
      </div>
    </motion.div>
  );
}