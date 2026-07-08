import { motion } from "framer-motion";

export function PageHero({
  title,
  subtitle,
  label,
  dark = false,
  className = "",
}: {
  title: string;
  subtitle?: string;
  label?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={`text-center mb-12 sm:mb-16 pt-24 sm:pt-28 md:pt-32 px-2 sm:px-0 max-w-full ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {label && (
        <span
          className={`inline-block text-xs font-montserrat font-bold uppercase tracking-[0.2em] mb-4 ${
            dark ? "text-cu-orange" : "text-cu-orange"
          }`}
        >
          {label}
        </span>
      )}
      <h1
        className={`text-3xl sm:text-5xl lg:text-6xl font-montserrat font-bold mb-4 text-balance break-words ${
          dark ? "text-white" : "text-cu-black"
        }`}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
            dark ? "text-gray-300" : "text-cu-concrete"
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
