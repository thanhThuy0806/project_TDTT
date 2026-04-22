import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellRing, X, ShieldAlert, ChevronRight } from 'lucide-react';
import styles from './SecurityAlertHub.module.css';

/* 22/04/2026,  Sửa lại alert pop-up, tách nó riêng ra thành Component AlertMessage và xóa nó đi khi nhấn nút X */

const alertMessages = [
    {
        title: 'Cảnh Bảo Mới',
        infor: 'Mưa lớn tại Núi Bà Đen, hạn chế di chuyển!'
    },
]
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
            {
                alertMessages.map((alert, index) => (
                    <AlertMessage key={alert.infor} index={index} warning={alert} showAlertBar={showAlertBar} setShowAlertBar={setShowAlertBar}/>
                ))
            }

            {/* 2. Nút bấm Chuông thông báo */}
            <motion.button
                className={`${styles.bellFab} ${alertMessages.length != 0 && hasNewAlert ? styles.activeBell : ''}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    setShowAlertBar(!showAlertBar);
                    setHasNewAlert(false); // Nhấn vào coi như đã đọc
                }}
                // Hiệu ứng rung chuông khi có tin mới
                animate={alertMessages.length > 0 && hasNewAlert ? {
                    rotate: [0, -15, 15, -15, 15, 0],
                } : { rotate: [0]}}
                transition={alertMessages.length > 0 && hasNewAlert ? {
                    repeat: Infinity,
                    duration: 1.5,
                    repeatDelay: 2
                } : {}}
            >
                {alertMessages.length > 0 && hasNewAlert ? <BellRing size={50} /> : <Bell size={50} />}
                
                {/* Chấm đỏ thông báo */}
                {alertMessages.length > 0 && hasNewAlert && <span className={styles.notificationDot} />}
            </motion.button>
        </div>
    );
}

// hiển thị Message thông báo các thông tin về an toàn cần được lưu ý
function AlertMessage({warning, index, showAlertBar, setShowAlertBar}) {
    // xóa bỏ
    const removeAlert = (index) => {
        const last = alertMessages.length - 1
        alertMessages[last], alertMessages[index] = [alertMessages[index], alertMessages[last]]
        alertMessages.pop();
    }

    return (
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
                            <p className={styles.alertTag}>{warning.title}</p>
                            <p className={styles.alertText}>{warning.infor}</p>
                        </div>
                        <button 
                            className={styles.closeBarBtn}
                            onClick={() => {setShowAlertBar(false); removeAlert()}}
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
    )
}