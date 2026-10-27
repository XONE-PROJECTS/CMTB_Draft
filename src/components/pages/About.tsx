// @ts-nocheck
"use client";
import { Link } from "@/lib/router";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import CommitmentsSection from "@/components/about/CommitmentsSection";
import ManagementSection from "@/components/about/ManagementSection";
import CapabilitiesSection from "@/components/home/CapabilitiesSection";
import CoverageSection from "@/components/home/CoverageSection";
import CredentialsSection from "@/components/home/CredentialsSection";
import Reveal from "@/components/site/Reveal";
import { company } from "@/data/company";

export default function About() {
  return (
    <>
      <PageHero
        scene="about"
        eyebrow="About Us"
        title="An integrated construction and infrastructure solutions partner"
        description="Headquartered in Ortigas Center, Pasig City, with branch operations in San Fernando City, La Union — combining construction execution, engineering, project management, concrete production, and equipment resources."
        image="https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/12744c7e4_generated_fe2139ed.png"
        imageAlt="Construction site at dusk with floodlit concrete structure and tower crane"
      />

      <section className="bg-white py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="h-[3px] w-8 bg-brand-red" />
              <span className="eyebrow text-brand-red">Company Overview</span>
            </div>
            <h2 className="mt-5 text-[26px] font-extrabold uppercase leading-[1.12] text-brand-black sm:text-[34px]">
              Construction capability backed by owned resources
            </h2>
            <p className="mt-6 text-[15.5px] leading-[1.8] text-brand-gray">
              {company.name} specialises in planning, design, construction, project management, and
              ready-mix concrete supply for residential, commercial, industrial, institutional, and
              infrastructure developments.
            </p>
            <p className="mt-4 text-[15px] leading-[1.8] text-brand-gray">
              The company's capabilities combine construction execution, technical expertise, project
              management, concrete production, equipment resources, and logistics support. This
              integrated structure allows site works, structural pours, lifting operations, and
              material hauling to be scheduled against one delivery team rather than coordinated
              across separate contractors and suppliers.
            </p>
            <p className="mt-4 text-[15px] leading-[1.8] text-brand-gray">
              Projects are executed under a documented framework covering planning and cost
              management, mobilization, quality management and safety, monitoring and reporting, and
              turnover.
            </p>

            <Link
              to="/services"
              className="mt-8 inline-flex items-center gap-2 border border-brand-black px-6 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-brand-black transition-colors hover:bg-brand-black hover:text-white"
            >
              Review our services
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <Reveal className="lg:col-span-5">
            <div className="photo-frame relative aspect-[3/4] overflow-hidden bg-brand-charcoal">
              <div className="photo-parallax" data-parallax>
              <Image
                src="https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/bad48ba14_generated_87ae2d4b.png"
                alt="Close-up of reinforced concrete column base with tied rebar"
                className="h-full w-full object-cover"
              />
              </div>
            </div>
            <p className="mt-4 text-[11.5px] leading-relaxed text-brand-muted">
              Illustrative construction imagery. Project photography from the corporate profile will
              replace illustrative imagery where released for publication.
            </p>
          </Reveal>
        </div>
      </section>

      <CommitmentsSection />
      <CapabilitiesSection />
      <ManagementSection />
      <CoverageSection />
      <CredentialsSection />
      <CtaBand
        headline="Work with an accountable partner."
        text="Speak with our team about construction, design-build, concrete supply, or equipment support requirements."
      />
    </>
  );
}
