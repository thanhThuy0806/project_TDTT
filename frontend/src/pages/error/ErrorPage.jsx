import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./ErrorPage.css";

function ErrorPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="error-container"
      >
        <h1 className="error-title">404 - Page Not Found</h1>
        <p className="error-message">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="error-link">
          Go Back Home
        </Link>
      </motion.div>
    </div>
  );
}

export default ErrorPage;
