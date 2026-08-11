interface BindingHolesProps {
    /** Extra positioning classes, e.g. book-gutter (centre) or book-gutter--left. */
    className?: string;
    count?: number;
  }
  
  /** The punched holes + wire loops that run down the binding. Decorative. */
  export function BindingHoles({ className = "", count = 11 }: BindingHolesProps) {
    return (
      <div aria-hidden className={`notebook-binding ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className="notebook-hole" />
        ))}
      </div>
    );
  }