import { motion } from "framer-motion";
import styles from "./SosButton.module.css";

// Chỉ nhận những gì thực sự cần thiết từ cha
export function SOSModal({ onClose, sosType, setSosType, sosCountdown }) {
  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose} // Đóng khi nhấn ra ngoài
    >
      <motion.div
        className={styles.card}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        onClick={(e) => e.stopPropagation()} // Ngăn đóng khi nhấn vào trong card
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
          <button className={styles.btnCancel} onClick={onClose}>
            Cancel
          </button>

          <button
            className={styles.btnSend}
            onClick={() => {
              onClose();
              alert(`SOS SENT 🚨 Type: ${sosType}`);
            }}
          >
            SEND SOS
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
