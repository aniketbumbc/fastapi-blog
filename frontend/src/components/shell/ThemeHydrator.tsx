"use client";

import { useEffect } from "react";
import { useTheme } from "@/store/theme";

// The blocking <script> in layout.tsx sets the initial `.dark` class before
// paint. Once Zustand rehydrates from localStorage, this keeps the DOM class
// in sync with any change made in another tab.
export default function ThemeHydrator() {
  useEffect(() => {
    return useTheme.persist.onFinishHydration((state) => {
      document.documentElement.classList.toggle("dark", state.mode === "dark");
    });
  }, []);

  return null;
}
