import {
  Handshake,
  Grid3X3,
  ClipboardCheck,
  Cog,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  handshake: Handshake,
  "grid-3x3": Grid3X3,
  "clipboard-check": ClipboardCheck,
  cog: Cog,
};

export function pillarIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Cog;
  return map[name.toLowerCase()] ?? Cog;
}
