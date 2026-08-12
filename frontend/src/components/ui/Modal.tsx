"use client";
import { useEffect } from "react";
import Button from "./Button";

type Props = {
  open: boolean;
  onClose: () => void;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  confirmLabel: string;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  children?: React.ReactNode; // e.g. the "type username" input
};

export default function Modal({ open, onClose, icon, title, description, confirmLabel, onConfirm, confirmDisabled, children }: Props) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#22221c]/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="notebook-paper book-shell w-full max-w-[420px] rounded-md border border-neutral-300/70 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {icon && <div className="mb-3 grid h-11 w-11 place-items-center rounded-md bg-marker/10 text-lg text-marker">{icon}</div>}
        <h2 className="font-display text-2xl font-bold text-marker">{title}</h2>
        {description && <p className="mt-1.5 font-body text-sm text-ink-soft">{description}</p>}
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} disabled={confirmDisabled}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
