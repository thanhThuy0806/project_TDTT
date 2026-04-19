import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, X, MessageSquare } from 'lucide-react';
import styles from './VoiceAssistant.module.css';

export function VoiceAssistant({className}) {
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
        /* 1. Backdrop làm tối màn hình & Xử lý click ngoài để đóng */
        <motion.div 
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} 
        >
            {/* 2. Container chính với hiệu ứng kéo từ dưới lên */}
            <motion.div 
                className={styles.rainbowInputBox}
                initial={{ y: "100vh", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100vh", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                /* Ngăn nổi bọt để khi click vào input không bị đóng */
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.innerContent}>
                    {/* Nút chuyển đổi chế độ Sound/Text */}
                    <button 
                        onClick={() => setIsSoundMode(!isSoundMode)}
                        className="mr-3 text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                        {isSoundMode ? <Mic size={24} /> : <MessageSquare size={24} />}
                    </button>

                    <textarea 
                        className={styles.textArea}
                        placeholder={isSoundMode ? "Đang lắng nghe..." : "Nhập tin nhắn..."}
                        rows={1}
                        autoFocus
                    />

                    <button className="ml-2 p-2 bg-indigo-500 text-white rounded-full">
                        <Send size={20} />
                    </button>
                    
                    <button 
                        onClick={onClose}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}