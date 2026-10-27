// @ts-nocheck
"use client";
import { useEffect } from "react";
import { Link, useParams } from "@/lib/router";
import { ArrowLeft, ArrowRight, MapPin, Info } from "lucide-react";
import { Image } from "@/components/ui/image";
import CtaBand from "@/components/site/CtaBand";
import { getProject, projects } from "@/data/projects";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProject(slug);

  useEffect(() => {
    if (project) return;
    const meta = document.createElement("meta");
    meta.name = "prerender-status-code";
    meta.content = "404";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, [project]);

  if (!project) {
    return (
      <div className="container-x py-28 text-center">
        <p className="eyebrow text-brand-red">Project not found</p>
        <h1 className="mt-4 text-[28px] font-extrabold uppercase text-brand-black sm:text-[36px]">
          This project is not available
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-brand-gray">
          The project you are looking for may have been moved. Browse the full portfolio to see
          documented project experience.
        </p>
        <Link
          to="/projects"
          className="mt-8 inline-flex items-center gap-2 bg-brand-red px-6 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-redDark"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to projects
        </Link>
      </div>
    );
  }

  const related = projects.filter((item) => item.slug !== project.slug).slice(0, 3);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-brand-black">
        <Image
          src={project.image}
          alt={project.title}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/85 to-brand-black/40" />
        <div className="container-x relative z-10 py-16 lg:py-24">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 font-heading text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            All projects
          </Link>
          <p className="mt-8 font-heading text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-red">
            {project.category}
          </p>
          <h1 className="mt-3 max-w-3xl text-[30px] font-extrabold uppercase leading-[1.1] text-white sm:text-[44px] lg:text-[52px]">
            {project.title}
          </h1>
          <p className="mt-4 flex items-center gap-2 text-[13px] text-white/60">
            <MapPin className="h-4 w-4 text-brand-red" aria-hidden="true" />
            {project.location}
          </p>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3">
              <span className="h-[3px] w-8 bg-brand-red" />
              <span className="eyebrow text-brand-red">Project Overview</span>
            </div>
            <p className="mt-5 text-[16px] leading-[1.8] text-brand-gray">{project.summary}</p>

            <h2 className="mt-10 font-heading text-[12px] font-bold uppercase tracking-[0.18em] text-brand-black">
              Scope of works
            </h2>
            <ul className="mt-5 divide-y divide-brand-line border-y border-brand-line">
              {project.scope.map((item) => (
                <li key={item} className="flex items-start gap-3 py-3.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-brand-red" aria-hidden="true" />
                  <span className="text-[14px] leading-relaxed text-brand-gray">{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 flex items-start gap-2.5 border-l-2 border-brand-line pl-4 text-[12px] leading-relaxed text-brand-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {project.notes}
            </p>
          </div>

          <aside className="lg:col-span-4">
            <div className="border border-brand-line bg-brand-light p-6 lg:sticky lg:top-28">
              <h2 className="font-heading text-[14px] font-bold uppercase leading-snug text-brand-black">
                Delivering a similar project?
              </h2>
              <p className="mt-3 text-[13px] leading-relaxed text-brand-gray">
                Our team can review your scope, site conditions, and programme, and advise on the
                construction, concrete, and equipment resources required.
              </p>
              <Link
                to="/contact?type=General%20Construction"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-brand-red px-5 py-3.5 font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-redDark"
              >
                Discuss your project
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <dl className="mt-6 space-y-4 border-t border-brand-line pt-5">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-brand-muted">
                    Category
                  </dt>
                  <dd className="mt-1 text-[13px] font-medium text-brand-black">{project.category}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-brand-muted">
                    Location
                  </dt>
                  <dd className="mt-1 text-[13px] font-medium text-brand-black">{project.location}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-brand-line bg-brand-light py-16 lg:py-20">
        <div className="container-x">
          <h2 className="font-heading text-[18px] font-extrabold uppercase text-brand-black">
            Related projects
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                to={`/projects/${item.slug}`}
                className="group block overflow-hidden border border-brand-line bg-white transition-colors hover:border-brand-black"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-4">
                  <p className="font-heading text-[9.5px] font-bold uppercase tracking-[0.14em] text-brand-red">
                    {item.filter}
                  </p>
                  <h3 className="mt-1.5 font-heading text-[13.5px] font-bold uppercase leading-snug text-brand-black">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}