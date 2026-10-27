"use client";
import { Link } from "@/lib/router";
import { Image } from "@/components/ui/image";
import SceneViewport from "./SceneViewport";
import type { SceneVariant } from "./construction-model";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  scene: SceneVariant;
};

export default function PageHero({ eyebrow, title, description, image, imageAlt, scene }: PageHeroProps) {
  return (
    <section className="cinematic-hero relative isolate overflow-hidden bg-brand-black">
      {image && (
        <div className="hero-photo" data-parallax>
        <Image
          src={image}
          alt={imageAlt || ""}
          className="absolute inset-0 h-full w-full object-cover"
        />
        </div>
      )}
      <div className="hero-shade absolute inset-0" />
      <div className="blueprint-grid-dark absolute inset-0 opacity-60" aria-hidden="true" />

      <div className="container-x hero-grid relative z-10">
        <div className="hero-copy">
        {eyebrow && (
          <div className="flex items-center gap-3" data-hero-intro>
            <span className="h-[3px] w-10 bg-brand-red" />
            <span className="eyebrow text-white/60">{eyebrow}</span>
          </div>
        )}
        <h1 data-split className="mt-5 max-w-4xl text-[32px] font-extrabold uppercase leading-[1.08] text-white sm:text-[44px] lg:text-[56px]">
          {title}
        </h1>
        {description && (
          <p data-hero-intro className="mt-5 max-w-2xl text-[15px] leading-[1.7] text-white/70 sm:text-base">
            {description}
          </p>
        )}
        <nav aria-label="Breadcrumb" className="hero-breadcrumb mt-8 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-white/40">
          <Link to="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-white/70">{title}</span>
        </nav>
        </div>
        <SceneViewport variant={scene} />
      </div>
    </section>
  );
}
