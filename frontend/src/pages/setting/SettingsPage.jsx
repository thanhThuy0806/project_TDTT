import React from 'react';
import { motion } from 'framer-motion';
import styles from './SettingsModal.module.css';

export function SettingsModal({ onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <motion.div 
        className={styles.modal} 
        onClick={(e) => e.stopPropagation()} // Ngăn đóng khi click vào bên trong
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <h2 className={styles.title}>Settings</h2>

        <div className={styles.section}>
          <label className={styles.label}>Font Size</label>
          <div className={styles.buttonGroup}>
            <button className={styles.fontBtn}>a</button>
            <button className={`${styles.fontBtn} ${styles.active}`}>A</button>
            <button className={styles.fontBtn}></button>
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Theme Mode</label>
          <div className={styles.toggleContainer}>
            <input type="checkbox" id="theme-toggle" className={styles.toggleInput} />
            <label htmlFor="theme-toggle" className={styles.toggleSlider}></label>
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Language</label>
          <select className={styles.select}>
            <option>English</option>
            <option>Tiếng Việt</option>
          </select>
        </div>

        <button className={styles.applyBtn} onClick={onClose}>Apply</button>
      </motion.div>
    </div>
  );
}