// @ts-nocheck
"use client";
import { useSearchParams } from "@/lib/router";
import { MapPin, Phone, Mail, Globe, Building } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import InquiryForm from "@/components/contact/InquiryForm";
import { company } from "@/data/company";
import { getContactDefaults } from "@/contact";

export default function Contact() {
  const searchParams = useSearchParams();
  const { defaultType, defaultMessage } = getContactDefaults(searchParams.toString());

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Discuss your project with our team"
        description="Share your scope, location, and requirements. Inquiries are reviewed by our construction, concrete, and equipment teams."
        image="https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/12744c7e4_generated_fe2139ed.png"
        imageAlt="Construction site at dusk with floodlit structure"
      />

      <section className="bg-brand-light py-16 lg:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="h-[3px] w-8 bg-brand-red" />
              <span className="eyebrow text-brand-red">Office Directory</span>
            </div>
            <h2 className="mt-4 text-[24px] font-extrabold uppercase leading-tight text-brand-black sm:text-[30px]">
              Head office and branch
            </h2>

            <div className="mt-8 space-y-4">
              {[company.headquarters, company.branch].map((office) => (
                <div key={office.label} className="border border-brand-line border-l-[3px] border-l-brand-red bg-white p-6">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-brand-red" aria-hidden="true" />
                    <h3 className="font-heading text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-red">
                      {office.label}
                    </h3>
                  </div>
                  <address className="mt-3 text-[14px] not-italic leading-relaxed text-brand-black">
                    {office.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.mapQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 font-heading text-[10.5px] font-bold uppercase tracking-[0.12em] text-brand-gray transition-colors hover:text-brand-red"
                  >
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    Open in maps
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-4 divide-y divide-brand-line border border-brand-line bg-white">
              <a href={company.mobileHref} className="flex items-center gap-3 p-5 transition-colors hover:bg-brand-light">
                <Phone className="h-4 w-4 shrink-0 text-brand-red" aria-hidden="true" />
                <span>
                  <span className="block text-[10px] uppercase tracking-[0.14em] text-brand-muted">Mobile</span>
                  <span className="mt-0.5 block font-heading text-[13.5px] font-bold text-brand-black">
                    {company.mobile}
                  </span>
                </span>
              </a>
              <a href={company.telephoneHref} className="flex items-center gap-3 p-5 transition-colors hover:bg-brand-light">
                <Phone className="h-4 w-4 shrink-0 text-brand-red" aria-hidden="true" />
                <span>
                  <span className="block text-[10px] uppercase tracking-[0.14em] text-brand-muted">Telephone</span>
                  <span className="mt-0.5 block font-heading text-[13.5px] font-bold text-brand-black">
                    {company.telephone}
                  </span>
                </span>
              </a>
              <a href={`mailto:${company.email}`} className="flex items-center gap-3 p-5 transition-colors hover:bg-brand-light">
                <Mail className="h-4 w-4 shrink-0 text-brand-red" aria-hidden="true" />
                <span>
                  <span className="block text-[10px] uppercase tracking-[0.14em] text-brand-muted">Email</span>
                  <span className="mt-0.5 block font-heading text-[13.5px] font-bold text-brand-black">
                    {company.email}
                  </span>
                </span>
              </a>
              <a
                href={`https://${company.website}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-5 transition-colors hover:bg-brand-light"
              >
                <Globe className="h-4 w-4 shrink-0 text-brand-red" aria-hidden="true" />
                <span>
                  <span className="block text-[10px] uppercase tracking-[0.14em] text-brand-muted">Website</span>
                  <span className="mt-0.5 block font-heading text-[13.5px] font-bold text-brand-black">
                    {company.website}
                  </span>
                </span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <InquiryForm defaultType={defaultType} defaultMessage={defaultMessage} />
          </div>
        </div>
      </section>
    </>
  );
}
