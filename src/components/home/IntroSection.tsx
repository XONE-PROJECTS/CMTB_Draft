// @ts-nocheck
"use client";
import { Link } from "@/lib/router";
import { ArrowRight } from "lucide-react";
import { company } from "@/data/company";

const pillars = [
  {
    number: "01",
    title: "Construction execution",
    text: "Direct delivery of site development, vertical construction, infrastructure works, fit-outs, and renovations.",
  },
  {
    number: "02",
    title: "Ready-mix concrete",
    text: "Concrete produced through a portable batching plant and delivered by transit mixers and pumping equipment.",
  },
  {
    number: "03",
    title: "Equipment and logistics",
    text: "An owned equipment fleet and transport assets mobilized to support project sequencing and site supply.",
  },
];

export default function IntroSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3">
            <span className="h-[3px] w-8 bg-brand-red" />
            <span className="eyebrow text-brand-red">Who We Are</span>
          </div>
          <h2 className="mt-5 text-[28px] font-extrabold uppercase leading-[1.1] text-brand-black sm:text-[36px] lg:text-[42px]">
            Integrated solutions.
            <span className="block text-brand-gray">One accountable partner.</span>
          </h2>
          <Link
            to="/about"
            className="mt-8 inline-flex items-center gap-2 border border-brand-black px-6 py-3.5 font-heading text-[11.5px] font-bold uppercase tracking-[0.12em] text-brand-black transition-colors hover:bg-brand-black hover:text-white"
          >
            Discover CMTBuilders
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="lg:col-span-7">
          <p className="text-[16px] leading-[1.8] text-brand-gray sm:text-[17px]">
            {company.name} is a construction and infrastructure solutions company headquartered
            in Ortigas Center, Pasig City, with branch operations in San Fernando City, La Union.
            The company specialises in planning, design, construction, project management, and
            ready-mix concrete supply for residential, commercial, industrial, institutional, and
            infrastructure developments.
          </p>
          <p className="mt-5 text-[15px] leading-[1.8] text-brand-gray">
            Its capabilities combine construction execution, technical expertise, project
            management, concrete production, equipment resources, and logistics support within a
            single delivery organisation — so design intent, site execution, material supply, and
            equipment availability are coordinated by one team.
          </p>

          <div className="mt-10 divide-y divide-brand-line border-y border-brand-line">
            {pillars.map((pillar) => (
              <div key={pillar.number} className="flex gap-5 py-5">
                <span className="font-heading text-[12px] font-bold tracking-[0.1em] text-brand-red">
                  {pillar.number}
                </span>
                <div>
                  <h3 className="font-heading text-[15px] font-bold uppercase tracking-[0.04em] text-brand-black">
                    {pillar.title}
                  </h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-brand-gray">
                    {pillar.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}