import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, X, MessageSquare } from "lucide-react";
import { useVoiceAssistant } from "../../../../custom-hook/useVoiceAssistant";
import styles from "./VoiceAssistant.module.css";

/* 22/04/2026, sửa lại thanh FloatingInput và thêm hiệu ứng khi thu âm */

export function VoiceAssistant({ className }) {
  const [showAssistant, setShowAssistant] = useState(false);

  return (
    <>
      <AssistantButton
        className={className}
        onClick={() => setShowAssistant(true)}
      />
      <AnimatePresence>
        {showAssistant && (
          <AssistantFloatInput onClose={() => setShowAssistant(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

export function AssistantButton({ onClick, className }) {
  return (
    <div className={`${styles.buttonContainer} ${className}`}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={styles.fab}
        onClick={onClick}
      >
        <Mic size={28} />
      </motion.button>
    </div>
  );
}

export function AssitantFloatInput({ onClose }) {
  const [isSoundMode, setIsSoundMode] = useState(true);

  const { isRecording, volume, startRecording, stopRecording } =
    useVoiceAssistant();

  const handleMicToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <motion.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        layout // Hiệu ứng biến hình tự động
        className={`${styles.rainbowInputBox} ${
          isRecording ? styles.recordingCircle : ""
        }`}
        initial={{ y: "100vh", opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          scale: isRecording ? volume : 1, // Dãn nở theo âm thanh
        }}
        exit={{ y: "100vh", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 210 }}
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {!isRecording ? (
            <motion.div
              key="bar"
              className={styles.innerContent}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                onClick={handleMicToggle}
                className={`${styles.iconBtn} ${styles.modeToggle} ${
                  isSoundMode ? styles.activeMic : ""
                }`}
              >
                <Mic size={22} />
              </button>

              <textarea
                className={styles.textArea}
                placeholder={
                  isSoundMode ? "Đang lắng nghe..." : "Nhập tin nhắn..."
                }
                rows={1}
                autoFocus
              />

              <button className={`${styles.iconBtn} ${styles.sendBtn}`}>
                <Send size={18} />
              </button>

              <button
                onClick={onClose}
                className={`${styles.iconBtn} ${styles.closeBtn}`}
              >
                <X size={20} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="circle"
              className={styles.recordingContent}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              onClick={handleMicToggle}
            >
              <Mic size={32} color="white" />
              <div className={styles.pulseRing}></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
