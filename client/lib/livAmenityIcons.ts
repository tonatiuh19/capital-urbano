import {
  Baby,
  BookOpen,
  Building2,
  Coffee,
  Flame,
  Gamepad2,
  Laptop,
  PawPrint,
  Shirt,
  Sparkles,
  Dumbbell,
  type LucideIcon,
} from "lucide-react";

/** Icons used by LIV Capital amenity feed (`icon` field). */
const LIV_AMENITY_ICONS: Record<string, LucideIcon> = {
  "paw-print": PawPrint,
  dumbbell: Dumbbell,
  laptop: Laptop,
  flame: Flame,
  shirt: Shirt,
  baby: Baby,
  "gamepad-2": Gamepad2,
  "book-open": BookOpen,
  sparkles: Sparkles,
  coffee: Coffee,
  "building-2": Building2,
};

export function livAmenityIcon(
  name: string | null | undefined,
): LucideIcon {
  return (name ? LIV_AMENITY_ICONS[name] : null) ?? Sparkles;
}
