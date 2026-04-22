import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./NavBar.module.css";

const resMethods = [
  {
    name: "Log in",
    route: "/login",
    effect: () => {},
  },
  {
    name: "Sign up",
    route: "/signup",
    effect: () => {},
  },
];

export function NavBar(props) {
  return (
    <div className={styles.navBar} {...props}>
      {/* Logo Section */}
      <div className={styles.logoSection}>Logo</div>

      

      {/* Auth Section */}
      <div className={styles.authSection}>
        <div className={styles.authList}>
          {resMethods.map((method) => (
            <motion.div
              className={styles.authItemWrapper}
              key={method.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? `${styles.authBtn} ${styles.activeAuth}`
                    : styles.authBtn
                }
                onClick={method.effect}
                to={method.route}
              >
                {method.name}
              </NavLink>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
