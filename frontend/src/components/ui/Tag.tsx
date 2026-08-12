import { cn } from "@/lib/cn";

export default function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full bg-highlight/60 px-2.5 py-1 font-body text-xs font-medium text-ink", className)}>
      {children}
    </span>
  );
}
