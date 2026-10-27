// @ts-nocheck
"use client";
import { Link } from "@/lib/router";
import { BadgeCheck, FileCheck, Info, ShieldCheck, ArrowRight } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";

const registrations = [
  {
    title: "Securities and Exchange Commission",
    text: "Registered corporation with the SEC.",
  },
  {
    title: "Bureau of Internal Revenue",
    text: "Registered for tax compliance with the BIR.",
  },
  {
    title: "Department of Labor and Employment",
    text: "Compliance registration with DOLE.",
  },
  {
    title: "PhilGEPS Platinum Member",
    text: "Membership in the Philippine Government Electronic Procurement System.",
  },
];

const assurance = [
  {
    title: "Equipment registration",
    text: "Equipment is registered and documented as part of fleet administration.",
  },
  {
    title: "Preventive maintenance",
    text: "Scheduled maintenance is performed to protect availability and reliability.",
  },
  {
    title: "Inspection and testing",
    text: "Equipment is inspected before deployment and during operations.",
  },
  {
    title: "OEM technical support",
    text: "Original equipment manufacturer technical support is engaged where applicable.",
  },
  {
    title: "Operator competency",
    text: "Equipment is operated by competent, assigned operators.",
  },
  {
    title: "Equipment insurance",
    text: "Fleet and equipment assets are covered by equipment insurance.",
  },
];

export default function Compliance() {
  return (
    <>
      <PageHero
        eyebrow="Compliance & Credentials"
        title="Registrations, classifications, and assurance"
        description="Documented credentials supporting public and private procurement, with compliance commitments covering safety, quality, and equipment assurance."
        image="https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/a240867ba_generated_747dc82b.png"
        imageAlt="Excavator loading a dump truck on a construction site"
      />

      <section className="bg-white py-20 lg:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="PCAB Classification"
            title="Licensed in general engineering and general building"
            description="The corporate profile states CMTBuilders as a PCAB-licensed contractor in General Engineering and General Building, with PCAB AAA accreditation."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col border border-brand-line border-l-[3px] border-l-brand-red bg-white p-7">
                <span className="font-heading text-[10px] font-bold uppercase tracking-[0.16em] text-brand-red">
                  Current classification
                </span>
                <h3 className="mt-3 font-heading text-[22px] font-extrabold uppercase leading-tight text-brand-black">
                  PCAB AAA Accredited
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-brand-gray">
                  Licensed in General Engineering and General Building. This is the current
                  accreditation classification stated in the corporate profile.
                </p>
                <ul className="mt-5 space-y-2.5">
                  {["PCAB licensed contractor", "PCAB AAA accreditation", "General Engineering / General Building scope"].map(
                    (item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" aria-hidden="true" />
                        <span className="text-[13px] text-brand-gray">{item}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="flex h-full flex-col border border-brand-line bg-brand-light p-7">
                <span className="font-heading text-[10px] font-bold uppercase tracking-[0.16em] text-brand-muted">
                  Future growth objective
                </span>
                <h3 className="mt-3 font-heading text-[22px] font-extrabold uppercase leading-tight text-brand-black">
                  Toward PCAB AAAA
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-brand-gray">
                  The corporate profile describes initiatives toward future PCAB AAAA
                  classification. This is a forward objective, not a current accreditation.
                </p>
                <p className="mt-5 flex items-start gap-2.5 border-l-2 border-brand-line pl-4 text-[12px] leading-relaxed text-brand-muted">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  CMTBuilders must not be represented as PCAB AAAA accredited. Classification is
                  subject to PCAB evaluation and licensing.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-brand-line bg-brand-light py-20 lg:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Registrations"
            title="Corporate and procurement registrations"
            description="Registrations maintained to support private and government project procurement."
          />
          <div className="mt-12 grid gap-px bg-brand-line sm:grid-cols-2 lg:grid-cols-4">
            {registrations.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.04}>
                <div className="h-full bg-white p-6">
                  <FileCheck className="h-5 w-5 text-brand-red" strokeWidth={1.7} aria-hidden="true" />
                  <h3 className="mt-4 font-heading text-[13.5px] font-bold uppercase leading-snug text-brand-black">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-brand-gray">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-[12px] leading-relaxed text-brand-muted">
            Certificate numbers, licence numbers, and expiry dates are not published on this website.
            Certified copies are provided on request during procurement.
          </p>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Safety and Equipment Assurance"
              title="How equipment and site work are controlled"
              description="Documented practices covering equipment condition, operator competency, and site safety management."
            />
            <Link
              to="/contact?type=Other"
              className="mt-8 inline-flex items-center gap-2 border border-brand-black px-6 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-brand-black transition-colors hover:bg-brand-black hover:text-white"
            >
              Request compliance documents
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="lg:col-span-7">
            <ul className="grid gap-px bg-brand-line sm:grid-cols-2">
              {assurance.map((item) => (
                <li key={item.title} className="bg-white p-6">
                  <ShieldCheck className="h-4 w-4 text-brand-red" strokeWidth={1.8} aria-hidden="true" />
                  <h3 className="mt-3 font-heading text-[13px] font-bold uppercase leading-snug text-brand-black">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-brand-gray">{item.text}</p>
                </li>
              ))}
            </ul>

            <div className="mt-6 border border-brand-line bg-brand-light p-6">
              <h3 className="font-heading text-[12.5px] font-bold uppercase tracking-[0.04em] text-brand-black">
                Health, Safety, and Environment · QA/QC
              </h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-brand-gray">
                HSE procedures, safety audits, training, inspections, and quality assurance and
                quality control processes are applied across project activities, with performance
                monitored against project requirements.
              </p>
            </div>

            <p className="mt-6 text-[12px] leading-relaxed text-brand-muted">
              No ISO certification or other accreditation is represented on this website beyond what
              is stated in the corporate profile. Any additional certification will be published only
              once verified.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        headline="Need our compliance documents?"
        text="Our team can provide company registrations, licences, and project documents required for your procurement process."
        primaryLabel="Request Documents"
        secondaryLabel="Contact Our Team"
      />
    </>
  );
}