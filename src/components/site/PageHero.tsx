// @ts-nocheck
"use client";
import { Link } from "@/lib/router";
import { Image } from "@/components/ui/image";

export default function PageHero({ eyebrow, title, description, image, imageAlt }) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-black">
      {image && (
        <Image
          src={image}
          alt={imageAlt || ""}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/85 to-brand-black/45" />
      <div className="blueprint-grid-dark absolute inset-0 opacity-60" aria-hidden="true" />

      <div className="container-x relative z-10 py-16 sm:py-20 lg:py-24">
        {eyebrow && (
          <div className="flex items-center gap-3">
            <span className="h-[3px] w-10 bg-brand-red" />
            <span className="eyebrow text-white/60">{eyebrow}</span>
          </div>
        )}
        <h1 className="mt-5 max-w-4xl text-[32px] font-extrabold uppercase leading-[1.08] text-white sm:text-[44px] lg:text-[56px]">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-[15px] leading-[1.7] text-white/70 sm:text-base">
            {description}
          </p>
        )}
        <nav aria-label="Breadcrumb" className="mt-8 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-white/40">
          <Link to="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-white/70">{title}</span>
        </nav>
      </div>
    </section>
  );
}