// @ts-nocheck
"use client";
import { useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { Search, ArrowRight, Info } from "lucide-react";
import { Image } from "@/components/ui/image";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import { equipmentCategories, equipmentSpecNote } from "@/data/equipment";

export default function Equipment() {
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");

  const sections = useMemo(() => {
    const term = query.trim().toLowerCase();
    return equipmentCategories
      .filter((category) => active === "all" || category.id === active)
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            !term ||
            item.name.toLowerCase().includes(term) ||
            category.name.toLowerCase().includes(term),
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [active, query]);

  return (
    <>
      <PageHero
        eyebrow="Equipment & Fleet"
        title="Owned equipment resources for project execution"
        description="A fleet spanning earthmoving, road construction, pile-driving, lifting, transport, and concrete production and placement."
        image="https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/085c9e5a8_generated_89329c4a.png"
        imageAlt="Stationary concrete batching plant with aggregate bins and cement silos"
      />

      <section className="border-b border-brand-line bg-brand-light">
        <div className="container-x py-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActive("all")}
                aria-pressed={active === "all"}
                className={`border px-3.5 py-2 font-heading text-[10.5px] font-bold uppercase tracking-[0.1em] transition-colors ${
                  active === "all"
                    ? "border-brand-red bg-brand-red text-white"
                    : "border-brand-line bg-white text-brand-gray hover:border-brand-black hover:text-brand-black"
                }`}
              >
                All categories
              </button>
              {equipmentCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActive(category.id)}
                  aria-pressed={active === category.id}
                  className={`border px-3.5 py-2 font-heading text-[10.5px] font-bold uppercase tracking-[0.1em] transition-colors ${
                    active === category.id
                      ? "border-brand-red bg-brand-red text-white"
                      : "border-brand-line bg-white text-brand-gray hover:border-brand-black hover:text-brand-black"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="relative lg:w-72">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted"
                aria-hidden="true"
              />
              <label htmlFor="equipment-search" className="sr-only">
                Search equipment
              </label>
              <input
                id="equipment-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search equipment"
                className="w-full border border-brand-line bg-white py-2.5 pl-9 pr-3 text-sm text-brand-black placeholder:text-brand-muted focus:border-brand-black focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <div className="container-x">
          <p className="flex items-start gap-2.5 border-l-2 border-brand-red bg-brand-light p-4 text-[12.5px] leading-relaxed text-brand-gray">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" aria-hidden="true" />
            {equipmentSpecNote}
          </p>

          {sections.length === 0 && (
            <div className="mt-12 border border-brand-line p-10 text-center">
              <p className="font-heading text-[15px] font-bold uppercase text-brand-black">
                No equipment matched your search.
              </p>
              <p className="mt-2 text-sm text-brand-gray">
                Try another term, or ask our team about the equipment you need.
              </p>
              <Link
                to="/contact?type=Equipment%20Rental"
                className="mt-6 inline-flex items-center gap-2 bg-brand-red px-6 py-3 font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-redDark"
              >
                Ask our team
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          )}

          <div className="mt-10 space-y-14">
            {sections.map((category) => (
              <div key={category.id} id={category.id} className="scroll-mt-28">
                <div className="grid gap-8 border-t-2 border-brand-black pt-8 lg:grid-cols-12 lg:gap-12">
                  <div className="lg:col-span-4">
                    <div className="relative aspect-[4/3] overflow-hidden bg-brand-charcoal">
                      <Image
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h2 className="mt-5 font-heading text-[17px] font-extrabold uppercase leading-snug text-brand-black">
                      {category.name}
                    </h2>
                    <p className="mt-2.5 text-[13px] leading-relaxed text-brand-gray">
                      {category.blurb}
                    </p>
                  </div>

                  <div className="lg:col-span-8">
                    <ul className="divide-y divide-brand-line border-y border-brand-line">
                      {category.items.map((item) => (
                        <li
                          key={item.name}
                          className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <h3 className="font-heading text-[14px] font-bold uppercase tracking-[0.02em] text-brand-black">
                              {item.name}
                            </h3>
                            {item.specs.length > 0 ? (
                              <dl className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1">
                                {item.specs.map((spec) => (
                                  <div key={spec.label} className="flex items-baseline gap-1.5">
                                    <dt className="text-[10.5px] uppercase tracking-[0.1em] text-brand-muted">
                                      {spec.label}
                                    </dt>
                                    <dd className="font-heading text-[12px] font-bold text-brand-black">
                                      {spec.value}
                                    </dd>
                                  </div>
                                ))}
                              </dl>
                            ) : (
                              <p className="mt-1.5 text-[11.5px] text-brand-muted">
                                Detailed specifications issued on request
                              </p>
                            )}
                          </div>
                          <Link
                            to={`/contact?type=Equipment%20Rental&equipment=${encodeURIComponent(item.name)}`}
                            className="inline-flex shrink-0 items-center gap-1.5 font-heading text-[10px] font-bold uppercase tracking-[0.12em] text-brand-red transition-colors hover:text-brand-redDark"
                          >
                            Inquire
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        headline="Need equipment for your next project?"
        text="Contact our team to discuss equipment requirements, project conditions, and availability."
        primaryLabel="Inquire About Equipment"
        secondaryLabel="Contact Our Team"
      />
    </>
  );
}