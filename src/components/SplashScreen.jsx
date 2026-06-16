// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen({ finishLoading }) {
  const [phase, setPhase] = useState(0);
  // phase 0: initial white
  // phase 1: name appears
  // phase 2: tagline appears
  // phase 3: progress bar fills
  // phase 4: exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1600);
    const t3 = setTimeout(() => setPhase(3), 2400);
    const t4 = setTimeout(() => setPhase(4), 3800);
    const t5 = setTimeout(() => finishLoading(), 4200);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [finishLoading]);

  const nameChars = "As'ad Mahmud Akram".split("");

  return (
    <AnimatePresence>
      {phase < 4 && (
        <motion.div
          key="splash"
          className="fullscreen flex flex-col items-center justify-center relative overflow-hidden"
          style={{ background: "#ffffff" }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.5, ease: "easeInOut" },
          }}
        >
          {/* Grain texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-10 opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "128px 128px",
            }}
          />

          {/* Subtle radial gradient glow center */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,0,0,0.03) 0%, transparent 70%)",
            }}
            animate={{ opacity: [0, 1, 0.7] }}
            transition={{ duration: 2, ease: "easeOut" }}
          />

          {/* Thin horizontal line top */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0,0,0,0.15), transparent)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={phase >= 1 ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          {/* Thin horizontal line bottom */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0,0,0,0.15), transparent)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={phase >= 1 ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
          />

          {/* Corner brackets */}
          {[
            { top: "24px", left: "24px", rotate: "0deg" },
            { top: "24px", right: "24px", rotate: "90deg" },
            { bottom: "24px", left: "24px", rotate: "-90deg" },
            { bottom: "24px", right: "24px", rotate: "180deg" },
          ].map((style, i) => (
            <motion.div
              key={i}
              className="absolute w-6 h-6 pointer-events-none"
              style={{
                ...style,
                borderTop: "1px solid rgba(0,0,0,0.2)",
                borderLeft: "1px solid rgba(0,0,0,0.2)",
                transformOrigin: "center",
                transform: `rotate(${style.rotate})`,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.05 }}
            />
          ))}

          {/* Main content */}
          <div className="relative z-20 text-center px-6 select-none">
            {/* Small label above */}
            <motion.p
              style={{
                color: "rgba(0,0,0,0.35)",
                fontFamily: "'Courier New', monospace",
                fontSize: "1rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
                fontWeight: 300,
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Portfolio
            </motion.p>

            {/* Name — character-by-character reveal */}
            <div
              className="overflow-hidden mb-2"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              <div className="flex flex-wrap justify-center">
                {nameChars.map((char, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    style={{
                      fontSize: "clamp(2rem, 6vw, 4.5rem)",
                      fontWeight: 300,
                      letterSpacing: char === " " ? "0.2em" : "0.02em",
                      color: "#0a0a0a",
                      lineHeight: 1.1,
                    }}
                    initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                    animate={
                      phase >= 1
                        ? { opacity: 1, y: 0, filter: "blur(0px)" }
                        : {}
                    }
                    transition={{
                      duration: 0.5,
                      delay: 0.1 + i * 0.04,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Thin divider line */}
            <motion.div
              className="mx-auto my-5"
              style={{ height: "1px", background: "rgba(0,0,0,0.12)" }}
              initial={{ width: 0 }}
              animate={phase >= 2 ? { width: "180px" } : {}}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />

            {/* Tagline */}
            <motion.p
              style={{
                color: "rgba(0,0,0,0.4)",
                fontSize: "1rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontFamily: "'Courier New', monospace",
                fontWeight: 400,
              }}
              initial={{ opacity: 0 }}
              animate={phase >= 2 ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Web Developer · Problem Solver
            </motion.p>

            {/* Progress bar area */}
            <motion.div
              className="mt-12 mx-auto"
              style={{ width: "200px" }}
              initial={{ opacity: 0 }}
              animate={phase >= 3 ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
            >
              {/* Track */}
              <div
                className="relative overflow-hidden"
                style={{ height: "1px", background: "rgba(0,0,0,0.1)" }}
              >
                <motion.div
                  style={{
                    position: "absolute",
                    inset: 0,
                    transformOrigin: "left",
                    background: "rgba(0,0,0,0.5)",
                  }}
                  initial={{ scaleX: 0 }}
                  animate={phase >= 3 ? { scaleX: 1 } : {}}
                  transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>

              {/* Loading label */}
              <motion.p
                className="mt-3 text-center"
                style={{
                  color: "rgba(0,0,0,0.25)",
                  fontSize: "0.55rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  fontFamily: "'Courier New', monospace",
                }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Loading
              </motion.p>
            </motion.div>
          </div>

          {/* Bottom left */}
          <motion.p
            className="absolute bottom-6 left-6 z-20"
            style={{
              color: "rgba(0,0,0,0.2)",
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
              fontFamily: "'Courier New', monospace",
              textTransform: "uppercase",
            }}
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : {}}
            transition={{ duration: 1 }}
          >
            v2025
          </motion.p>

          {/* Bottom right */}
          <motion.p
            className="absolute bottom-6 right-6 z-20"
            style={{
              color: "rgba(0,0,0,0.2)",
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
              fontFamily: "'Courier New', monospace",
              textTransform: "uppercase",
            }}
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : {}}
            transition={{ duration: 1 }}
          >
            © 2025
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
