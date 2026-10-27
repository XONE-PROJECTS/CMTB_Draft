// @ts-nocheck
"use client";
import SectionHeading from "@/components/site/SectionHeading";
import { capabilities } from "@/data/company";

export default function CapabilitiesSection() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-charcoal py-20 lg:py-28">
      <div className="blueprint-grid-dark absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="container-x relative z-10 grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Operational Capabilities"
              title="Strengths that work together"
              description="Each capability supports the others — engineering informs execution, equipment protects schedule, and concrete supply keeps structural works moving."
              invert
            />
          </div>
        </div>

        <div className="lg:col-span-8">
          <ul className="grid gap-px bg-white/10 sm:grid-cols-2">
            {capabilities.map((capability, index) => (
              <li key={capability.title} className="bg-brand-charcoal p-6 lg:p-7">
                <span className="font-heading text-[11px] font-bold tracking-[0.14em] text-brand-red">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-heading text-[14.5px] font-bold uppercase leading-snug tracking-[0.03em] text-white">
                  {capability.title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-white/55">
                  {capability.text}
                </p>
              </li>
            ))}
            <li className="flex items-center bg-brand-red p-6 lg:p-7">
              <p className="font-heading text-[13px] font-bold uppercase leading-snug tracking-[0.05em] text-white">
                One delivery team accountable for planning, execution, supply, and turnover.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}