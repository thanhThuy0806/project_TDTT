import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { logOut } from "../../../../api/authentication";
import styles from "./NavBar.module.css"; // Import CSS Module

const navItems = [
  { name: "Home", route: "/" },
  { name: "News", route: "/news" },
  { name: "About", route: "/about" },
];

const resMethods = [
  {
    name: "Log in",
    route: "/login",
    effect: () => logOut(),
  },
  {
    name: "Sign in",
    route: "/signin",
    effect: () => {},
  },
];

export function NavBar(props) {
  return (
    <div className={styles.navBar} {...props}>
      <div className={styles.logoSection}>Logo</div>

      <div className={styles.menuSection}>
        <div className={styles.menuList}>
          {navItems.map((item) => (
            <NavLink key={item.name} to={item.route} className={styles.navLink}>
              {({ isActive }) => (
                <motion.div
                  className={`${styles.navItemWrapper} ${
                    isActive ? styles.activeText : ""
                  }`}
                  initial="rest"
                  whileHover="hover"
                  animate={isActive ? "active" : "rest"}
                >
                  {item.name}

                  {/* Thanh trượt */}
                  <motion.div
                    className={styles.underline}
                    variants={{
                      rest: { scaleX: 0, opacity: 0 },
                      hover: { scaleX: 0, opacity: 0 },
                      active: { scaleX: 1, opacity: 1 },
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className={styles.authSection}>
        <div className={styles.authList}>
          {resMethods.map((method) => (
            <NavLink
              key={method.name}
              to={method.route}
              onClick={method.effect}
              className={styles.navLink}
            >
              {({ isActive }) => (
                <motion.div
                  className={`${styles.authItemWrapper} ${
                    isActive ? styles.activeText : ""
                  }`}
                  initial="rest"
                  whileHover="hover"
                  animate={isActive ? "active" : "rest"}
                >
                  {method.name}

                  <motion.div
                    className={styles.underline}
                    variants={{
                      rest: { scaleX: 0, opacity: 0 },
                      hover: { scaleX: 0, opacity: 0 },
                      active: { scaleX: 1, opacity: 1 },
                    }}
                  />
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
