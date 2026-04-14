// App.jsx
import Header from './components/Header/Header';
import ArticleCard from './components/ArticleCard/ArticleCard';
import styles from './App.module.css';

const MOCK_DATA = {
  hero: {
    title: "Women's Basketball Semifinals Preview And Schedule",
    image: "https://picsum.photos/800/450",
    category: "Olympics",
    readTime: "6 minute read"
  },
  trending: [
    { id: 1, title: "Boom, Snoop Dogg: Breaking Electrifies Paris 2024", category: "Olympics", readTime: "4 min", image: "https://picsum.photos/200/150?1" },
    { id: 2, title: "Carlos Nasar wins 89kg gold and breaks Record", category: "Olympics", readTime: "6 min", image: "https://picsum.photos/200/150?2" },
  ]
};

function App() {
  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.mainContent}>
        {/* HERO SECTION */}
        <section className={styles.heroGrid}>
          <div className={styles.heroMain}>
            <img src={MOCK_DATA.hero.image} className={styles.heroImg} />
            <p className={styles.authorSmall}>Dimas Brembo - Author</p>
            <h1 className={styles.heroTitle}>{MOCK_DATA.hero.title}</h1>
            <div className={styles.heroMeta}>
              <span className={styles.category}>{MOCK_DATA.hero.category}</span> | {MOCK_DATA.hero.readTime}
            </div>
          </div>
          
          <div className={styles.heroSidebar}>
            {MOCK_DATA.trending.map(item => (
              <ArticleCard key={item.id} data={item} variant="horizontal" />
            ))}
          </div>
        </section>

        {/* LATEST ARTICLES */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Latest Articles</h2>
            <a href="#" className={styles.showMore}>Show More →</a>
          </div>
          <div className={styles.articleGrid}>
            {/* Map ArticleCards here */}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;