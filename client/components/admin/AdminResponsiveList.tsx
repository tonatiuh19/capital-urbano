import type { ReactNode } from "react";

export function AdminResponsiveList({
  loading,
  loadingMessage = "Cargando…",
  empty,
  isEmpty,
  desktop,
  mobile,
}: {
  loading?: boolean;
  loadingMessage?: string;
  empty?: string;
  isEmpty?: boolean;
  desktop: ReactNode;
  mobile: ReactNode;
}) {
  if (loading) {
    return <p className="text-cu-concrete text-sm">{loadingMessage}</p>;
  }

  if (isEmpty && empty) {
    return (
      <p className="p-8 text-center text-cu-concrete text-sm border border-cu-stone/30 rounded-sm bg-white">
        {empty}
      </p>
    );
  }

  return (
    <>
      <div className="hidden md:block min-w-0">{desktop}</div>
      <div className="md:hidden space-y-3 min-w-0">{mobile}</div>
    </>
  );
}
