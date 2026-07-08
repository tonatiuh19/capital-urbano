/** Shared SVG clip paths for brand geometry (referenced from CSS). */
export function BrandClipDefs() {
  return (
    <svg width="0" height="0" aria-hidden className="absolute pointer-events-none">
      <defs>
        <clipPath id="cu-strategy-clip" clipPathUnits="objectBoundingBox">
          <path d="M 0.09 0 H 0.955 L 1 0.18 L 1 1 L 0 1 L 0 0.36 Q 0 0 0.09 0 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}
