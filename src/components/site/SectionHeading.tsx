// @ts-nocheck
"use client";
export default function SectionHeading({
  eyebrow,
  title,
  description,
  invert = false,
  align = "left",
  className = "",
}) {
  const centered = align === "center";

  return (
    <div className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-3xl"} ${className}`}>
      {eyebrow && (
        <div className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
          <span className="h-[3px] w-8 bg-brand-red" />
          <span className={`eyebrow ${invert ? "text-white/55" : "text-brand-red"}`}>
            {eyebrow}
          </span>
        </div>
      )}
      <h2
        className={`mt-5 text-[26px] font-extrabold uppercase leading-[1.12] sm:text-[34px] lg:text-[40px] ${
          invert ? "text-white" : "text-brand-black"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 text-[15px] leading-[1.7] sm:text-base ${
            invert ? "text-white/65" : "text-brand-gray"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
