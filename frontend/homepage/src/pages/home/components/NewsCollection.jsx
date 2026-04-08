import { useState, useEffect } from "react";
import styles from "./NewsCollection.module.css";

// Mock data nâng cấp
const popularNews = [
  {
    queryId: "1",
    title:
      "TP.HCM: Đề xuất xây dựng thêm 2 cầu vượt tại cửa ngõ sân bay Tân Sơn Nhất",
    source: "VnExpress",
    time: "2 giờ trước",
    img: "https://picsum.photos/seed/hcm/200/200",
  },
  {
    queryId: "2",
    title:
      "Đà Lạt: Cảnh báo sạt lở tại các khu vực đồi dốc sau mưa lớn kéo dài",
    source: "Tuổi Trẻ",
    time: "5 giờ trước",
    img: "https://picsum.photos/seed/dalat/200/200",
  },
  {
    queryId: "3",
    title:
      "Khám phá đỉnh núi Bà Đen: Điểm đến tâm linh không thể bỏ qua tại Tây Ninh",
    source: "Travel.vn",
    time: "1 ngày trước",
    img: "https://picsum.photos/seed/tayninh/200/200",
  },
];

export function NewsCollection({ className }) {
  const [loading, setLoading] = useState(true);

  // Giả lập fetch data từ API
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${className} ${styles.newsWrapper}`}>
      <div className={`${className} ${styles.container}`}>
        <p className={styles.title}>🔥 Phổ biến</p>

        <div className={`${styles.list} ${styles.noScrollbar}`}>
          {loading
            ? [...Array(5)].map((_, index) => <NewsSkeleton key={index} />)
            : popularNews.map((item) => (
                <div className={styles.newsItem} key={item.queryId}>
                  <img
                    src={item.img}
                    alt={item.title}
                    className={styles.thumbnail}
                  />
                  <div className={styles.content}>
                    <h3 className={styles.newsTitle}>{item.title}</h3>
                    <div className={styles.meta}>
                      <span>{item.source}</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

// Component Skeleton nội bộ
function NewsSkeleton() {
  return (
    <div className={styles.newsItem}>
      <div className={`${styles.thumbnail} ${styles.skeleton}`}></div>
      <div className={styles.content}>
        <div
          className={`${styles.skeleton}`}
          style={{
            height: "14px",
            width: "90%",
            borderRadius: "4px",
            marginBottom: "8px",
          }}
        ></div>
        <div
          className={`${styles.skeleton}`}
          style={{ height: "14px", width: "60%", borderRadius: "4px" }}
        ></div>
        <div className={styles.meta} style={{ marginTop: "auto" }}>
          <div
            className={`${styles.skeleton}`}
            style={{ height: "10px", width: "30%", borderRadius: "4px" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
