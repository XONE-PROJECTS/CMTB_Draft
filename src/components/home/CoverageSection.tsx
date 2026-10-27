// @ts-nocheck
"use client";
import { MapPin, Building, Compass } from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { company, coverageRegions } from "@/data/company";

export default function CoverageSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Geographic Coverage"
          title="Offices and service areas"
          description="Headquartered in Ortigas Center with branch operations in La Union, CMTBuilders services four primary regions and maintains the operational capability to undertake projects throughout Luzon, Visayas, and Mindanao."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-6 lg:grid-cols-1">
            {[company.headquarters, company.branch].map((office) => (
              <div
                key={office.label}
                className="flex gap-4 border border-brand-line border-l-[3px] border-l-brand-red bg-brand-light p-6"
              >
                <Building className="mt-1 h-5 w-5 shrink-0 text-brand-red" aria-hidden="true" />
                <div>
                  <h3 className="font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-brand-red">
                    {office.label}
                  </h3>
                  <address className="mt-2 text-[14px] not-italic leading-relaxed text-brand-black">
                    {office.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.mapQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 font-heading text-[10.5px] font-bold uppercase tracking-[0.12em] text-brand-gray transition-colors hover:text-brand-red"
                  >
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    Open in maps
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-px bg-brand-line">
              {coverageRegions.map((region, index) => (
                <Reveal key={region.code} delay={index * 0.04}>
                  <div className="h-full bg-white p-5">
                    <span className="font-heading text-[10px] font-bold uppercase tracking-[0.16em] text-brand-red">
                      {region.code}
                    </span>
                    <h3 className="mt-2 font-heading text-[14px] font-bold uppercase leading-snug text-brand-black">
                      {region.name}
                    </h3>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-brand-gray">
                      {region.note}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-6 flex items-start gap-3 bg-brand-black p-5">
              <Compass className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" aria-hidden="true" />
              <p className="text-[13px] leading-relaxed text-white/70">
                <span className="font-heading font-bold uppercase tracking-[0.06em] text-white">
                  Nationwide capability.
                </span>{" "}
                Beyond its primary service areas, the company maintains the operational capability
                to undertake projects throughout Luzon, Visayas, and Mindanao.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}