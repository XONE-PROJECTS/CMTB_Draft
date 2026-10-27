// @ts-nocheck
"use client";
import { Link } from "@/lib/router";
import { ArrowRight } from "lucide-react";

export default function CtaBand({
  headline = "Let's Build Something That Lasts.",
  text = "Partner with CMTBuilders for construction, infrastructure, concrete supply, and integrated project delivery solutions.",
  primaryLabel = "Discuss Your Project",
  secondaryLabel = "Contact Our Team",
}) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-charcoal">
      <div className="blueprint-grid-dark absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="absolute left-0 top-0 h-full w-[4px] bg-brand-red" aria-hidden="true" />
      <div className="container-x relative z-10 py-16 sm:py-20 lg:py-24">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="max-w-xl text-[28px] font-extrabold uppercase leading-[1.1] text-white sm:text-[38px] lg:text-[44px]">
              {headline}
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-[1.7] text-white/60">{text}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-brand-red px-7 py-4 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-redDark"
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border border-white/25 px-7 py-4 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:border-white hover:bg-white hover:text-brand-black"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}