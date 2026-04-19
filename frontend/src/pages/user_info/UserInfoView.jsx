import { motion } from "framer-motion";
import styles from "./UserInfo.module.css";

function InfoView({ label, value }) {
  return (
    <div className={styles.infoView}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value || "—"}</span>
    </div>
  );
}

export function UserInfoView({ userInfo, onEdit }) {
  return (
    <>
      <div className={styles.viewContainer}>
        <InfoView label="Full Name" value={userInfo?.fullName} />
        <InfoView label="Date of Birth" value={userInfo?.dateOfBirth} />
        <InfoView label="Gender" value={userInfo?.gender} />
        <InfoView label="Phone Number" value={userInfo?.phoneNumber} />
        <InfoView label="Email" value={userInfo?.email} />
        <InfoView
          label="Accessibility Support"
          value={userInfo?.accessibilityNeed}
        />
        <InfoView
          label="Emergency Contact"
          value={userInfo?.emergencyContactName}
        />
        <InfoView label="Emergency Phone" value={userInfo?.emergencyPhone} />
      </div>

      <motion.button
        className={styles.editBtn}
        whileTap={{ scale: 0.95 }}
        onClick={onEdit}
      >
        Edit Information
      </motion.button>
    </>
  );
}
