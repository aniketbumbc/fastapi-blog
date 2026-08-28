import { cn } from "@/lib/cn";

export default function Avatar({ src, size = 38, alt = "", ring }: { src?: string; size?: number; alt?: string; ring?: boolean }) {
  return (
    <span
      className={cn(
        "inline-block shrink-0 overflow-hidden rounded-full",
        !src && "placeholder-stripes",
        ring && "ring-2 ring-accent ring-offset-2"
      )}
      style={{ width: size, height: size }}
    >
      {src && <img src={src} alt={alt} width={size} height={size} className="h-full w-full object-cover" />}
    </span>
  );
}
