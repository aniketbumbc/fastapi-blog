import { cn } from "@/lib/cn";

export default function Loader({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("relative h-14.5 w-21 perspective-[900px]", className)}
    >
      <div className="nb-loader-page nb-loader-page--left absolute inset-y-0 left-0 w-10.5" />
      <div className="nb-loader-page nb-loader-page--right absolute inset-y-0 right-0 w-10.5" />
      <div className="nb-loader-page nb-loader-leaf absolute left-10.5 top-0 h-full w-10.5" />
      <div className="nb-loader-page nb-loader-leaf nb-loader-leaf--delay absolute left-10.5 top-0 h-full w-10.5" />
      <div className="absolute -inset-y-0.5 left-10 w-0.5 rounded-xs bg-marker shadow-[0_0_0_1px_rgba(0,0,0,0.08)]" />
    </div>
  );
}
