// App.jsx
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import ArticleCard from "./components/ArticleCard/ArticleCard";
import Footer from "./components/Footer/Footer";
import styles from "./News.module.css";
// data/mockData.js
export const articles = [
  {
    id: 1,
    title: "Women's Basketball Semifinals Preview And Schedule",
    image:
      "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800",
    author: { name: "Dimas Brembo", avatar: "https://i.pravatar.cc/150?u=1" },
    date: "09 August 2024",
    category: "Olympics",
    readTime: "6 minute read",
  },
  {
    id: 2,
    title: "Boom, Snoop Dogg: Breaking Electrifies Paris 2024 Olympics",
    image:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400",
    category: "Olympics",
    readTime: "4 min read",
  },
  // Thêm các bài viết khác tương tự...
];

function News() {
  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.mainContent}>
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Latest Articles Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Latest Articles</h2>
            <a href="#">Show More &rarr;</a>
          </div>
          <div className={styles.grid4}>
            {articles.slice(0, 4).map((art) => (
              <ArticleCard key={art.id} data={art} />
            ))}
          </div>
        </section>

        {/* 3. Basketball News Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Basketball News</h2>
            <a href="#">Show More &rarr;</a>
          </div>
          <div className={styles.grid4}>
            {articles.slice(0, 4).map((art) => (
              <ArticleCard key={art.id} data={art} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default News;
