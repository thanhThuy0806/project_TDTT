import { motion } from "framer-motion";
import { NavBar } from "../home/components/NavBar/NavBar";
import styles from "./AboutPage.module.css";
import { useLocation } from "react-router-dom";

const members = [
  "Member 01",
  "Member 02",
  "Member 03",
  "Member 04",
  "Member 05",
  "Member 06",
  "Member 07",
  "Member 08",
];

function AboutPage() {
  return (
    <div className={styles.mainWrapper}>
      <NavBar />

      <div className={styles.heroSection}>
        <motion.h1
          className={styles.projectTitle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ACCESSIBILITY & SAFETY
        </motion.h1>

        <p className={styles.description}>
          This project is designed to support accessible and safe travel
          experiences for everyone, especially elderly people, people with
          disabilities, and users who need emergency support during their trips.
        </p>
      </div>

      <div className={styles.memberSection}>
        <h2 className={styles.sectionTitle}>Team Members</h2>

        <div className={styles.memberGrid}>
          {members.map((member, index) => (
            <motion.div
              key={index}
              className={styles.memberCard}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {member}
            </motion.div>
          ))}
        </div>
      </div>

      <div className={styles.contactSection}>
        <h2 className={styles.sectionTitle}>Contact Us</h2>
        <p>Email: team.accessibilitysafety@gmail.com</p>
        <p>GitHub: project_TDTT</p>
        <p>Phone: 0123 456 789</p>
      </div>
    </div>
  );
}

export default AboutPage;
