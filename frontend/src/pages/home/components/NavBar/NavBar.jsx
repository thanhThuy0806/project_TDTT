import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./NavBar.module.css";

const navItems = [
  { name: "Home", route: "/" },
  { name: "News", route: "/news" },
  { name: "About", route: "/about" },
];

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

      {/* Main Navigation */}
      <div className={styles.menuSection}>
        <div className={styles.menuList}>
          {navItems.map((item) => (
            <motion.div
              className={styles.menuItemWrapper}
              key={item.name}
              whileHover={{ scale: 1.1, color: "#000085" }}
            >
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? `${styles.menuLink} ${styles.activeLink}`
                    : styles.menuLink
                }
                to={item.route}
              >
                {item.name}
              </NavLink>
            </motion.div>
          ))}
        </div>
      </div>

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
