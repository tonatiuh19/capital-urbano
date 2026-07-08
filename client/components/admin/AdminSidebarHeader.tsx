import { BrandLogo } from "@/components/brand/BrandLogo";

export function AdminSidebarHeader() {
  return (
    <div className="p-5 border-b border-white/10">
      <BrandLogo variant="on-dark" className="h-9 w-auto" />
      <p className="text-[10px] tracking-[0.25em] text-white/40 font-montserrat uppercase mt-3">
        Panel administrativo
      </p>
    </div>
  );
}
