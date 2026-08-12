import { cn } from "@/lib/cn";

export default function Loader({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("relative h-[150px] w-[220px] [perspective:900px]", className)}
    >
      <div className="nb-loader-page nb-loader-page--left absolute inset-y-0 left-0 w-[110px]" />
      <div className="nb-loader-page nb-loader-page--right absolute inset-y-0 right-0 w-[110px]" />
      <div className="nb-loader-page nb-loader-leaf absolute left-[110px] top-0 h-full w-[110px]" />
      <div className="nb-loader-page nb-loader-leaf nb-loader-leaf--delay absolute left-[110px] top-0 h-full w-[110px]" />
      <div className="absolute -inset-y-1.5 left-[108px] w-[5px] rounded-[3px] bg-[#91C11E] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]" />
    </div>
  );
}
