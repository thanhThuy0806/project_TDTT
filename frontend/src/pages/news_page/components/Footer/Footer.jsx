// components/Footer/Footer.jsx
import styles from './Footer.module.css';

// Định nghĩa các SVG Icon thương hiệu
const SocialIcons = {
  Facebook: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
  ),
  X: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768M20 4l-6.768 6.768"/></svg>
  ),
  Instagram: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
  ),
  Youtube: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.71.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
  )
};

export default function Footer() {
  const footerData = [
    { title: "HOME", links: ["U.S.", "Politics", "World", "Health", "Business"] },
    { title: "ENTERTAINMENT", links: ["Ideas", "Science", "History", "Sports", "Magazine"] },
    { title: "TIME EDGE", links: ["Video", "Masthead", "Subscribe", "Digital Magazine"] },
    { title: "PRESS ROOM", links: ["TIME Studios", "Site Map", "Media Kit", "Careers"] },
    { title: "GET HELP", links: ["Support", "Pricing", "About Us"] }
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.topSection}>
        <div className={styles.brand}>LET'S READ</div>
        <div className={styles.newsletter}>
          <p className={styles.newsletterTitle}>SUBSCRIBE To Newsletter</p>
          <div className={styles.inputGroup}>
            <input type="email" placeholder="Email address" className={styles.input} />
            <button className={styles.subscribeBtn}>Subscribe</button>
          </div>
        </div>
      </div>

      <div className={styles.linksGrid}>
        {footerData.map((section, index) => (
          <div key={index} className={styles.column}>
            <h4 className={styles.columnTitle}>{section.title}</h4>
            <ul className={styles.list}>
              {section.links.map((link, lIndex) => (
                <li key={lIndex} className={styles.listItem}>
                  <a href={`#${link.toLowerCase()}`}>{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.copyright}>
          © 2024 LET'S READ. All Rights Reserved.
        </div>
        <div className={styles.socials}>
          <a href="#" className={styles.socialLink}><SocialIcons.Facebook /></a>
          <a href="#" className={styles.socialLink}><SocialIcons.X /></a>
          <a href="#" className={styles.socialLink}><SocialIcons.Instagram /></a>
          <a href="#" className={styles.socialLink}><SocialIcons.Youtube /></a>
        </div>
      </div>
    </footer>
  );
}