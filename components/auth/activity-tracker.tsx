"use client";

import { useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function ActivityTracker() {
  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) return;
      void supabase.rpc("touch_app_active", { p_app: "tarutaru" }).then(({ error }) => {
        if (error && process.env.NODE_ENV === "development") {
          console.warn("[touch_app_active] failed:", error.message);
        }
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
