/**
 * Read once at module load, exactly like the original portal: the whole
 * entrance-animation layer switches off for users who ask for reduced motion.
 */
export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Scroll behaviour that respects the reduced-motion preference. */
export const scrollBehavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
