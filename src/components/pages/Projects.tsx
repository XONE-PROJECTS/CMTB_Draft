// @ts-nocheck
"use client";
import { useState } from "react";
import { Link } from "@/lib/router";
import { ArrowUpRight, MapPin, Info } from "lucide-react";
import { Image } from "@/components/ui/image";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import Reveal from "@/components/site/Reveal";
import { projects, projectFilters } from "@/data/projects";

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? projects : projects.filter((p) => p.filter === filter);

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Documented project experience"
        description="Selected developments across hospitality, aviation, commercial, institutional, and residential sectors."
        image="https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/0f187da66_generated_8e65c987.png"
        imageAlt="Hillside resort development overlooking the sea"
      />

      <section className="bg-white py-14 lg:py-20">
        <div className="container-x">
          <div className="flex flex-wrap gap-2">
            {projectFilters.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                aria-pressed={filter === option}
                className={`border px-4 py-2.5 font-heading text-[10.5px] font-bold uppercase tracking-[0.1em] transition-colors ${
                  filter === option
                    ? "border-brand-red bg-brand-red text-white"
                    : "border-brand-line text-brand-gray hover:border-brand-black hover:text-brand-black"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((project, index) => (
              <Reveal key={project.slug} delay={index * 0.04}>
                <Link
                  to={`/projects/${project.slug}`}
                  className="group flex h-full flex-col overflow-hidden border border-brand-line transition-colors hover:border-brand-black"
                >
                  <div className="relative aspect-[3/2] overflow-hidden bg-brand-charcoal">
                    <Image
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 bg-brand-red px-2.5 py-1 font-heading text-[9.5px] font-bold uppercase tracking-[0.12em] text-white">
                      {project.filter}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="font-heading text-[10px] font-bold uppercase tracking-[0.14em] text-brand-muted">
                      {project.category}
                    </p>
                    <h2 className="mt-2 font-heading text-[16px] font-bold uppercase leading-snug text-brand-black transition-colors group-hover:text-brand-red">
                      {project.title}
                    </h2>
                    <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-brand-muted">
                      <MapPin className="h-3 w-3" aria-hidden="true" />
                      {project.location}
                    </p>
                    <p className="mt-3 flex-1 text-[13px] leading-relaxed text-brand-gray">
                      {project.summary}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 font-heading text-[10px] font-bold uppercase tracking-[0.12em] text-brand-red">
                      View project
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <p className="mt-12 flex max-w-3xl items-start gap-2.5 border-l-2 border-brand-line pl-4 text-[12px] leading-relaxed text-brand-muted">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Project descriptions reflect the corporate profile. Dates, contract values, and completion
            figures are not stated in the source document and are therefore not published. Project
            photography from the corporate profile will replace illustrative imagery where released
            for publication.
          </p>
        </div>
      </section>

      <CtaBand
        headline="Planning a similar development?"
        text="Discuss your project scope and site conditions with our construction and engineering team."
      />
    </>
  );
}