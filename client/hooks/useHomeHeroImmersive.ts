import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const HERO_SCROLL_SENTINEL_ID = "hero-scroll-sentinel";

const HEADER_ROOT_MARGIN = "-72px 0px 0px 0px";

/**
 * True while the home hero is in "immersive" mode (before the intro sentinel scrolls past the header).
 * Used by Header and WhatsAppFab on `/`.
 */
export function useHomeHeroImmersive(enabled: boolean) {
  const location = useLocation();
  const onHome = location.pathname === "/";
  const watchHero = enabled && onHome;
  const [pastHeroIntro, setPastHeroIntro] = useState(!watchHero);

  useEffect(() => {
    if (!watchHero) {
      setPastHeroIntro(true);
      return;
    }

    setPastHeroIntro(false);

    const sentinel = document.getElementById(HERO_SCROLL_SENTINEL_ID);
    if (!sentinel) {
      setPastHeroIntro(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setPastHeroIntro(!entry.isIntersecting),
      { threshold: 0, rootMargin: HEADER_ROOT_MARGIN },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [watchHero, location.pathname]);

  const isImmersive = watchHero && !pastHeroIntro;

  return { isImmersive, pastHeroIntro };
}
