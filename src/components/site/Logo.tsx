// @ts-nocheck
"use client";
import { Link } from "@/lib/router";
import { company } from "@/data/company";

export default function Logo({ variant = "dark", className = "" }) {
  const light = variant === "light";

  return (
    <Link
      to="/"
      aria-label={`${company.name} — home`}
      className={`group inline-flex items-center gap-3 ${className}`}
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center bg-brand-red">
        <span className="font-heading text-[13px] font-extrabold tracking-tight text-white">
          CMT
        </span>
        <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/40" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-heading text-[17px] font-extrabold tracking-tight ${
            light ? "text-white" : "text-brand-black"
          }`}
        >
          CMTBuilders
        </span>
        <span
          className={`mt-1 font-heading text-[8.5px] font-semibold uppercase tracking-[0.16em] ${
            light ? "text-white/55" : "text-brand-muted"
          }`}
        >
          &amp; RapidMix Concrete Solutions Inc.
        </span>
      </span>
    </Link>
  );
}