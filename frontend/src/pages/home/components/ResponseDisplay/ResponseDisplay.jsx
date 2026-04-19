import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { Copy, RefreshCcw } from "lucide-react";
import styles from "./ResponseDisplay.module.css";

// Hiển thị phản hồi từ AI với hiệu ứng động và hỗ trợ Markdown
export function ResponseDisplay({ content, isStreaming }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={`${styles.bottomResponseWrapper} ${styles.noScrollbar}`}
    >
      <div className={styles.responseHeader}>
        <span className={styles.headerTitle}>AI Travel Guide</span>
        <div className={styles.headerActions}>
          <Copy size={14} className={styles.actionIcon} />
          <RefreshCcw size={14} className={styles.actionIcon} />
        </div>
      </div>

      <div
        className={`${styles.proseText} ${
          isStreaming ? styles.typingCursor : ""
        }`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </motion.div>
  );
}
