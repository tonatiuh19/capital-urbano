import { useEffect, useCallback, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { assetUrl } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export type LightboxItem = {
  src: string;
  title?: string | null;
  caption?: string | null;
};

type Props = {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export function ImageLightbox({
  items,
  index,
  onClose,
  onIndexChange,
}: Props) {
  const open = index != null && index >= 0 && index < items.length;
  const current = open && index != null ? items[index] : null;

  const go = useCallback(
    (dir: -1 | 1) => {
      if (index == null || items.length === 0) return;
      const next = (index + dir + items.length) % items.length;
      onIndexChange(next);
    },
    [index, items.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  const src = current?.src ? assetUrl(current.src) ?? current.src : null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-w-5xl w-[calc(100vw-1.5rem)] p-0 gap-0 border-0 bg-black/95 overflow-hidden rounded-sm">
        <DialogTitle className="sr-only">
          {current?.title ?? current?.caption ?? "Imagen"}
        </DialogTitle>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
        <div className="flex flex-col items-center justify-center min-h-[50vh] max-h-[85vh] p-4 sm:p-8">
          {src && (
            <img
              src={src}
              alt={current?.title ?? current?.caption ?? ""}
              className="max-w-full max-h-[70vh] object-contain"
            />
          )}
          {(current?.title || current?.caption) && (
            <p className="mt-4 text-sm text-white/90 font-montserrat text-center">
              {current.title ?? current.caption}
              {items.length > 1 && index != null && (
                <span className="text-white/50 ml-2">
                  {index + 1} / {items.length}
                </span>
              )}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
