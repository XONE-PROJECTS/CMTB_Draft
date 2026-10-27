// @ts-nocheck
"use client";
import { ShieldCheck, Ruler, Timer, Users, Recycle } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import SectionHeading from "@/components/site/SectionHeading";

const commitments = [
  {
    icon: Ruler,
    title: "Engineering excellence",
    text: "Technical decisions are led by licensed engineers, with design and buildability reviewed before execution.",
  },
  {
    icon: ShieldCheck,
    title: "Quality and safety",
    text: "QA/QC processes and health, safety, and environment protocols apply across site activities, with inspections and audits.",
  },
  {
    icon: Timer,
    title: "Operational efficiency",
    text: "Planning, equipment allocation, and concrete supply are sequenced to reduce idle time between activities.",
  },
  {
    icon: Users,
    title: "Client satisfaction",
    text: "Progress, cost, and quality are reported against agreed baselines so owners can make informed decisions.",
  },
  {
    icon: Recycle,
    title: "Responsible execution",
    text: "Work is carried out with attention to site conditions, neighbouring communities, and regulatory requirements.",
  },
];

export default function CommitmentsSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Our Commitments"
          title="How we approach the work"
          description="Themes that guide project delivery at CMTBuilders."
        />
        <div className="mt-12 grid gap-px bg-brand-line sm:grid-cols-2 lg:grid-cols-5">
          {commitments.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 0.04}>
                <div className="h-full bg-white p-6">
                  <Icon className="h-6 w-6 text-brand-red" strokeWidth={1.6} aria-hidden="true" />
                  <h3 className="mt-4 font-heading text-[13.5px] font-bold uppercase leading-snug tracking-[0.03em] text-brand-black">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[12.5px] leading-relaxed text-brand-gray">{item.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}