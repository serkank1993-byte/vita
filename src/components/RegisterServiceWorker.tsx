"use client";

import { useEffect } from "react";

export function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // sessiz geç: PWA yüklenebilirliği bozulur ama uygulama çalışmaya devam eder
      });
    }
  }, []);

  return null;
}
