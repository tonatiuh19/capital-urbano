import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type BrandVideoPreviewProps = {
  src: string;
  title?: string;
  caption?: string;
  className?: string;
  /** card = compact tile; cinema = wide letterbox for feature sections */
  variant?: "card" | "cinema";
};

export function BrandVideoPreview({
  src,
  title = "Capital Urbano",
  caption,
  className = "",
  variant = "card",
}: BrandVideoPreviewProps) {
  const [open, setOpen] = useState(false);
  const previewRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLVideoElement>(null);
  const isCinema = variant === "cinema";

  useEffect(() => {
    const el = previewRef.current;
    if (!el || open) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else {
          el.pause();
          el.currentTime = 0;
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [open, src]);

  useEffect(() => {
    const modal = modalRef.current;
    const preview = previewRef.current;
    if (!modal) return;

    if (open) {
      preview?.pause();
      modal.currentTime = 0;
      modal.play().catch(() => {});
    } else {
      modal.pause();
      modal.currentTime = 0;
    }
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group relative w-full overflow-hidden border bg-cu-black text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cu-orange focus-visible:ring-offset-2",
          isCinema
            ? "aspect-video min-h-[12rem] sm:min-h-0 rounded-sm border-cu-stone/25 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.45)] ring-1 ring-cu-orange/15"
            : "min-h-[16rem] sm:min-h-[20rem] lg:min-h-[24rem] rounded-sm border-cu-stone/20",
          className,
        )}
        aria-label={`Reproducir video: ${title}`}
      >
        <video
          ref={previewRef}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
        <div
          className={cn(
            "absolute inset-0 transition-colors duration-300",
            isCinema
              ? "bg-gradient-to-r from-cu-black/70 via-cu-black/35 to-cu-black/50 group-hover:from-cu-black/80"
              : "bg-gradient-to-t from-cu-black/75 via-cu-black/25 to-cu-black/15 group-hover:from-cu-black/85",
          )}
        />

        {isCinema && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-cu-orange opacity-90" aria-hidden />
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              "flex items-center justify-center rounded-full bg-cu-orange text-white shadow-xl shadow-cu-orange/30 transition-transform duration-300 group-hover:scale-110",
              isCinema ? "h-20 w-20 sm:h-24 sm:w-24" : "h-16 w-16 sm:h-20 sm:w-20",
            )}
          >
            <Play
              size={isCinema ? 40 : 32}
              className="ml-1 fill-current"
              aria-hidden
            />
          </span>
        </div>

        <div
          className={cn(
            "absolute p-5 sm:p-6",
            isCinema ? "bottom-0 left-0 right-0 sm:left-6 sm:max-w-md" : "bottom-0 left-0 right-0",
          )}
        >
          <p className="font-montserrat text-xs uppercase tracking-[0.2em] text-white/70 mb-1">
            Ver video completo
          </p>
          <p
            className={cn(
              "font-montserrat font-bold text-white leading-snug",
              isCinema ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
            )}
          >
            {title}
          </p>
          {caption && (
            <p className="mt-1 text-sm text-white/80 font-montserrat">{caption}</p>
          )}
        </div>

        <span className="absolute top-4 right-4 rounded-sm bg-white/10 backdrop-blur-sm border border-white/20 px-2.5 py-1 text-[10px] font-montserrat font-semibold uppercase tracking-wider text-white">
          {isCinema ? "Documental" : "Preview"}
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl w-[calc(100vw-2rem)] sm:w-full p-0 gap-0 border-0 bg-black overflow-hidden rounded-sm">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <div className="relative aspect-video w-full bg-black">
            <video
              ref={modalRef}
              src={src}
              controls
              playsInline
              className="h-full w-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
