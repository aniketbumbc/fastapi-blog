import { cn } from "@/lib/cn";

export default function Card({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("notebook-paper book-shell rounded-md border border-neutral-300/70", className)} {...rest} />;
}
