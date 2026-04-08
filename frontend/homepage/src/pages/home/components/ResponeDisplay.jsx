import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { Copy, RefreshCcw } from "lucide-react";
import styles from "./ResponeDisplay.module.css";

// Trong HomePage():
// <ResponseDisplay content={mockResponse} isStreaming={false} />

// Hiển thị phản hồi từ AI với hiệu ứng động và hỗ trợ Markdown
export function ResponseDisplay({ content, isStreaming }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${styles.bottomResponseWrapper} ${styles.noScrollbar}`}
    >
      <div className="flex justify-between items-center mb-4 border-b border-[#0b00a1]/20 pb-2">
        <span className="text-xs font-bold text-[#0b00a1] uppercase tracking-widest">
          AI Travel Guide
        </span>
        <div className="flex gap-2">
          <Copy
            size={14}
            className="cursor-pointer text-[#0b00a1]/60 hover:text-[#0b00a1]"
          />
          <RefreshCcw
            size={14}
            className="cursor-pointer text-[#0b00a1]/60 hover:text-[#0b00a1]"
          />
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
