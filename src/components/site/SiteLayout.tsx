// @ts-nocheck
"use client";
import { useLocation } from "@/lib/router";
import { useEffect } from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import type { ReactNode } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const element = document.getElementById(hash.slice(1));
    if (element) {
      window.requestAnimationFrame(() =>
        element.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    }
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
