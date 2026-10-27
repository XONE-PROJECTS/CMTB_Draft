// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "@/lib/router";
import { Menu, X, Phone, Mail, ArrowRight } from "lucide-react";
import Logo from "./Logo";
import { company, navigation } from "@/data/company";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-line bg-white">
      <div className="hidden border-b border-white/10 bg-brand-black md:block">
        <div className="container-x flex h-9 items-center justify-between text-[11px] font-medium tracking-wide text-white/65">
          <p>Ortigas Center, Pasig City &nbsp;·&nbsp; San Fernando City, La Union</p>
          <div className="flex items-center gap-6">
            <a
              href={company.mobileHref}
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Phone className="h-3 w-3" aria-hidden="true" />
              {company.mobile}
            </a>
            <a
              href={`mailto:${company.email}`}
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Mail className="h-3 w-3" aria-hidden="true" />
              {company.email}
            </a>
          </div>
        </div>
      </div>

      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `relative py-2 font-heading text-[12.5px] font-semibold uppercase tracking-[0.09em] transition-colors ${
                  isActive ? "text-brand-red" : "text-brand-black hover:text-brand-red"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <span
                    className={`absolute -bottom-[1px] left-0 h-[2px] bg-brand-red transition-all duration-300 ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden items-center gap-2 bg-brand-red px-5 py-3 font-heading text-[11.5px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-brand-redDark md:inline-flex"
          >
            Request a Consultation
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center border border-brand-line text-brand-black transition-colors hover:border-brand-black lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-brand-black lg:hidden">
          <div className="flex h-[72px] shrink-0 items-center justify-between px-5">
            <Logo variant="light" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation menu"
              className="flex h-11 w-11 items-center justify-center border border-white/20 text-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 pb-10">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex items-center justify-between border-b border-white/10 py-4 font-heading text-[19px] font-semibold ${
                    isActive ? "text-brand-red" : "text-white"
                  }`
                }
              >
                {item.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </NavLink>
            ))}
            <div className="mt-8 space-y-2 text-sm text-white/60">
              <a href={company.mobileHref} className="block hover:text-white">
                Mobile: {company.mobile}
              </a>
              <a href={company.telephoneHref} className="block hover:text-white">
                Telephone: {company.telephone}
              </a>
              <a href={`mailto:${company.email}`} className="block hover:text-white">
                {company.email}
              </a>
            </div>
            <Link
              to="/contact"
              className="mt-8 flex items-center justify-center gap-2 bg-brand-red px-5 py-4 font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-white"
            >
              Request a Consultation
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}