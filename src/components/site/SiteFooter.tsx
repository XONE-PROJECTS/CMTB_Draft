// @ts-nocheck
"use client";
import { Link } from "@/lib/router";
import { ArrowUpRight } from "lucide-react";
import Logo from "./Logo";
import { company, navigation, services } from "@/data/company";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-black text-white">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo variant="light" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/60">
            An integrated construction and infrastructure solutions partner delivering
            construction, engineering, project management, ready-mix concrete, and equipment
            support across the Philippines.
          </p>
          <div className="mt-6 h-[3px] w-12 bg-brand-red" />
        </div>

        <nav aria-label="Footer navigation" className="lg:col-span-2">
          <h2 className="eyebrow text-white/40">Company</h2>
          <ul className="mt-5 space-y-3">
            {navigation.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-sm text-white/70 transition-colors hover:text-brand-red"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Service links" className="lg:col-span-3">
          <h2 className="eyebrow text-white/40">Services</h2>
          <ul className="mt-5 space-y-3">
            {services.map((service) => (
              <li key={service.id}>
                <Link
                  to={`/services#${service.id}`}
                  className="text-sm text-white/70 transition-colors hover:text-brand-red"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="eyebrow text-white/40">Contact</h2>
          <div className="mt-5 space-y-5 text-sm text-white/70">
            <div>
              <p className="font-heading text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">
                {company.headquarters.label}
              </p>
              <address className="mt-2 not-italic leading-relaxed">
                {company.headquarters.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>
            <div>
              <p className="font-heading text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">
                {company.branch.label}
              </p>
              <address className="mt-2 not-italic leading-relaxed">
                {company.branch.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>
            <div className="space-y-1.5">
              <a
                href={company.mobileHref}
                className="block transition-colors hover:text-brand-red"
              >
                Mobile: {company.mobile}
              </a>
              <a
                href={company.telephoneHref}
                className="block transition-colors hover:text-brand-red"
              >
                Telephone: {company.telephone}
              </a>
              <a
                href={`mailto:${company.email}`}
                className="block break-all transition-colors hover:text-brand-red"
              >
                {company.email}
              </a>
              <a
                href={`https://${company.website}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-brand-red"
              >
                {company.website}
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-[11.5px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.name} All rights reserved.
          </p>
          <p>PCAB Licensed Contractor · PCAB AAA Accredited · PhilGEPS Platinum Member</p>
        </div>
      </div>
    </footer>
  );
}