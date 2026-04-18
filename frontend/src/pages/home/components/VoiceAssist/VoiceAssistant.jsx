import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, X, MessageSquare } from 'lucide-react';
import styles from './VoiceAssistant.module.css';

export function VoiceAssistant({ className }) {
    const [showAssistant, setShowAssistant] = useState(false);

    return (
        <>
            <AssistantButton className={className} onClick={() => setShowAssistant(true)} />
            
            <AnimatePresence>
                {showAssistant && (
                    <AssitantFloatInput onClose={() => setShowAssistant(false)} />
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

    return (
        <motion.div 
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} 
        >
            <motion.div 
                className={styles.rainbowInputBox}
                initial={{ y: "100vh", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100vh", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.innerContent}>
                    {/* Nút chuyển đổi chế độ - Sử dụng class module mới */}
                    <button 
                        onClick={() => setIsSoundMode(!isSoundMode)}
                        className={`${styles.iconBtn} ${styles.modeToggle}`}
                        title="Chuyển chế độ nhập liệu"
                    >
                        {isSoundMode ? <Mic size={22} /> : <MessageSquare size={22} />}
                    </button>

                    <textarea 
                        className={styles.textArea}
                        placeholder={isSoundMode ? "Đang lắng nghe..." : "Nhập tin nhắn..."}
                        rows={1}
                        autoFocus
                    />

                    {/* Nút gửi tin nhắn */}
                    <button className={`${styles.iconBtn} ${styles.sendBtn}`}>
                        <Send size={18} />
                    </button>
                    
                    {/* Nút đóng */}
                    <button 
                        onClick={onClose}
                        className={`${styles.iconBtn} ${styles.closeBtn}`}
                    >
                        <X size={20} />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}