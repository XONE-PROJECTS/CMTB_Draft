// @ts-nocheck
"use client";
import { Link } from "@/lib/router";
import { Check, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/site/Reveal";

const inquiryByService = {
  "general-construction": "General Construction",
  "design-and-build": "Design and Build",
  "infrastructure-site-development": "Infrastructure and Site Development",
  "project-management": "Project Management",
  "ready-mix-concrete": "Ready-Mix Concrete",
  "equipment-support": "Equipment Rental",
};

export default function ServiceDetail({ service, index }) {
  const reversed = index % 2 === 1;
  const inquiryType = inquiryByService[service.id] || "Other";

  return (
    <section id={service.id} className={`scroll-mt-28 py-16 lg:py-20 ${reversed ? "bg-brand-light" : "bg-white"}`}>
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className={`lg:col-span-6 ${reversed ? "lg:order-2" : ""}`}>
          <div className="relative aspect-[4/3] overflow-hidden bg-brand-charcoal">
            <Image
              src={service.image}
              alt={service.title}
              className="h-full w-full object-cover"
            />
            <span className="absolute left-0 top-0 bg-brand-red px-3 py-2 font-heading text-[10px] font-bold uppercase tracking-[0.14em] text-white">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </Reveal>

        <div className={`lg:col-span-6 ${reversed ? "lg:order-1" : ""}`}>
          <div className="flex items-center gap-3">
            <span className="h-[3px] w-8 bg-brand-red" />
            <span className="eyebrow text-brand-red">Service</span>
          </div>
          <h2 className="mt-4 text-[24px] font-extrabold uppercase leading-[1.15] text-brand-black sm:text-[30px]">
            {service.title}
          </h2>
          <p className="mt-3 text-[15px] font-medium leading-relaxed text-brand-black/80">
            {service.lede}
          </p>

          {service.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mt-4 text-[14px] leading-[1.8] text-brand-gray">
              {paragraph}
            </p>
          ))}

          <h3 className="mt-8 font-heading text-[10.5px] font-bold uppercase tracking-[0.18em] text-brand-muted">
            Scope of capability
          </h3>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {service.capabilities.map((capability) => (
              <li key={capability} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-red" aria-hidden="true" />
                <span className="text-[13px] leading-snug text-brand-gray">{capability}</span>
              </li>
            ))}
          </ul>

          <Link
            to={`/contact?type=${encodeURIComponent(inquiryType)}`}
            className="mt-8 inline-flex items-center gap-2 bg-brand-black px-6 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-red"
          >
            Inquire about this service
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}