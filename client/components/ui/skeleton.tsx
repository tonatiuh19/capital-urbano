import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("cu-skeleton", className)}
      {...props}
    />
  );
}

export { Skeleton };
