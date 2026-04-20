import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellRing, X, ShieldAlert, ChevronRight } from 'lucide-react';
import styles from './SecurityAlertHub.module.css';

export function SecurityAlertHub() {
    const [hasNewAlert, setHasNewAlert] = useState(true); // Trạng thái có tin mới
    const [showAlertBar, setShowAlertBar] = useState(false); // Hiện thanh thông báo

    // Giả lập sau 2 giây sẽ có thông báo trượt ra
    useEffect(() => {
        const timer = setTimeout(() => {
            if (hasNewAlert) setShowAlertBar(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, [hasNewAlert]);

    return (
        <div className={styles.hubContainer}>
            {/* 1. Thanh thông báo trượt từ bên phải */}
            <AnimatePresence>
                {showAlertBar && (
                    <motion.div 
                        className={styles.alertBar}
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                    >
                        <div className={styles.alertIconArea}>
                            <ShieldAlert size={20} color="#ef4444" />
                        </div>
                        <div className={styles.alertContent}>
                            <p className={styles.alertTag}>CẢNH BÁO MỚI</p>
                            <p className={styles.alertText}>Mưa lớn tại Núi Bà Đen, hạn chế di chuyển!</p>
                        </div>
                        <button 
                            className={styles.closeBarBtn}
                            onClick={() => setShowAlertBar(false)}
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 2. Nút bấm Chuông thông báo */}
            <motion.button
                className={`${styles.bellFab} ${hasNewAlert ? styles.activeBell : ''}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    setShowAlertBar(!showAlertBar);
                    setHasNewAlert(false); // Nhấn vào coi như đã đọc
                }}
                // Hiệu ứng rung chuông khi có tin mới
                animate={hasNewAlert ? {
                    rotate: [0, -15, 15, -15, 15, 0],
                } : { rotate: [0]}}
                transition={hasNewAlert ? {
                    repeat: Infinity,
                    duration: 1.5,
                    repeatDelay: 2
                } : {}}
            >
                {hasNewAlert ? <BellRing size={30} /> : <Bell size={30} />}
                
                {/* Chấm đỏ thông báo */}
                {hasNewAlert && <span className={styles.notificationDot} />}
            </motion.button>
        </div>
    );
}