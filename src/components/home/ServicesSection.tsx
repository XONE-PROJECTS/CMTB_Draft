// @ts-nocheck
"use client";
import { Link } from "@/lib/router";
import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { services } from "@/data/company";

export default function ServicesSection() {
  return (
    <section className="bg-brand-light py-20 lg:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Core Services"
            title="Construction capability, end to end"
            description="Six service lines covering project planning, design coordination, construction execution, concrete supply, and equipment support."
          />
          <Link
            to="/services"
            className="inline-flex shrink-0 items-center gap-2 font-heading text-[11.5px] font-bold uppercase tracking-[0.12em] text-brand-black transition-colors hover:text-brand-red"
          >
            All services
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="service-grid mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.id} delay={index * 0.05}>
                <Link
                  to={`/services#${service.id}`}
                  className="service-card group flex h-full flex-col bg-white transition-colors hover:bg-white"
                >
                  <div className="relative h-44 overflow-hidden bg-brand-charcoal">
                    <Image
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-brand-black/25 transition-colors group-hover:bg-brand-red/20" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <Icon
                      className="h-5 w-5 text-brand-red"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <h3 className="mt-4 font-heading text-[16px] font-bold uppercase leading-snug tracking-[0.02em] text-brand-black">
                      {service.title}
                    </h3>
                    <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-brand-gray">
                      {service.short}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 font-heading text-[10.5px] font-bold uppercase tracking-[0.14em] text-brand-red">
                      View service
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
