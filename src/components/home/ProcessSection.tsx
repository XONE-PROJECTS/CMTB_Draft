// @ts-nocheck
"use client";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { processStages } from "@/data/company";

export default function ProcessSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Execution Framework"
          title="A disciplined path from planning to turnover"
          description="Every engagement follows a documented sequence of planning, mobilization, quality management, monitoring, and turnover."
        />

        <ol className="mt-14 border-t border-brand-line">
          {processStages.map((stage, index) => (
            <Reveal key={stage.number} delay={index * 0.04}>
              <li className="group grid gap-3 border-b border-brand-line py-7 transition-colors hover:bg-brand-light sm:grid-cols-12 sm:items-start sm:gap-6 sm:px-4">
                <div className="sm:col-span-2">
                  <span className="font-heading text-[22px] font-extrabold tracking-tight text-brand-line transition-colors group-hover:text-brand-red sm:text-[26px]">
                    {stage.number}
                  </span>
                </div>
                <h3 className="font-heading text-[16px] font-bold uppercase leading-snug tracking-[0.02em] text-brand-black sm:col-span-5 sm:text-[17px]">
                  {stage.title}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-brand-gray sm:col-span-5">
                  {stage.text}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}