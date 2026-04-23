import styles from './HeroBanner.module.css';

export function HeroBanner() {
  return (
    <div className={styles.heroBanner}>
      <RecommendBox />
    </div>
  );
}

function RecommendBox(props) {
  // Sửa lỗi dư dấu { và xử lý props.className
  const combinedClassName = `${props.className || ''} ${styles.recommendBox}`;
  
  return (
    <div {...props} className={combinedClassName}>
      asfdkasdfasf
    </div>
  );
}