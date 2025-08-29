import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function Collapse({ isOpen, children }: { isOpen: boolean, children: ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate={{ height: isOpen ? "auto" : 0 }}
      transition={{ duration: 0.3 }}
      style={{ overflow: "hidden" }}
    >
      {children}
    </motion.div>
  );
}
