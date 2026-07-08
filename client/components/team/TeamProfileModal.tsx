import { Linkedin } from "lucide-react";
import type { TeamMember } from "@shared/api";
import { assetUrl } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function TeamProfileModal({
  member,
  open,
  onOpenChange,
}: {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!member) return null;

  const photo = member.photo_url ? assetUrl(member.photo_url) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-xl border-cu-stone/20 p-0 overflow-hidden max-h-[90dvh] overflow-y-auto">
        <div className="cu-chamfer-border-tr">
          <div className="cu-chamfer-fill-tr bg-white p-6 sm:p-8">
            <DialogHeader className="text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-5 mb-4">
                <div className="cu-chamfer-border-tr w-28 h-28 shrink-0 overflow-hidden">
                  <div className="cu-chamfer-fill-tr w-full h-full flex items-center justify-center bg-gradient-to-br from-cu-orange to-cu-orange-80">
                    {photo ? (
                      <img
                        src={photo}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-montserrat font-bold text-white text-2xl">
                        {initials(member.name)}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <DialogTitle className="font-montserrat text-xl sm:text-2xl text-cu-black">
                    {member.name}
                  </DialogTitle>
                  {member.role_title && (
                    <p className="text-cu-orange font-medium mt-1">{member.role_title}</p>
                  )}
                </div>
              </div>
            </DialogHeader>
            <p className="text-sm sm:text-base text-cu-concrete leading-relaxed whitespace-pre-line break-words">
              {member.bio || member.bio_short || "Sin biografía disponible."}
            </p>
            {member.linkedin_url && (
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-cu-orange hover:underline"
              >
                <Linkedin size={18} /> Ver perfil en LinkedIn
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
