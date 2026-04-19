// components/Hero/Hero.jsx
import styles from './Hero.module.css';
import ArticleCard from '../ArticleCard/ArticleCard';

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

export default function Hero() {
  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 4);

  return (
    <section className={styles.heroGrid}>
      <div className={styles.mainFeature}>
        {/* Phần thông tin tác giả được làm nhỏ gọn */}
        <div className={styles.authorSection}>
          <img 
            src={mainArticle.author.avatar} 
            alt={mainArticle.author.name} 
            className={styles.authorImg} 
          />
          <div className={styles.authorMeta}>
            <span className={styles.authorName}>{mainArticle.author.name}</span>
            <span className={styles.authorLabel}>Author</span>
          </div>
        </div>

        <h1 className={styles.mainTitle}>{mainArticle.title}</h1>
        
        <div className={styles.meta}>
          <span className={styles.category}>{mainArticle.category}</span>
          <span className={styles.divider}>|</span>
          <span className={styles.readTime}>{mainArticle.readTime}</span>
        </div>
        
        <img src={mainArticle.image} className={styles.mainImg} alt={mainArticle.title} />
      </div>

      <div className={styles.sideList}>
        {sideArticles.map(art => (
          <ArticleCard key={art.id} data={art} variant="horizontal" />
        ))}
      </div>
    </section>
  );
}