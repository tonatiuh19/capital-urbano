import type { Transition, Variants } from "framer-motion";

/** Easing similar to grupodags.com section reveals (smooth deceleration). */
export const brandEase = [0.22, 1, 0.36, 1] as const;

export const brandTransition: Transition = {
  duration: 0.85,
  ease: brandEase,
};

export const brandTransitionFast: Transition = {
  duration: 0.55,
  ease: brandEase,
};

/** Section headline / block entrance */
export const brandReveal: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: brandTransition,
  },
};

/** Card grid with stagger (DAGS-style cascade) */
export const brandStaggerParent: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

export const brandStaggerChild: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: brandTransition,
  },
};

/** Horizontal slide-in (strategy panels, side content) */
export const brandSlideIn: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: brandTransition,
  },
};

/** Line / rule grow (hero divider, accents) */
export const brandLineGrow: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.9, ease: brandEase },
  },
};

export const brandViewport = {
  once: true,
  margin: "-72px" as const,
  amount: 0.2 as const,
};
