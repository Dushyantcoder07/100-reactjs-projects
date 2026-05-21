"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export default function AnimatedPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div key={pathname}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={true}>
      <motion.div
        key={pathname}
        className="relative overflow-hidden"
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 10, scale: 0.996, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, scale: 0.996, filter: "blur(4px)" }}
          transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: "transform, opacity, filter" }}
        >
          {children}
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-30 h-px bg-gradient-to-r from-transparent via-primary/55 to-transparent"
          initial={{ opacity: 0, scaleX: 0.2 }}
          animate={{ opacity: [0, 0.65, 0], scaleX: [0.2, 1, 1] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.72, times: [0, 0.24, 1], ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
