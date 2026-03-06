"use client";

import { useEffect } from "react";

export default function PlyrPreload() {
  useEffect(() => {
    const timer = setTimeout(() => {
      import("plyr").catch(() => {});

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.plyr.io/3.7.8/plyr.css";
      if (!document.querySelector(`link[href="${link.href}"]`)) {
        document.head.appendChild(link);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
