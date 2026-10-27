// @ts-nocheck
"use client";
import { Link } from "@/lib/router";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { projects } from "@/data/projects";

export default function ProjectsSection() {
  return (
    <section className="bg-brand-light py-20 lg:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Project Highlights"
            title="Documented project experience"
            description="Selected developments across hospitality, aviation, commercial, institutional, and residential sectors."
          />
          <Link
            to="/projects"
            className="inline-flex shrink-0 items-center gap-2 font-heading text-[11.5px] font-bold uppercase tracking-[0.12em] text-brand-black transition-colors hover:text-brand-red"
          >
            View all projects
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.04}>
              <Link
                to={`/projects/${project.slug}`}
                className="group block overflow-hidden border border-brand-line bg-white transition-colors hover:border-brand-black"
              >
                <div className="relative aspect-[3/2] overflow-hidden bg-brand-charcoal">
                  <Image
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/55 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 bg-brand-red px-2.5 py-1 font-heading text-[9.5px] font-bold uppercase tracking-[0.12em] text-white">
                    {project.filter}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-[15.5px] font-bold uppercase leading-snug tracking-[0.02em] text-brand-black group-hover:text-brand-red">
                    {project.title}
                  </h3>
                  <p className="mt-2 flex items-center gap-1.5 text-[12px] text-brand-muted">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    {project.location}
                  </p>
                  <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-brand-gray">
                    {project.summary}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}