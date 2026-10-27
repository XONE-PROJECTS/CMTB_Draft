// @ts-nocheck
"use client";
import { Link } from "@/lib/router";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { company } from "@/data/company";

const facts = [
  { label: "PCAB AAA Accredited", note: "General Engineering & General Building" },
  { label: "Integrated Delivery", note: "Construction, concrete, and equipment" },
  { label: "Primary Areas", note: "Regions I · CAR · III · NCR" },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-black">
      <Image
        src="https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/5fa888d3d_generated_219e1d9b.png"
        alt="Reinforced concrete high-rise under construction with tower cranes at golden hour"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/80 to-brand-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-brand-black/30" />
      <div
        className="absolute inset-y-0 left-[7%] hidden w-[1px] bg-white/10 lg:block"
        aria-hidden="true"
      />

      <div className="container-x relative z-10 flex min-h-[560px] flex-col justify-center py-20 lg:min-h-[640px] lg:py-28">
        <div className="max-w-3xl border-l-[3px] border-brand-red pl-6 sm:pl-8">
          <p className="eyebrow text-white/60">
            Construction &amp; Infrastructure · Philippines
          </p>
          <h1 className="mt-6 text-[34px] font-extrabold uppercase leading-[1.05] text-white sm:text-[50px] lg:text-[62px]">
            Building the future.
            <span className="block text-white/90">Engineered for excellence.</span>
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-[1.75] text-white/70 sm:text-[17px]">
            {company.name} delivers integrated construction, engineering, infrastructure, and
            ready-mix concrete solutions for developments across the Philippines.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-brand-red px-7 py-4 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-redDark"
            >
              Discuss Your Project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 border border-white/30 px-7 py-4 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white hover:text-brand-black"
            >
              Explore Our Capabilities
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/15 bg-brand-black/55 backdrop-blur-sm">
        <dl className="container-x grid divide-white/10 sm:grid-cols-3 sm:divide-x">
          {facts.map((fact) => (
            <div key={fact.label} className="border-b border-white/10 py-6 sm:border-b-0 sm:px-6 sm:first:pl-0">
              <dt className="font-heading text-[13px] font-bold uppercase tracking-[0.08em] text-white">
                {fact.label}
              </dt>
              <dd className="mt-1.5 text-[12.5px] text-white/55">{fact.note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}