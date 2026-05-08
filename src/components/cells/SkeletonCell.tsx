import { motion } from "motion/react";

export function SkeletonCell() {
  return (
    <motion.div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "inherit",
        background: "rgba(255,255,255,0.04)",
      }}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
