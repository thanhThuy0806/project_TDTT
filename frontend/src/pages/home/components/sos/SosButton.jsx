import { motion, AnimatePresence } from "framer-motion";
import styles from "./SosButton.module.css";

export function SOSModal({
  showSOS,
  setShowSOS,
  sosType,
  setSosType,
  sosCountdown,
}) {
  return (
    <AnimatePresence>
      {showSOS && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.card}
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.85 }}
          >
            <h2 className={styles.title}>🚨 EMERGENCY SOS</h2>

            <p>Bạn sắp gửi tín hiệu khẩn cấp</p>

            <div className={styles.section}>
              <p className={styles.label}>Tình trạng</p>

              <select
                className={styles.select}
                value={sosType}
                onChange={(e) => setSosType(e.target.value)}
              >
                <option value="accident">Tai nạn</option>
                <option value="illness">Bệnh / Sức khỏe</option>
                <option value="danger">Nguy hiểm</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div className={styles.box}>📍 Đang lấy vị trí...</div>

            <p className={styles.countdown}>Tự động gửi sau: {sosCountdown}s</p>

            <div className={styles.buttonRow}>
              <button
                className={styles.btnCancel}
                onClick={() => setShowSOS(false)}
              >
                Cancel
              </button>

              <button
                className={styles.btnSend}
                onClick={() => {
                  setShowSOS(false);
                  alert(`SOS SENT 🚨 Type: ${sosType}`);
                }}
              >
                SEND SOS
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
