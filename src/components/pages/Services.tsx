// @ts-nocheck
"use client";
import PageHero from "@/components/site/PageHero";
import ServiceDetail from "@/components/services/ServiceDetail";
import CtaBand from "@/components/site/CtaBand";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { serviceDetails, deliveryPhases } from "@/data/serviceDetails";

export default function Services() {
  return (
    <>
      <PageHero
        scene="services"
        eyebrow="Services"
        title="Construction capability across six service lines"
        description="From general construction and design-build delivery to ready-mix concrete supply and heavy equipment support — coordinated by one delivery organisation."
        image="https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/bad48ba14_generated_87ae2d4b.png"
        imageAlt="Reinforced concrete column base with tied rebar and formwork clamps"
      />

      <nav data-service-nav aria-label="Service sections" className="sticky top-[72px] z-30 border-b border-brand-line bg-white/95 backdrop-blur lg:top-[108px]">
        <div className="container-x flex gap-6 overflow-x-auto py-4">
          {serviceDetails.map((service) => (
            <a
              key={service.id}
              href={`#${service.id}`}
              className="shrink-0 font-heading text-[11px] font-bold uppercase tracking-[0.1em] text-brand-gray transition-colors hover:text-brand-red"
            >
              {service.title}
            </a>
          ))}
        </div>
      </nav>

      {serviceDetails.map((service, index) => (
        <ServiceDetail key={service.id} service={service} index={index} />
      ))}

      <section className="relative isolate overflow-hidden bg-brand-charcoal py-20 lg:py-24">
        <div className="blueprint-grid-dark absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-x relative z-10">
          <SectionHeading
            eyebrow="Integrated Project Delivery"
            title="Five phases, one coordinated model"
            description="The integrated model connects pre-construction planning, design, construction, concrete supply, and equipment logistics so each stage is resolved before the next begins."
            invert
          />
          <div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {deliveryPhases.map((phase, index) => (
              <Reveal key={phase.number} delay={index * 0.04}>
                <div className="h-full bg-brand-charcoal p-6">
                  <span className="font-heading text-[11px] font-bold tracking-[0.14em] text-brand-red">
                    {phase.number}
                  </span>
                  <h3 className="mt-3 font-heading text-[14px] font-bold uppercase leading-snug text-white">
                    {phase.title}
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {phase.items.map((item) => (
                      <li key={item} className="text-[12.5px] leading-snug text-white/55">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-[12.5px] leading-relaxed text-white/40">
            Integrated delivery coordinates the interfaces between disciplines and suppliers. It does
            not by itself guarantee cost or schedule savings, which depend on scope, site conditions,
            and approvals.
          </p>
        </div>
      </section>

      <CtaBand
        headline="Tell us what you are building."
        text="Share your project scope, location, and target schedule. Our team will respond with the capabilities and resources relevant to your requirement."
      />
    </>
  );
}
