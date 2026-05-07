import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellRing, X, ShieldAlert, Wifi, WifiOff } from 'lucide-react';
import styles from './SecurityAlertHub.module.css';

/* 
  SecurityAlertHub — Hiển thị cảnh báo nguy hiểm từ backend.
  Props:
    - alerts: mảng cảnh báo từ useDangerTracking hook
    - isDanger: boolean
    - placeName: tên địa danh hiện tại
    - isConnected: trạng thái kết nối WebSocket
    - error: lỗi (nếu có)
*/

const SEVERITY_CONFIG = {
    high: { color: '#ef4444', bg: '#fef2f2', label: '⚠️ Nguy hiểm cao' },
    medium: { color: '#f59e0b', bg: '#fffbeb', label: '⚡ Cảnh báo' },
    low: { color: '#3b82f6', bg: '#eff6ff', label: 'ℹ️ Thông tin' },
};

export function SecurityAlertHub({ alerts = [], isDanger = false, placeName = '', isConnected = false, error = null }) {
    const [hasNewAlert, setHasNewAlert] = useState(false);
    const [showAlertBar, setShowAlertBar] = useState(false);
    const [dismissedAlerts, setDismissedAlerts] = useState([]);

    // Khi nhận được alerts mới từ backend
    useEffect(() => {
        if (alerts.length > 0) {
            setHasNewAlert(true);
            setShowAlertBar(true);
            setDismissedAlerts([]); // reset dismissed khi có alert mới
        } else {
            setHasNewAlert(false);
        }
    }, [alerts]);

    const visibleAlerts = alerts.filter((_, i) => !dismissedAlerts.includes(i));

    const dismissAlert = (index) => {
        setDismissedAlerts(prev => [...prev, index]);
    };

    return (
        <div className={styles.hubContainer}>
            {/* Connection status indicator */}
            <div className={styles.connectionStatus}>
                {isConnected ? (
                    <Wifi size={14} color="#22c55e" />
                ) : (
                    <WifiOff size={14} color="#94a3b8" />
                )}
                <span className={isConnected ? styles.statusOnline : styles.statusOffline}>
                    {isConnected ? 'Đang theo dõi' : 'Mất kết nối'}
                </span>
            </div>

            {/* Error message */}
            {error && (
                <div className={styles.errorBar}>
                    <span className={styles.errorText}>⚠️ {error}</span>
                </div>
            )}

            {/* Alert messages from backend */}
            <AnimatePresence>
                {showAlertBar && visibleAlerts.map((alert, index) => {
                    const severity = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.low;
                    return (
                        <motion.div
                            key={`${alert.text}-${index}`}
                            className={styles.alertBar}
                            style={{ borderColor: severity.color + '33' }}
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 300, opacity: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className={styles.alertIconArea} style={{ backgroundColor: severity.bg }}>
                                <ShieldAlert size={20} color={severity.color} />
                            </div>
                            <div className={styles.alertContent}>
                                <div className={styles.alertHeader}>
                                    <p className={styles.alertTag} style={{ color: severity.color }}>
                                        {severity.label}
                                    </p>
                                    {alert.type === 'dynamic' && (
                                        <span className={styles.sourceBadge}>WebRAG</span>
                                    )}
                                    {alert.type === 'static' && (
                                        <span className={styles.sourceBadgeStatic}>Vùng cấm</span>
                                    )}
                                </div>
                                <p className={styles.alertText}>{alert.text}</p>
                                {placeName && (
                                    <p className={styles.alertLocation}>📍 {placeName}</p>
                                )}
                            </div>
                            <button
                                className={styles.closeBarBtn}
                                onClick={() => dismissAlert(index)}
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {/* Safe status message */}
            <AnimatePresence>
                {showAlertBar && isConnected && alerts.length === 0 && (
                    <motion.div
                        className={styles.safeBar}
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                    >
                        <span className={styles.safeText}>✅ Khu vực an toàn</span>
                        {placeName && <span className={styles.safePlaceName}>{placeName}</span>}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bell button */}
            <motion.button
                className={`${styles.bellFab} ${isDanger && hasNewAlert ? styles.activeBell : ''}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    setShowAlertBar(!showAlertBar);
                    setHasNewAlert(false);
                }}
                animate={isDanger && hasNewAlert ? {
                    rotate: [0, -15, 15, -15, 15, 0],
                } : { rotate: [0] }}
                transition={isDanger && hasNewAlert ? {
                    repeat: Infinity,
                    duration: 1.5,
                    repeatDelay: 2
                } : {}}
            >
                {isDanger && hasNewAlert ? <BellRing size={50} /> : <Bell size={50} />}
                {isDanger && hasNewAlert && <span className={styles.notificationDot} />}
            </motion.button>
        </div>
    );
}