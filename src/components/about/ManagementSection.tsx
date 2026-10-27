// @ts-nocheck
"use client";
import { Check } from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";

const management = [
  {
    initials: "TE",
    name: "Engr. Teodardo B. Esteban",
    role: "Head of Operations",
    credentials: [
      "Licensed Civil Engineer",
      "Master of Science in Civil Engineering, specializing in Structural Engineering",
      "More than 36 years of experience",
      "Experience across construction, engineering, infrastructure, and project management",
      "Lean Six Sigma Practitioner",
      "APM Awards 2020 recognition",
    ],
  },
  {
    initials: "RP",
    name: "Engr. Renato V. Principio, CE, MBA",
    role: "Project Management Consultant",
    credentials: [
      "Licensed Civil Engineer",
      "Master of Business Administration",
      "More than 46 years of construction, engineering, and infrastructure experience",
      "Experience in project management, cost control, contract administration, and construction management",
      "Experience in quality assurance and safety management",
    ],
  },
];

export default function ManagementSection() {
  return (
    <section className="bg-brand-light py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Management"
          title="Engineering leadership"
          description="The company's operations and project management functions are led by licensed civil engineers with decades of construction and infrastructure experience."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {management.map((person, index) => (
            <Reveal key={person.name} delay={index * 0.06}>
              <article className="flex h-full flex-col border border-brand-line bg-white">
                <div className="flex items-center gap-5 border-b border-brand-line p-6">
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center bg-brand-black"
                    aria-hidden="true"
                  >
                    <span className="font-heading text-[18px] font-extrabold tracking-tight text-white">
                      {person.initials}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading text-[16px] font-bold uppercase leading-snug text-brand-black">
                      {person.name}
                    </h3>
                    <p className="mt-1 font-heading text-[10.5px] font-bold uppercase tracking-[0.14em] text-brand-red">
                      {person.role}
                    </p>
                  </div>
                </div>
                <ul className="flex-1 space-y-3 p-6">
                  {person.credentials.map((credential) => (
                    <li key={credential} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-red" aria-hidden="true" />
                      <span className="text-[13px] leading-relaxed text-brand-gray">
                        {credential}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 max-w-2xl text-[12px] leading-relaxed text-brand-muted">
          Approved corporate photographs of the management team will be added once released for
          publication. Profiles above reflect the qualifications documented in the corporate profile.
        </p>
      </div>
    </section>
  );
}
