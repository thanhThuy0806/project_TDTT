// Header.jsx
import { useState } from 'react';
import styles from './Header.module.css';
import { Search, Menu, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  // Giả lập trạng thái đăng nhập (bạn có thể thay thế bằng logic từ Context hoặc Redux)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Thông tin user mẫu
  const user = {
    name: "User Name",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  };

  return (
    <header className={styles.wrapper}>
      <nav className={styles.topNav}>
        <div className={styles.logo}>LET'S READ</div>
        
        <div className={styles.menuLinks}>
          <a href="#">Home</a>
          <a href="#">About Us</a>
        </div>

        <div className={styles.authSection}>
          <AnimatePresence mode="wait">
            {!isLoggedIn ? (
              <motion.button
                key="login-btn"
                className={styles.loginBtn}
                whileHover={{ scale: 1.05, backgroundColor: "#333" }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsLoggedIn(true)} // Demo click để đăng nhập
              >
                Log in
              </motion.button>
            ) : (
              <motion.div
                key="user-profile"
                className={styles.profileWrapper}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className={styles.userInfo}>
                  <span className={styles.userName}>Hello, {user.name.split(' ')[0]}</span>
                  <img 
                    src={user.avatar} 
                    alt="User Avatar" 
                    className={styles.avatar}
                    onClick={() => setIsLoggedIn(false)} // Demo click để đăng xuất
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
      
      <div className={styles.subHeader}>
        <Menu size={20} cursor="pointer" />
        <span className={styles.ticker}>Sign Up For Our Paris Olympics Newsletter</span>
        <Search size={20} cursor="pointer" />
      </div>
    </header>
  );
}