import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../../../context/userAuthenticateContext";
import { User } from "lucide-react";
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className={styles.navBar} {...props}>
      {/* Logo Section */}
      <div className={styles.logoSection}>Logo</div>

      {/* Auth Section */}
      <div className={styles.authSection}>
        {!user ? (
          <div className={styles.authList}>
            <motion.div
              className={styles.authItemWrapper}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <NavLink to="/login" className={styles.authBtn}>
                Log in
              </NavLink>
            </motion.div>
            <motion.div
              className={styles.authItemWrapper}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <NavLink to="/signup" className={styles.authBtn}>
                Sign up
              </NavLink>
            </motion.div>
          </div>
        ) : (
          <div className={styles.userSection}>
            <motion.div
              className={styles.avatarWrapper}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/profile")}
            ></motion.div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {user.displayName || user.email}
              </span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
