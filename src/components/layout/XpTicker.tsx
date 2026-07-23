import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Signature element: a monospace, terminal-readout-style XP counter that
 * animates a delta whenever XP changes — echoing a trading/data terminal
 * ticker rather than a generic progress bar, tying the visual identity
 * directly to the "data analyst" subject matter.
 */
export function XpTicker({ xp }: { xp: number }) {
  const prevXp = useRef(xp);
  const [delta, setDelta] = useState<number | null>(null);

  useEffect(() => {
    if (xp !== prevXp.current) {
      setDelta(xp - prevXp.current);
      prevXp.current = xp;
      const timeout = setTimeout(() => setDelta(null), 2200);
      return () => clearTimeout(timeout);
    }
  }, [xp]);

  return (
    <div className="flex items-center gap-2 font-mono text-sm">
      <span className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">XP</span>
      <span className="text-[var(--color-text)] font-semibold tabular-nums">{xp.toLocaleString()}</span>
      <AnimatePresence>
        {delta !== null && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-[var(--color-positive)] text-xs"
          >
            +{delta}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
