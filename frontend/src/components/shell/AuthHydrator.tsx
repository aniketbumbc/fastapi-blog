"use client";

import { useEffect } from "react";
import { useAuth } from "@/store/auth";

// Revalidates the sessionStorage-restored token against the backend once,
// right after this tab finishes rehydrating the auth store.
export default function AuthHydrator() {
  const hasHydrated = useAuth((s) => s.hasHydrated);
  const checkSession = useAuth((s) => s.checkSession);

  useEffect(() => {
    if (hasHydrated) checkSession();
  }, [hasHydrated, checkSession]);

  return null;
}
