// @ts-nocheck
"use client";
import { Link } from "@/lib/router";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { credentials } from "@/data/company";

export default function CredentialsSection() {
  return (
    <section className="border-t border-brand-line bg-brand-light py-20 lg:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Corporate Credentials"
            title="Licensed, accredited, and registered"
            description="Documented registrations and classifications that support public and private procurement."
          />
          <Link
            to="/compliance"
            className="inline-flex shrink-0 items-center gap-2 font-heading text-[11.5px] font-bold uppercase tracking-[0.12em] text-brand-black transition-colors hover:text-brand-red"
          >
            Compliance &amp; credentials
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-14 grid gap-px bg-brand-line sm:grid-cols-2 lg:grid-cols-3">
          {credentials.map((credential, index) => (
            <Reveal key={credential.title} delay={index * 0.04}>
              <div className="flex h-full items-start gap-4 bg-white p-6">
                <BadgeCheck
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-red"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-heading text-[14px] font-bold uppercase leading-snug tracking-[0.03em] text-brand-black">
                    {credential.title}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-brand-gray">
                    {credential.note}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}