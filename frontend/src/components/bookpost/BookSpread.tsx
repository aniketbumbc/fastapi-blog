import type { ReactNode } from "react";
import { BookPage } from "./BookPage";
import { BindingHoles } from "./Bindingholes";

interface BookSpreadProps {
  left?: ReactNode;
  right?: ReactNode;
  leftNumber?: number;
  rightNumber?: number;
}

/** Desktop/tablet layout: two sheets meeting at a centre spiral binding. */
export function BookSpread({
  left,
  right,
  leftNumber,
  rightNumber,
}: BookSpreadProps) {
  return (
    <div className="book-shell book-shell--spread relative mx-auto flex w-full max-w-[1120px] overflow-hidden rounded">
      <div className="flex-1">
        <BookPage bindingSide="right" pageNumber={leftNumber}>
          {left}
        </BookPage>
      </div>
      <div className="flex-1">
        <BookPage bindingSide="left" pageNumber={rightNumber}>
          {right}
        </BookPage>
      </div>
      <BindingHoles className="book-gutter" />
    </div>
  );
}